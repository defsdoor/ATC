const metresToNm = (metres) => metres / 1852

const HoldPhase = {
  OUTBOUND_LEG: 0,
  OUTBOUND_TURN: 1,
  INBOUND_LEG: 2,
  INBOUND_TURN: 3,
  INBOUND: 4,
  OUTBOUND: 5,
}

function speedChangeRates(category, wakeCategory) {
  if (category === 'business') {
    return {
      accelerateRate: 5,
      decelerateRate: 8,
    }
  }

  if (category === 'turboprop') {
    return {
      accelerateRate: 3,
      decelerateRate: 5,
    }
  }

  if (category === 'regional') {
    return {
      accelerateRate: 4,
      decelerateRate: 6,
    }
  }

  switch (wakeCategory) {
    case 'J': // A380
      return {
        accelerateRate: 2,
        decelerateRate: 4,
      }

    case 'H': // 777, 787, A350, etc.
      return {
        accelerateRate: 2.5,
        decelerateRate: 5,
      }

    case 'M': // A320, 737
      return {
        accelerateRate: 2,
        decelerateRate: 3,
      }

    case 'L':
      return {
        accelerateRate: 4,
        decelerateRate: 7,
      }

    default:
      return {
        accelerateRate: 3,
        decelerateRate: 5,
      }
  }
}

class Radar {
  constructor(canvasID, airport) {
    this.canvasID = canvasID
    this.radarRange = airport.radarRange
    this.radarWidth = this.radarRange * 2
    this.airport = airport

    this.canvas = document.getElementById(canvasID)
    this.ctx = this.canvas.getContext('2d')
    this.airplanes = []
  }

  update(deltaSeconds) {
    this.airplanes.forEach((airplane) => {
      airplane.update(deltaSeconds)
    })
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)

