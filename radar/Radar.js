import { Position } from '../world/Position.js'

export class Radar {
  constructor(canvasID, airport) {
    this.canvasID = canvasID
    this.radarRange = airport.radarRange
    this.radarWidth = this.radarRange * 2
    this.airport = airport

    this.canvas = document.getElementById(canvasID)

    this.canvas.dataset.radar = this
    this.labelContainer = document.getElementById('aircraftLabels')
    this.ctx = this.canvas.getContext('2d')
    this.airplanes = []

    this.gameTime = 0
    this.lastLabelUpdate = -1
  }

  zoomIn() {
    if (this.radarRange > 20) {
      this.radarRange -= 10
      this.updateCanvasScale()
    }
    console.log(this.radarRange)
  }
  zoomOut() {
    if (this.radarRange < 60) {
      this.radarRange += 10
      this.updateCanvasScale()
    }
    console.log(this.radarRange)
  }

  update(deltaSeconds) {
    this.gameTime += deltaSeconds

    this.airplanes.forEach((airplane) => {
      airplane.update(deltaSeconds, this.gameTime)
    })

    if (this.gameTime - this.lastLabelUpdate > 0.05) {
      this.updateLabels()
      this.lastLabelUpdate = this.gameTime
    }
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
      this.drawWaypoint(hold)
    })
    this.airport.features.forEach((feature) => {
      this.drawMapFeature(feature)
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
    this.pixelsPerNm =
      (Math.min(this.width, this.height) / this.radarWidth) *
      (60 / this.radarRange)

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

  drawMapFeature(feature) {
    const ctx = this.ctx

    ctx.strokeStyle = '#164016'
    ctx.lineWidth = 2

    ctx.beginPath()

    feature.points.forEach((position, index) => {
      const point = this.worldToCanvasScale(position)

      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })

    ctx.stroke()
  }

  drawWaypoint(waypoint) {
    const ctx = this.ctx

    const point = this.worldToCanvasScale(waypoint.position)

    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 2

    // fix circle
    ctx.beginPath()
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
    ctx.stroke()

    // inbound course indicator
    const end = waypoint.position.getOffsetByDistance(
      2,
      waypoint.holdProcedure.inboundHeading
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
      `${waypoint.code} ${waypoint.holdProcedure.inboundHeading}`,
      point.x + 8,
      point.y - 8
    )
  }

  drawAirplane(airplane) {
    const ctx = this.ctx

    const canvasPosition = this.worldToCanvasScale(airplane.position)

    ctx.save()

    ctx.translate(canvasPosition.x, canvasPosition.y)

    // Aircraft position symbol
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.strokeRect(-3, -3, 7, 7)
    ctx.restore()

    // Heading vector (30 second projection)
    const vectorSeconds = 30

    const distance = Math.max(1, (airplane.speed * vectorSeconds) / 3600)

    const endPosition = airplane.position.getOffsetByDistance(
      distance,
      airplane.heading
    )

    const vectorEnd = this.worldToCanvasScale(endPosition)

    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(canvasPosition.x, canvasPosition.y)
    ctx.lineTo(vectorEnd.x, vectorEnd.y)
    ctx.stroke()
  }

  drawAirplaneTrail(airplane) {
    const history = airplane.trackHistory

    if (history.length < 2) return

    const ctx = this.ctx

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i]
      const next = history[i + 1]

      const p1 = this.worldToCanvasScale(current.position)
      const p2 = this.worldToCanvasScale(next.position)

      const midX = (p1.x + p2.x) / 2
      const midY = (p1.y + p2.y) / 2

      const alpha = 0.0 + (i / airplane.maxHistory) * 0.6

      ctx.strokeStyle = `rgba(255,255,255,${alpha})`
      ctx.lineWidth = 2

      ctx.beginPath()

      if (i === 0) {
        ctx.moveTo(p1.x, p1.y)
      } else {
        const previous = history[i - 1]
        const p0 = this.worldToCanvasScale(previous.position)

        ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2)
      }

      ctx.quadraticCurveTo(p1.x, p1.y, midX, midY)

      ctx.stroke()
    }
  }

  createLabel() {
    let labelElement = document.createElement('div')
    labelElement.className = 'aircraft-label'
    this.labelContainer.appendChild(labelElement)
    return labelElement
  }

  updateLabels() {
    this.airplanes.forEach((airplane) => {
      this.updateLabel(airplane)
    })
  }

  updateLabel(airplane) {
    const point = this.worldToCanvasScale(airplane.position)

    if (!airplane.labelElement) {
      airplane.labelElement = this.createLabel()
    }

    airplane.labelElement.style.transform = `translate(${point.x + 12}px, ${point.y - 10}px)`

    airplane.labelElement.innerHTML = `
    ${airplane.callsign}<br>
    ${airplane.displayAltitude}<br>
    ${Math.round(airplane.speed)}
  `
  }

  addAirplane(airplane) {
    airplane.element = this.createLabel()
    this.airplanes.push(airplane)
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

    ctx.strokeStyle = '#AAAA66'
    ctx.setLineDash([8, 8])

    ctx.beginPath()

    ctx.moveTo(start.x, start.y)
    ctx.lineTo(left.x, left.y)

    ctx.moveTo(start.x, start.y)
    ctx.lineTo(right.x, right.y)

    ctx.stroke()

    ctx.setLineDash([])
  }
}
