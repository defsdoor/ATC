export class Airline {
  constructor(name, iataCode, icaoCode, callsign, fleet = []) {
    this.name = name
    this.iataCode = iataCode
    this.icaoCode = icaoCode
    this.callsign = callsign
    this.fleet = fleet
  }
}
