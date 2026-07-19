import { Radar } from './radar/Radar.js'
import { AircraftCommand } from './aircraft/AircraftCommand.js'
import { Airplane } from './aircraft/Airplane.js'
import { Position } from './world/Position.js'
import { airport } from './data/airports.js'
import { airlines } from './data/airlines.js'
import { aircraftTypes } from './data/aircraftTypes.js'

// Radar covers 60 miles radius
const radar = new Radar('airTrafficCanvas', airport)

//    airline, flightNumber, aircraftType, position, heading, speed, altitude

// prettier-ignore
radar.addAirplane(
  new Airplane( airlines[0], 123, aircraftTypes['Airbus A320neo'], new Position(-20, -20), 135, 300, 12000)
)
// prettier-ignore
radar.addAirplane(
  new Airplane( airlines[3], 404, aircraftTypes['Boeing 737-800'], new Position(-20, -20), 315, 240, 11000)
)
// prettier-ignore
radar.addAirplane(
  new Airplane( airlines[1], 486, aircraftTypes['Airbus A330-200'], new Position(-40, 40), 45, 200, 4000)
)

// prettier-ignore
radar.addAirplane(
  new Airplane( airlines[1], 486, aircraftTypes['Airbus A330-200'], new Position(-40, 45), 45, 550, 48000)
)

function canvasResized() {
  radar.resize()
  radar.draw()
}

window.addEventListener('resize', canvasResized)
requestAnimationFrame(canvasResized)

const SIM_STEP = 1 / 60 // 60Hz simulation

let accumulator = 0
let lastTime = null

window.setTimeout(function () {
  radar.airplanes[0].issueCommand(
    AircraftCommand.hold({ turnDirection: 'left', outboundTime: 60 })
  )
  radar.airplanes[1].issueCommand(
    AircraftCommand.hold({ turnDirection: 'left', outboundTime: 60 })
  )

  radar.airplanes[2].issueCommand(AircraftCommand.altitude(44000))
  radar.airplanes[2].issueCommand(AircraftCommand.speed(550))
  radar.airplanes[3].issueCommand(AircraftCommand.altitude(4000))
  radar.airplanes[3].issueCommand(AircraftCommand.speed(180))

  console.log('commands issued')
}, 10000)

const descender = window.setInterval(function () {
  if (radar.airplanes[1].altitude > 4000) {
    radar.airplanes[1].issueCommand(
      AircraftCommand.altitude(
        (Math.round(radar.airplanes[1].altitude / 1000) - 1) * 1000
      )
    )
  } else {
    window.clearInterval(descender)
  }
}, 60000)

function gameLoop(timestamp) {
  if (!lastTime) {
    lastTime = timestamp
  }

  let frameTime = (timestamp - lastTime) / 1000
  lastTime = timestamp

  // don't accumulate huge gaps
  frameTime = Math.min(frameTime, 0.25)

  accumulator += frameTime

  while (accumulator >= SIM_STEP) {
    radar.update(SIM_STEP)
    accumulator -= SIM_STEP
  }

  radar.draw()

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
