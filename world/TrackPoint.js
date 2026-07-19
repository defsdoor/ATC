export class TrackPoint {
  constructor(position, heading, speed, altitude, time) {
    this.position = position
    this.heading = heading
    this.speed = speed
    this.altitude = altitude
    this.time = time
  }

  age(currentTime) {
    return currentTime - this.time
  }
}
