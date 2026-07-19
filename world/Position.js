export class Position {
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
