import { Airline } from '../aircraft/Airline.js'
import { FleetEntry } from '../aircraft/FleetEntry.js'
import { aircraftTypes } from '../data/aircraftTypes.js'
// prettier-ignore
export const airlines = [
  new Airline('British Airways', 'BA', 'BAW', 'Speedbird', [
    new FleetEntry(aircraftTypes['Airbus A319'], 30),
    new FleetEntry(aircraftTypes['Airbus A320'], 45),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 20),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 18),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 18),
    new FleetEntry(aircraftTypes['Airbus A380-800'], 12),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 18),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 16),
    new FleetEntry(aircraftTypes['Boeing 787-8'], 12),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 18),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 8),
    new FleetEntry(aircraftTypes['Embraer E190'], 30),
  ]),

  new Airline('Virgin Atlantic', 'VS', 'VIR', 'Virgin', [
    new FleetEntry(aircraftTypes['Airbus A330-300'], 10),
    new FleetEntry(aircraftTypes['Airbus A330-900neo'], 4),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 12),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 17),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 8),
  ]),

  new Airline('easyJet', 'U2', 'EZY', 'Easy', [
    new FleetEntry(aircraftTypes['Airbus A319'], 60),
    new FleetEntry(aircraftTypes['Airbus A320'], 170),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 80),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 30),
  ]),

  new Airline('Ryanair', 'FR', 'RYR', 'Ryanair', [
    new FleetEntry(aircraftTypes['Boeing 737:-800'], 400),
    new FleetEntry(aircraftTypes['Boeing 737 MAX 8'], 100),
    new FleetEntry(aircraftTypes['Boeing 737 MAX 10'], 0),
  ]),

  new Airline('Lufthansa', 'LH', 'DLH', 'Lufthansa', [
    new FleetEntry(aircraftTypes['Airbus A319'], 30),
    new FleetEntry(aircraftTypes['Airbus A320'], 45),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 40),
    new FleetEntry(aircraftTypes['Airbus A321'], 60),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 25),
    new FleetEntry(aircraftTypes['Airbus A330-300'], 14),
    new FleetEntry(aircraftTypes['Airbus A340-300'], 17),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 35),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 10),
    new FleetEntry(aircraftTypes['Boeing 747-8'], 27),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 10),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 5),
  ]),

  new Airline('Emirates', 'EK', 'UAE', 'Emirates', [
    new FleetEntry(aircraftTypes['Airbus A380-800'], 110),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 10),
    new FleetEntry(aircraftTypes['Boeing 777-200ER'], 6),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 120),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 5),
  ]),

  new Airline('Qatar Airways', 'QR', 'QTR', 'Qatari', [
    new FleetEntry(aircraftTypes['Airbus A320'], 29),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 40),
    new FleetEntry(aircraftTypes['Airbus A330-300'], 8),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 34),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 25),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 9),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 57),
    new FleetEntry(aircraftTypes['Boeing 787-8'], 30),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 10),
  ]),

  new Airline('KLM', 'KL', 'KLM', 'KLM', [
    new FleetEntry(aircraftTypes['Airbus A319'], 10),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 25),
    new FleetEntry(aircraftTypes['Airbus A321neo'], 30),
    new FleetEntry(aircraftTypes['Embraer E190'], 32),
    new FleetEntry(aircraftTypes['Embraer E195-E2'], 25),
    new FleetEntry(aircraftTypes['Boeing 777-200'], 15),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 16),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 13),
    new FleetEntry(aircraftTypes['Boeing 787-10'], 8),
  ]),

  new Airline('Air France', 'AF', 'AFR', 'Air France', [
    new FleetEntry(aircraftTypes['Airbus A220-300'], 30),
    new FleetEntry(aircraftTypes['Airbus A319'], 35),
    new FleetEntry(aircraftTypes['Airbus A320'], 40),
    new FleetEntry(aircraftTypes['Airbus A320neo'], 20),
    new FleetEntry(aircraftTypes['Airbus A321'], 20),
    new FleetEntry(aircraftTypes['Airbus A330-300'], 15),
    new FleetEntry(aircraftTypes['Airbus A350-900'], 30),
    new FleetEntry(aircraftTypes['Airbus A350-1000'], 5),
    new FleetEntry(aircraftTypes['Boeing 777-300ER'], 43),
    new FleetEntry(aircraftTypes['Boeing 787-9'], 10),
  ]),
]
