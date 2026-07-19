export class Airport {
  constructor(
    name,
    iataCode,
    icaoCode,
    runways,
    holdMarkers,
    features,
    radarRange
  ) {
    this.name = name
    this.iataCode = iataCode
    this.icaoCode = icaoCode
    this.runways = runways
    this.holdMarkers = holdMarkers
    this.radarRange = radarRange
    this.features = features
  }
}