    this.drawRangeRings()
    this.airport.runways.forEach((runway) => {
      this.drawRunway(runway)
      runway.approaches.forEach((approach) => {
        this.drawApproachLabel(approach)
        if (approach.active && approach.ils) {
          this.drawILS(approach)
        }
      })
    })
    this.airport.holdMarkers.forEach((hold) => {
      this.drawHoldMarker(hold)
    })
    this.airplanes.forEach((airplane) => {
      this.drawAirplaneTrail(airplane)
      this.drawAirplane(airplane)
    })
  }
  resize() {
    const rect = this.canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio

    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(dpr, dpr)

    this.width = rect.width
    this.height = rect.height

    this.updateCanvasScale()
  }

  updateCanvasScale() {
    this.pixelsPerNm = Math.min(this.width, this.height) / this.radarWidth

    this.positionOnCanvas = {
      x: this.width / 2,
      y: this.height / 2,
    }
  }

  worldToCanvasScale(position) {
    return {
      x: this.positionOnCanvas.x + position.x * this.pixelsPerNm,
      y: this.positionOnCanvas.y + position.y * this.pixelsPerNm,
    }
  }

  nmToPixels(nm) {
    return nm * this.pixelsPerNm
  }

  pixelsToNm(pixels) {
    return pixels / this.pixelsPerNm
  }
  offsetRelativeToHeading(offset, heading) {
    const lateral = offset.offset
    const behind = offset.distance

    const radians = (heading * Math.PI) / 180

    return new Position(
      // right/left component
      Math.cos(radians) * lateral - Math.sin(radians) * behind,

      // backwards along heading component
      -Math.sin(radians) * lateral - Math.cos(radians) * behind
    )
  }

  drawRunway(runway) {
    const halfWidth = Math.max(5 / this.pixelsPerNm, runway.width) / 2

    const start = runway.position

    const end = start.getOffsetByDistance(runway.length, runway.heading)

    const startLeft = start.getOffsetByDistance(halfWidth, runway.heading - 90)

    const startRight = start.getOffsetByDistance(halfWidth, runway.heading + 90)

    const endLeft = end.getOffsetByDistance(halfWidth, runway.heading - 90)

    const endRight = end.getOffsetByDistance(halfWidth, runway.heading + 90)

    const points = [
      this.worldToCanvasScale(startLeft),
      this.worldToCanvasScale(endLeft),
      this.worldToCanvasScale(endRight),
      this.worldToCanvasScale(startRight),
    ]

    const ctx = this.ctx

    ctx.fillStyle = '#444444'

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    points.slice(1).forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })

    ctx.closePath()
    ctx.fill()
  }

  drawHoldMarker(holdMarker) {
    const ctx = this.ctx

    const point = this.worldToCanvasScale(holdMarker.position)

    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 2

    // fix circle
    ctx.beginPath()
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
    ctx.stroke()

    // inbound course indicator
    const end = holdMarker.position.getOffsetByDistance(
      2,
      holdMarker.inboundHeading
    )

    const endPoint = this.worldToCanvasScale(end)

    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.stroke()

    // label
    ctx.fillStyle = '#00ffff'
    ctx.font = '11px monospace'
    ctx.fillText(
      `${holdMarker.code} ${holdMarker.inboundHeading}`,
      point.x + 8,
      point.y - 8
    )
  }

  drawAirplaneTrail(airplane) {
    const ctx = this.ctx

    if (airplane.history.length < 2) {
      return
    }

    airplane.history.forEach((position, index) => {
      const alpha = index / airplane.history.length

      ctx.fillStyle = `rgba(100,100,100,${alpha})`

      const point = this.worldToCanvasScale(position)

      ctx.beginPath()
      ctx.arc(point.x, point.y, 1, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  drawAirplane(airplane) {
    const ctx = this.ctx

    const canvasPosition = this.worldToCanvasScale(airplane.position)

    // aircraft symbol
    ctx.save()

    ctx.translate(canvasPosition.x, canvasPosition.y)

    // Canvas rotation is clockwise, heading is clockwise from north.
    // Convert heading to canvas coordinates.
    const radians = (airplane.heading * Math.PI) / 180
    ctx.rotate(radians)

    ctx.fillStyle = '#FFFFFF'

    const side = 10
    const height = (side * Math.sqrt(3)) / 2

    ctx.beginPath()

    // nose (forward)
    ctx.moveTo(0, (-height * 2) / 3)

    // left rear
    ctx.lineTo(-side / 2, height / 3)

    // right rear
    ctx.lineTo(side / 2, height / 3)

    ctx.closePath()
    ctx.fill()

    ctx.restore()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '12px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    ctx.fillText(
      `${airplane.callsign}`,
      canvasPosition.x + 12,
      canvasPosition.y - 8
    )

    ctx.fillText(
      `${airplane.displayAltitude}`,
      canvasPosition.x + 12,
      canvasPosition.y + 6
    )
    ctx.fillText(
      `${Math.round(airplane.speed)}`,
      canvasPosition.x + 12,
      canvasPosition.y + 20
    )
  }

  drawApproachLabel(approach) {
    const ctx = this.ctx

    const offset = this.offsetRelativeToHeading(
      approach.labelOffset,
      approach.heading
    )

    const labelPosition = approach.threshold.getOffsetBy(offset)

    const point = this.worldToCanvasScale(labelPosition)

    ctx.fillStyle = '#777777'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillText(approach.designation, point.x, point.y)
  }

  drawRangeRings() {
    const ctx = this.ctx

    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1

    const centre = this.positionOnCanvas

    for (let distance = 10; distance <= this.radarRange; distance += 10) {
      const radius = distance * this.pixelsPerNm

      ctx.beginPath()
      ctx.arc(centre.x, centre.y, radius, 0, Math.PI * 2)
      ctx.stroke()

      // distance label
      ctx.fillStyle = '#555555'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'

      ctx.fillText(`${distance}`, centre.x + 5, centre.y - radius - 5)
    }
  }

  drawILS(approach) {
    const ctx = this.ctx

    const ils = approach.ils
    const approachHeading = (approach.heading + 180) % 360

    const leftEnd = approach.threshold.getOffsetByDistance(
      ils.range,
      approachHeading - ils.captureAngle
    )

    const rightEnd = approach.threshold.getOffsetByDistance(
      ils.range,
      approachHeading + ils.captureAngle
    )

    const start = this.worldToCanvasScale(approach.threshold)
    const left = this.worldToCanvasScale(leftEnd)
    const right = this.worldToCanvasScale(rightEnd)

    ctx.strokeStyle = 'yellow'
    ctx.setLineDash([2, 2])

    ctx.beginPath()

    ctx.moveTo(start.x, start.y)
    ctx.lineTo(left.x, left.y)

    ctx.moveTo(start.x, start.y)
    ctx.lineTo(right.x, right.y)

    ctx.stroke()

    ctx.setLineDash([])
  }
}

class AircraftCommand {
  constructor(type, data = {}, options = {}) {
    this.type = type
    this.data = data
    this.waitForCompletion = options.waitForCompletion ?? false
  }

  static heading(heading, direction = null, options = {}) {
    return new AircraftCommand('HEADING', { heading, direction }, options)
  }

  static altitude(altitude, options = {}) {
    return new AircraftCommand('ALTITUDE', { altitude }, options)
  }

  static speed(speed, options = {}) {
    return new AircraftCommand('SPEED', { speed }, options)
  }

  static hold(data, options = {}) {
    return new AircraftCommand('HOLD', data, options)
  }
}

class HoldingPattern {
  constructor(turnDirection, legLength) {
    this.turnDirection = turnDirection || 'right'
    this.legLength = legLength || 3
    this.phase = HoldPhase.OUTBOUND_LEG
  }
}

class AircraftType {
  constructor(
    manufacturer,
    model,
    landingSpeed,
    approachSpeed,
    cruiseSpeed,
    turnPerformance,
    climbRate,
    descendRate,
    wakeCategory,
    category
  ) {
    this.manufacturer = manufacturer
    this.model = model

    this.landingSpeed = landingSpeed // knots (minimum/reference)
    this.approachSpeed = approachSpeed // knots (typical final)
    this.cruiseSpeed = cruiseSpeed // knots

    this.turnPerformance = turnPerformance // degrees/sec

    this.climbRate = climbRate // ft/min
    this.descendRate = descendRate // ft/min

    this.wakeCategory = wakeCategory // L/M/H/J
    this.category = category // airliner/regional/turboprop/business

    const speed = speedChangeRates(category, wakeCategory)
    this.accelerateRate = speed.accelerateRate
    this.decelerateRate = speed.decelerateRate
  }

  get maxSpeed() {
    return this.cruiseSpeed
  }

  get name() {
    return `${this.manufacturer} ${this.model}`
  }
}

class Airport {
  constructor(name, iataCode, icaoCode, runways, holdMarkers, radarRange) {
    this.name = name
    this.iataCode = iataCode
    this.icaoCode = icaoCode
    this.runways = runways
    this.holdMarkers = holdMarkers
    this.radarRange = radarRange
  }
}

class HoldMarker {
  constructor(code, name, position, inboundHeading, turnDirection) {
    this.code = code
    this.name = name
    this.position = position
    this.inboundHeading = inboundHeading
    this.turnDirection = turnDirection
  }
}

class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  rotate(heading) {
    const radians = (heading * Math.PI) / 180

    return new Position(
      this.x * Math.cos(radians) + this.y * Math.sin(radians),
      -this.x * Math.sin(radians) + this.y * Math.cos(radians)
    )
  }

  offsetBy(position) {
    const newPosition = this.getOffsetBy(position)
    this.x = newPosition.x
    this.y = newPosition.y
    return this
  }

  getOffsetBy(position) {
    return new Position(this.x + position.x, this.y + position.y)
  }

  offsetByDistance(distance, heading) {
    const newPosition = this.getOffsetByDistance(distance, heading)
    this.x = newPosition.x
    this.y = newPosition.y
    return this
  }

  getOffsetByDistance(distance, heading) {
    const offset = this.distanceOffset(distance, heading)
    return this.getOffsetBy(offset)
  }

  distanceOffset(distance, heading) {
    const radians = (heading * Math.PI) / 180

    return new Position(
      Math.sin(radians) * distance,
      -Math.cos(radians) * distance
    )
  }
}

class Approach {
  constructor(
    runway,
    designation,
    threshold,
    heading,
    active,
    ils,
    labelOffset = { x: 0, y: 0 }
  ) {
    this.runway = runway
    this.designation = designation
    this.threshold = threshold // a position
    this.heading = heading
    this.active = active
    this.ils = ils
    this.labelOffset = labelOffset
  }
}

class Runway {
  constructor(
    designation,
    position,
    heading,
    length,
    width = 45,
    ils = null,
    labelOffset = { distance: 10, offset: 5 }
  ) {
    this.designation = designation
    this.position = position
    this.heading = heading
    this.length = length
    this.width = width
    this.labelOffset = labelOffset
    this.ils = ils

    const oppositeEnd = position.getOffsetByDistance(length, heading)

    this.approaches = [
      new Approach(
        this,
        designation,
        position,
        heading,
        true,
        ils,
        this.labelOffset
      ),
      new Approach(
        this,
        this.reciprocalDesignation(designation),
        oppositeEnd,
        (heading + 180) % 360,
        false,
        ils,
        {
          distance: this.labelOffset.distance,
          offset: -this.labelOffset.offset,
        }
      ),
    ]
  }

  reciprocalDesignation(designation) {
    const number = parseInt(designation)
    const reciprocalNumber = (number + 18) % 36 || 36

    const side = designation.slice(-1)

    const reciprocalSide = side === 'L' ? 'R' : side === 'R' ? 'L' : side

    return `${String(reciprocalNumber).padStart(2, '0')}${reciprocalSide}`
  }
}

class ILS {
  constructor(range = 18, captureAngle = 35, glideAngle = 3) {
    this.range = range // NM
    this.captureAngle = captureAngle // NM
    this.glideAngle = glideAngle // degrees
  }
}

class Aircraft {
  constructor(type, position) {
    this.type = type
    this.position = position
  }
}

class Airline {
  constructor(name, iataCode, icaoCode, callsign, fleet = []) {
    this.name = name
    this.iataCode = iataCode
    this.icaoCode = icaoCode
    this.callsign = callsign
    this.fleet = fleet
  }
}

class Airplane {
  constructor(
    airline,
    flightNumber,
    aircraftType,
    position,
    heading,
    speed,
    altitude
  ) {
    this.airline = airline
    this.flightNumber = flightNumber
    this.callsign = `${airline.icaoCode}${flightNumber}`

    this.aircraftType = aircraftType
    this.position = position

    this.heading = heading
    this.speed = speed
    this.altitude = altitude

    this.targetHeading = heading
    this.targetAltitude = altitude
    this.targetSpeed = speed

    this.history = []
    this.historyTimer = 0
    this.historyInterval = 1
    this.maxHistory = 60
    this.commands = []
    this.activeCommand = null

    this.hold = null
  }

  enterHold(data) {
    this.hold = new HoldingPattern(data.turnDirection, data.legLength)
    this.hold.legStart = this.position

    this.hold.legStart = new Position(this.position.x, this.position.y)
    this.hold.phase = HoldPhase.OUTBOUND_LEG
    this.hold.inboundHeading = this.heading

    // slow to holding speed
    this.targetSpeed = this.holdingSpeed()
  }

  holdingSpeed() {
    switch (this.aircraftType.wakeCategory) {
      case 'J':
      case 'H':
        return 240

      case 'M':
        return 220

      default:
        return 180
    }
  }

  issueCommand(command) {
    if (command.waitForCompletion) {
      this.commands.push(command)

      if (!this.activeCommand) {
        this.activateNextCommand()
      }
    } else {
      this.executeCommand(command)
    }
  }

  commandComplete() {
    this.activeCommand = null
    this.activateNextCommand()
  }

  updateCommandState() {
    if (!this.activeCommand) {
      this.activateNextCommand()
      return
    }

    switch (this.activeCommand.type) {
      case 'ALTITUDE':
        if (Math.abs(this.altitude - this.targetAltitude) < 50) {
          this.completeCommand()
        }
        break

      case 'SPEED':
        if (Math.abs(this.speed - this.targetSpeed) < 2) {
          this.completeCommand()
        }
        break

      case 'HEADING':
        if (this.remainingTurn() < 1) {
          this.completeCommand()
        }
        break
    }
  }

  completeCommand() {
    this.activeCommand = null
    this.activateNextCommand()
  }

  updateCommandCompletion() {
    if (!this.activeCommand) {
      return
    }

    switch (this.activeCommand.type) {
      case 'HEADING':
        if (this.remainingTurn() < 1) {
          this.activeCommand = null
        }
        break

      case 'ALTITUDE':
        if (Math.abs(this.altitude - this.targetAltitude) < 50) {
          this.activeCommand = null
        }
        break

      case 'SPEED':
        if (Math.abs(this.speed - this.targetSpeed) < 2) {
          this.activeCommand = null
        }
        break
    }
  }

  activateCommand(command) {
    this.activeCommand = command
    this.executeCommand(command)
  }

  activateNextCommand() {
    this.activeCommand = this.commands.shift()

    if (!this.activeCommand) {
      return
    }

    console.log('Command:', this.activeCommand)
    this.executeCommand(this.activeCommand)
  }

  executeCommand(command) {
    switch (command.type) {
      case 'HEADING':
        this.hold = null
        this.turnTo(command.data.heading, command.data.direction)
        break

      case 'ALTITUDE':
        this.targetAltitude = command.data.altitude
        break

      case 'SPEED':
        this.targetSpeed = command.data.speed
        break

      case 'HOLD':
        this.enterHold(command.data)
        break
    }
  }

  get altitudeTrend() {
    const difference = this.targetAltitude - this.altitude

    if (Math.abs(difference) < 100) {
      return ''
    }

    return difference > 0 ? '↑' : '↓'
  }

  get displayAltitude() {
    if (this.altitude >= 6000) {
      return `FL${Math.round(this.altitude / 100)
        .toString()
        .padStart(3, '0')}${this.altitudeTrend}`
    }

    return `${Math.round(this.altitude).toString()}${this.altitudeTrend}`
  }

  turnTo(heading, direction = null) {
    this.targetHeading = heading % 360
    this.turnDirection = direction
  }

  climbTo(altitude) {
    this.targetAltitude = altitude
  }

  descendTo(altitude) {
    this.targetAltitude = altitude
  }

  reduceSpeedTo(speed) {
    this.setSpeed(speed)
  }

  increaseSpeedTo(speed) {
    this.setSpeed(speed)
  }
  setSpeed(speed) {
    this.targetSpeed = Math.min(speed, this.aircraftType.maxSpeed)
  }

  remainingTurn() {
    switch (this.turnDirection) {
      case 'left':
        return (this.heading - this.targetHeading + 360) % 360

      case 'right':
        return (this.targetHeading - this.heading + 360) % 360

      case 'shortest':
      default:
        return ((this.targetHeading - this.heading + 540) % 360) - 180
    }
  }

  turnDecision() {
    if (this.turnDirection === 'left') {
      return {
        direction: -1,
        remaining: (this.heading - this.targetHeading + 360) % 360,
      }
    }

    if (this.turnDirection === 'right') {
      return {
        direction: 1,
        remaining: (this.targetHeading - this.heading + 360) % 360,
      }
    }

    const diff = ((this.targetHeading - this.heading + 540) % 360) - 180

    return {
      direction: Math.sign(diff),
      remaining: Math.abs(diff),
    }
  }

  speedChangeRateModifier() {
    if (this.altitude < 3000) {
      return 1.2
    }

    if (this.altitude < 10000) {
      return 1.1
    }

    return 1
  }

  updateSpeed(deltaSeconds) {
    const difference = this.targetSpeed - this.speed

    if (Math.abs(difference) < 0.1) {
      this.speed = this.targetSpeed
      return
    }

    let rate =
      difference > 0
        ? this.aircraftType.accelerateRate
        : this.aircraftType.decelerateRate

    rate *= this.speedChangeRateModifier()

    const change = rate * deltaSeconds

    this.speed += Math.sign(difference) * Math.min(Math.abs(difference), change)

    // safety limit
    this.speed = Math.min(this.speed, this.aircraftType.maxSpeed)
  }

  getClimbPerformanceFactor() {
    const type = this.aircraftType

    if (this.speed < type.landingSpeed) return 0.2

    if (this.speed < type.approachSpeed) return 0.7

    if (this.speed < type.cruiseSpeed) return 1

    return 0.8
  }

  updateAltitude(deltaSeconds) {
    const factor = this.getClimbPerformanceFactor()

    if (this.altitude < this.targetAltitude) {
      const rate = this.aircraftType.climbRate * factor
      const climb = (rate / 60) * deltaSeconds

      this.altitude = Math.min(this.altitude + climb, this.targetAltitude)
    } else if (this.altitude > this.targetAltitude) {
      const rate = this.aircraftType.descendRate
      const descent = (rate / 60) * deltaSeconds

      this.altitude = Math.max(this.altitude - descent, this.targetAltitude)
    }
  }

  updateHold(deltaSeconds) {
    switch (this.hold.phase) {
      case HoldPhase.INBOUND:
        this.turnTo(
          (this.hold.inboundHeading + 180) % 360,
          this.hold.turnDirection
        )
        this.hold.phase = HoldPhase.INBOUND_TURN
        break

      case HoldPhase.INBOUND_TURN:
        if (this.remainingTurn() < 1) {
          this.startHoldLeg()
          this.hold.phase = HoldPhase.INBOUND_LEG
        }
        break
      case HoldPhase.INBOUND_LEG:
        if (this.distanceFrom(this.hold.legStart) >= this.hold.legLength)
          this.hold.phase = HoldPhase.OUTBOUND
        break

      case HoldPhase.OUTBOUND:
        this.turnTo(this.hold.inboundHeading, this.hold.turnDirection)
        this.hold.phase = HoldPhase.OUTBOUND_TURN
        break
      case HoldPhase.OUTBOUND_TURN:
        if (this.remainingTurn() < 1) {
          this.startHoldLeg()
          this.hold.phase = HoldPhase.OUTBOUND_LEG
        }
        break
      case HoldPhase.OUTBOUND_LEG:
        if (this.distanceFrom(this.hold.legStart) >= this.hold.legLength)
          this.hold.phase = HoldPhase.INBOUND
        break
    }
  }

  startHoldLeg() {
    this.hold.legStart = new Position(this.position.x, this.position.y)
  }

  distanceFrom(position) {
    const dx = this.position.x - position.x
    const dy = this.position.y - position.y

    return Math.sqrt(dx * dx + dy * dy)
  }

  updateHeading(deltaSeconds) {
    const amount = this.aircraftType.turnPerformance * deltaSeconds
    const turn = this.turnDecision()

    if (turn.remaining <= amount) {
      this.heading = this.targetHeading
      this.turnDirection = 'shortest'
      return
    }

    this.heading += turn.direction * amount
    this.heading = (this.heading + 360) % 360
  }

  update(deltaSeconds) {
    this.updateCommandCompletion()

    if (this.hold) {
      this.updateHold(deltaSeconds)
    }

    this.updateHeading(deltaSeconds)
    this.updateAltitude(deltaSeconds)
    this.updateSpeed(deltaSeconds)
    this.updatePosition(deltaSeconds)
    this.updateTrail(deltaSeconds)
  }

  updatePosition(deltaSeconds) {
    // knots -> nautical miles per second
    const distance = (this.speed * deltaSeconds) / 3600

    this.position.offsetByDistance(distance, this.heading)
  }

  updateTrail(deltaSeconds) {
    this.historyTimer += deltaSeconds

    if (this.historyTimer >= this.historyInterval) {
      this.history.push(new Position(this.position.x, this.position.y))

      this.historyTimer = 0
    }

    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }
  }
}

