import { Approach } from './Approach.js'

export class Runway {
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
