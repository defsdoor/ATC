import { Position } from '../world/Position.js'
import { HoldingPattern } from './HoldingPattern.js'
import { HoldPhase } from './HoldingPattern.js'
import { TrackPoint } from '../world/TrackPoint.js'

export class Airplane {
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

    this.trackHistory = []
    this.historyTimer = 0
    this.historyInterval = 2
    this.maxHistory = 60
    this.commands = []
    this.activeCommand = null

    this.labelElement = null

    this.hold = null
  }

  enterHold(data) {
    this.hold = new HoldingPattern(data.turnDirection, data.outboundTime)
    this.hold.legStart = this.position

    this.hold.legStart = new Position(this.position.x, this.position.y)
    this.hold.phase = HoldPhase.OUTBOUND_TURN
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

  // Hedding instructions naturally end hold patterns
  // Altitude instructions do not - move down the stack..
  // Speed instructions should not be given when in hold so should they break hold ?
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

  updateHold(deltaSeconds, gameTime) {
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
          this.startHoldLeg(gameTime)
          this.hold.phase = HoldPhase.INBOUND_LEG
        }
        break
      case HoldPhase.INBOUND_LEG:
        if (gameTime - this.hold.legStartTime >= this.hold.outboundTime)
          this.hold.phase = HoldPhase.OUTBOUND
        break

      case HoldPhase.OUTBOUND:
        this.turnTo(this.hold.inboundHeading, this.hold.turnDirection)
        this.hold.phase = HoldPhase.OUTBOUND_TURN
        break
      case HoldPhase.OUTBOUND_TURN:
        if (this.remainingTurn() < 1) {
          this.startHoldLeg(gameTime)
          this.hold.phase = HoldPhase.OUTBOUND_LEG
        }
        break
      case HoldPhase.OUTBOUND_LEG:
        if (gameTime - this.hold.legStartTime >= this.hold.outboundTime)
          this.hold.phase = HoldPhase.INBOUND
        break
    }
  }

  startHoldLeg(gameTime) {
    this.hold.legStartTime = gameTime
  }

  distanceFrom(position) {
    const dx = this.position.x - position.x
    const dy = this.position.y - position.y

    return Math.sqrt(dx * dx + dy * dy)
  }

  updateHeading(deltaSeconds) {
    const deg_per_sec = this.hold ? 3 : this.aircraftType.turnPerformance
    const amount = deg_per_sec * deltaSeconds
    const turn = this.turnDecision()

    if (turn.remaining <= amount) {
      this.heading = this.targetHeading
      this.turnDirection = 'shortest'
      return
    }

    this.heading += turn.direction * amount
    this.heading = (this.heading + 360) % 360
  }

  update(deltaSeconds, gameTime) {
    this.updateCommandCompletion()

    if (this.hold) {
      this.updateHold(deltaSeconds, gameTime)
    }

    this.updateHeading(deltaSeconds)
    this.updateAltitude(deltaSeconds)
    this.updateSpeed(deltaSeconds)
    this.updatePosition(deltaSeconds)
    this.updateTrail(deltaSeconds, gameTime)
  }

  updatePosition(deltaSeconds) {
    // knots -> nautical miles per second
    const distance = (this.speed * deltaSeconds) / 3600

    this.position.offsetByDistance(distance, this.heading)
  }

  updateTrail(deltaSeconds, gameTime) {
    this.historyTimer += deltaSeconds

    if (this.historyTimer >= this.historyInterval) {
      this.trackHistory.push(
        new TrackPoint(
          new Position(this.position.x, this.position.y),
          this.heading,
          this.speed,
          this.altitude,
          gameTime
        )
      )

      this.historyTimer = 0
    }

    if (this.trackHistory.length > this.maxHistory) {
      this.trackHistory.shift()
    }
  }
}