class FleetEntry {
  constructor(type, count) {
    this.type = type
    this.count = count
  }
}

// prettier-ignore
const aircraftTypeList = [
  // manufacturer, model, landingSpeed, approachSpeed, cruiseSpeed, turnPerformance, climbRate, descendRate, wakeCategory, category
  // Airbus narrow body
  new AircraftType( 'Airbus', 'A318', 125, 135, 430, 3.2, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A220-300', 125, 135, 445, 3.2, 3000, 1800, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A319', 130, 140, 445, 3.1, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A319neo', 130, 140, 445, 3.1, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Airbus', 'A320', 135, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A320neo', 135, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Airbus', 'A321', 145, 150, 450, 2.9, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A321neo', 145, 150, 450, 2.8, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A321LR', 145, 150, 450, 2.8, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A321XLR', 145, 150, 450, 2.8, 3000, 2000, 'M', 'airliner'),

  // Airbus wide body
  new AircraftType( 'Airbus', 'A330-200', 145, 150, 470, 2.7, 2500, 1800, 'H', 'airliner'),
  new AircraftType( 'Airbus', 'A330-300', 145, 150, 470, 2.6, 2500, 1800, 'H', 'airliner'),
  new AircraftType( 'Airbus', 'A330-900neo', 145, 150, 470, 2.6, 2500, 1800, 'H', 'airliner'),

  new AircraftType( 'Airbus', 'A340-300', 150, 155, 480, 2.5, 2200, 1800, 'H', 'airliner'),

  new AircraftType( 'Airbus', 'A350-900', 150, 155, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Airbus', 'A350-1000', 155, 160, 490, 2.3, 2500, 2000, 'H', 'airliner'),

  new AircraftType( 'Airbus', 'A380-800', 180, 150, 450, 2.0, 2000, 1500, 'J', 'airliner'),

  // Boeing narrow body
  new AircraftType( 'Boeing', '717-200', 120, 130, 440, 3.3, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Boeing', '737-700', 130, 140, 450, 3.1, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737-800', 140, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737-900ER', 145, 150, 450, 2.9, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Boeing', '737 MAX 8', 140, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737 MAX 9', 145, 150, 450, 2.9, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737 MAX 10', 150, 155, 450, 2.8, 3000, 2000, 'M', 'airliner'),

  // Boeing wide body
  new AircraftType( 'Boeing', '747-400', 160, 155, 490, 2.2, 2000, 1500, 'H', 'airliner'),
  new AircraftType( 'Boeing', '747-8', 160, 155, 490, 2.1, 2000, 1500, 'H', 'airliner'),

  new AircraftType( 'Boeing', '767-300ER', 145, 150, 460, 2.7, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '767-400ER', 150, 155, 460, 2.6, 2500, 2000, 'H', 'airliner'),

  new AircraftType( 'Boeing', '777-200', 155, 160, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '777-200ER', 155, 160, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '777-300ER', 155, 160, 490, 2.3, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '777-9', 160, 160, 490, 2.2, 2500, 2000, 'H', 'airliner'),

  new AircraftType( 'Boeing', '777F', 155, 160, 490, 2.3, 2500, 2000, 'H', 'cargo'),

  new AircraftType( 'Boeing', '787-8', 145, 150, 490, 2.5, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '787-9', 150, 155, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '787-10', 155, 160, 490, 2.3, 2500, 2000, 'H', 'airliner'),

  // Embraer
  new AircraftType( 'Embraer', 'E170', 120, 125, 430, 3.4, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E175', 125, 130, 440, 3.3, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E175-E2', 125, 130, 440, 3.3, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E190', 130, 135, 445, 3.2, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E195', 135, 140, 450, 3.1, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E195-E2', 135, 140, 450, 3.1, 3000, 2000, 'M', 'regional'),

  // Regional
  new AircraftType( 'Bombardier', 'CRJ-700', 125, 130, 450, 3.3, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Bombardier', 'CRJ-900', 130, 135, 450, 3.2, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Bombardier', 'CRJ-1000', 135, 140, 450, 3.1, 3000, 2000, 'M', 'regional'),

  // Turboprops
  new AircraftType( 'ATR', 'ATR 42-500', 100, 110, 275, 3.8, 1500, 1200, 'L', 'turboprop'),
  new AircraftType( 'ATR', 'ATR 42-600', 100, 110, 275, 3.8, 1500, 1200, 'L', 'turboprop'),
  new AircraftType( 'ATR', 'ATR 72-500', 105, 115, 275, 3.7, 1500, 1200, 'M', 'turboprop'),
  new AircraftType( 'ATR', 'ATR 72-600', 105, 115, 275, 3.7, 1500, 1200, 'M', 'turboprop'),

  new AircraftType( 'De Havilland', 'Dash 8 Q400', 110, 120, 360, 3.6, 2000, 1500, 'M', 'turboprop'),
  new AircraftType( 'Saab', '340B', 100, 110, 300, 4.0, 1200, 1000, 'L', 'turboprop'),
  new AircraftType( 'Fokker', 'Fokker 100', 125, 135, 450, 3.2, 2500, 1800, 'M', 'regional'),

  // Business jets
  new AircraftType( 'Cessna', 'Citation XLS+', 105, 120, 430, 3.6, 2000, 1500, 'L', 'business'),
  new AircraftType( 'Cessna', 'Citation Latitude', 110, 125, 440, 3.5, 2000, 1500, 'L', 'business'),
  new AircraftType( 'Cessna', 'Citation Longitude', 115, 130, 480, 3.2, 3000, 2000, 'L', 'business'),

  new AircraftType( 'Gulfstream', 'G550', 125, 135, 510, 3.0, 3500, 2500, 'M', 'business'),
  new AircraftType( 'Gulfstream', 'G650', 125, 135, 510, 3.0, 4000, 2500, 'M', 'business'),

  new AircraftType( 'Bombardier', 'Challenger 350', 115, 125, 470, 3.2, 3000, 2000, 'L', 'business'),
  new AircraftType( 'Bombardier', 'Global 6000', 125, 135, 500, 3.0, 3500, 2500, 'M', 'business'),

  new AircraftType( 'Dassault', 'Falcon 900', 110, 125, 480, 3.4, 2500, 2000, 'L', 'business'),
  new AircraftType( 'Dassault', 'Falcon 7X', 120, 130, 500, 3.2, 3000, 2200, 'L', 'business'),
  new AircraftType( 'Pilatus', 'PC-24', 110, 120, 440, 3.5, 2500, 1800, 'L', 'business'),

  // Other
  new AircraftType( 'COMAC', 'ARJ21', 130, 135, 430, 3.2, 2500, 1800, 'M', 'regional'),
  new AircraftType( 'COMAC', 'C919', 135, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
]

const aircraftTypes = Object.fromEntries(
  aircraftTypeList.map((type) => [type.name, type])
)

// prettier-ignore
const airlines = [
  new Airline('British Airways', 'BA', 'BAW', 'Speedbird', [
    new FleetEntry(aircraftTypes['Airbus A319'], 30),
    new FleetEntry(aircraftTypes['Airbus A320'], 45),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 20),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 18),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 18),
    new FleetEntry(aircraftTypes['Airbus A380-800'], 12),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 18),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 16),
    new FleetEntry(aircraftTypes['Boeing 787-8'], 12),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 18),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 8),
    new FleetEntry(aircraftTypes['Embraer E190'], 30),
  ]),

  new Airline('Virgin Atlantic', 'VS', 'VIR', 'Virgin', [
    new FleetEntry(aircraftTypes['Airbus A330-300'], 10),
    new FleetEntry(aircraftTypes['Airbus A330-900neo'], 4),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 12),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 17),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 8),
  ]),

  new Airline('easyJet', 'U2', 'EZY', 'Easy', [
    new FleetEntry(aircraftTypes['Airbus A319'], 60),
    new FleetEntry(aircraftTypes['Airbus A320'], 170),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 80),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 30),
  ]),

  new Airline('Ryanair', 'FR', 'RYR', 'Ryanair', [
    new FleetEntry(aircraftTypes['Boeing 737-800'], 400),
    new FleetEntry(aircraftTypes['Boeing 737 MAX 8'], 100),
    new FleetEntry(aircraftTypes['Boeing 737 MAX 10'], 0),
  ]),

  new Airline('Lufthansa', 'LH', 'DLH', 'Lufthansa', [
    new FleetEntry(aircraftTypes['Airbus A319'], 30),
    new FleetEntry(aircraftTypes['Airbus A320'], 45),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 40),
    new FleetEntry(aircraftTypes['Airbus A321'], 60),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 25),
    new FleetEntry(aircraftTypes['Airbus A330-300'], 14),
    new FleetEntry(aircraftTypes['Airbus A340-300'], 17),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 35),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 10),
    new FleetEntry(aircraftTypes['Boeing 747-8'], 27),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 10),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 5),
  ]),

  new Airline('Emirates', 'EK', 'UAE', 'Emirates', [
    new FleetEntry(aircraftTypes['Airbus A380-800'], 110),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 10),
    new FleetEntry(aircraftTypes['Boeing 777-200ER'], 6),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 120),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 5),
  ]),

  new Airline('Qatar Airways', 'QR', 'QTR', 'Qatari', [
    new FleetEntry(aircraftTypes['Airbus A320'], 29),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 40),
    new FleetEntry(aircraftTypes['Airbus A330-300'], 8),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 34),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 25),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 9),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 57),
    new FleetEntry(aircraftTypes['Boeing 787-8'], 30),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 10),
  ]),

  new Airline('KLM', 'KL', 'KLM', 'KLM', [
    new FleetEntry(aircraftTypes['Airbus A319'], 10),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 25),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 30),
    new FleetEntry(aircraftTypes['Embraer E190'], 32),
    new FleetEntry(aircraftTypes['Embraer E195-E2'], 25),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 15),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 16),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 13),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 8),
  ]),

  new Airline('Air France', 'AF', 'AFR', 'Air France', [
    new FleetEntry(aircraftTypes['Airbus A220-300'], 30),
    new FleetEntry(aircraftTypes['Airbus A319'], 35),
    new FleetEntry(aircraftTypes['Airbus A320'], 40),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 20),
    new FleetEntry(aircraftTypes['Airbus A321'], 20),
    new FleetEntry(aircraftTypes['Airbus A330-300'], 15),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 30),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 5),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 43),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 10),
  ]),
]

