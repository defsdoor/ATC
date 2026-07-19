export class AircraftCommand {
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
