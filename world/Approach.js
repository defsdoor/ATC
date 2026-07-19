export class Approach {
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