// prettier-ignore
const airport = new Airport( 'Heathrow', 'LHR', 'EGLL',
  [
    new Runway( '09L', new Position(-0.73, 0.34), 90, metresToNm(3902), metresToNm(45), new ILS(18, 35, 3), { distance: 2, offset: 2 }),
    new Runway( '09R', new Position(-0.63, -0.42), 90, metresToNm(3658), metresToNm(45), new ILS(18, 35, 3), { distance: 2, offset: -2 }),
  ],
  [ new HoldMarker( 'BNN', 'Bovington', new Position(-3.3,-14.9), 116, 'right'),
    new HoldMarker( 'LAM', 'Lambourne', new Position(22.8,-10.1), 263, 'right'),
    new HoldMarker( 'OCK', 'Ockham', new Position(-0.1,9.7), 302, 'right'),
    new HoldMarker( 'BIG', 'Biggin', new Position(26.9,8.8), 122, 'right'),
  ],
  60
)
console.log(airport.holdMarkers[0].code)
console.log(airport.holdMarkers[0].name)
console.log(airport.holdMarkers[0].position)

// Radar covers 60 miles radius
const radar = new Radar('airTrafficCanvas', airport)

//    airline, flightNumber, aircraftType, position, heading, speed, altitude

// prettier-ignore
radar.airplanes.push(
  new Airplane( airlines[0], 123, aircraftTypes['Airbus A320neo'], new Position(-20, -20), 135, 300, 12000)
)
// prettier-ignore
radar.airplanes.push(
  new Airplane( airlines[3], 404, aircraftTypes['Boeing 737-800'], new Position(-20, -20), 315, 240, 11000)
)
// prettier-ignore
radar.airplanes.push(
  new Airplane( airlines[1], 486, aircraftTypes['Airbus A318'], new Position(-20, 20), 90, 450, 12000)
)

function canvasResized() {
  radar.resize()
  radar.draw()
}

window.addEventListener('resize', canvasResized)
requestAnimationFrame(canvasResized)

const SIM_STEP = 1 / 60 // 60Hz simulation

let accumulator = 0
let lastTime = null

window.setTimeout(function () {
  radar.airplanes[0].issueCommand(AircraftCommand.hold())
  radar.airplanes[1].issueCommand(
    AircraftCommand.hold({ turnDirection: 'left' })
  )

  radar.airplanes[2].issueCommand(AircraftCommand.altitude(4000))
  radar.airplanes[2].issueCommand(AircraftCommand.speed(180))

  console.log('commands issued')
}, 10000)

function gameLoop(timestamp) {
  if (!lastTime) {
    lastTime = timestamp
  }

  let frameTime = (timestamp - lastTime) / 1000
  lastTime = timestamp

  // don't accumulate huge gaps
  frameTime = Math.min(frameTime, 0.25)

  accumulator += frameTime

  while (accumulator >= SIM_STEP) {
    radar.update(SIM_STEP)
    accumulator -= SIM_STEP
  }

  radar.draw()

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
