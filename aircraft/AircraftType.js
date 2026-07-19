import { speedChangeRates } from '../utils/Utils.js'

export class AircraftType {
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
