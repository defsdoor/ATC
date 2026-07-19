import { AircraftType } from '../aircraft/AircraftType.js'

// prettier-ignore
export const aircraftTypeList = [
  // manufacturer, model, landingSpeed, approachSpeed, cruiseSpeed, turnPerformance, climbRate, descendRate, wakeCategory, category
  // Airbus narrow body
  new AircraftType( 'Airbus', 'A318', 125, 135, 430, 3.2, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A220-300', 125, 135, 445, 3.2, 3000, 1800, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A319', 130, 140, 445, 3.1, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A319neo', 130, 140, 445, 3.1, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Airbus', 'A320', 135, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A320neo', 135, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Airbus', 'A321', 145, 150, 450, 2.9, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A321neo', 145, 150, 450, 2.8, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A321LR', 145, 150, 450, 2.8, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Airbus', 'A321XLR', 145, 150, 450, 2.8, 3000, 2000, 'M', 'airliner'),

  // Airbus wide body
  new AircraftType( 'Airbus', 'A330-200', 145, 150, 470, 2.7, 2500, 1800, 'H', 'airliner'),
  new AircraftType( 'Airbus', 'A330-300', 145, 150, 470, 2.6, 2500, 1800, 'H', 'airliner'),
  new AircraftType( 'Airbus', 'A330-900neo', 145, 150, 470, 2.6, 2500, 1800, 'H', 'airliner'),

  new AircraftType( 'Airbus', 'A340-300', 150, 155, 480, 2.5, 2200, 1800, 'H', 'airliner'),

  new AircraftType( 'Airbus', 'A350-900', 150, 155, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Airbus', 'A350-1000', 155, 160, 490, 2.3, 2500, 2000, 'H', 'airliner'),

  new AircraftType( 'Airbus', 'A380-800', 180, 150, 450, 2.0, 2000, 1500, 'J', 'airliner'),

  // Boeing narrow body
  new AircraftType( 'Boeing', '717-200', 120, 130, 440, 3.3, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Boeing', '737-700', 130, 140, 450, 3.1, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737-800', 140, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737-900ER', 145, 150, 450, 2.9, 3000, 2000, 'M', 'airliner'),

  new AircraftType( 'Boeing', '737 MAX 8', 140, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737 MAX 9', 145, 150, 450, 2.9, 3000, 2000, 'M', 'airliner'),
  new AircraftType( 'Boeing', '737 MAX 10', 150, 155, 450, 2.8, 3000, 2000, 'M', 'airliner'),

  // Boeing wide body
  new AircraftType( 'Boeing', '747-400', 160, 155, 490, 2.2, 2000, 1500, 'H', 'airliner'),
  new AircraftType( 'Boeing', '747-8', 160, 155, 490, 2.1, 2000, 1500, 'H', 'airliner'),

  new AircraftType( 'Boeing', '767-300ER', 145, 150, 460, 2.7, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '767-400ER', 150, 155, 460, 2.6, 2500, 2000, 'H', 'airliner'),

  new AircraftType( 'Boeing', '777-200', 155, 160, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '777-200ER', 155, 160, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '777-300ER', 155, 160, 490, 2.3, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '777-9', 160, 160, 490, 2.2, 2500, 2000, 'H', 'airliner'),

  new AircraftType( 'Boeing', '777F', 155, 160, 490, 2.3, 2500, 2000, 'H', 'cargo'),

  new AircraftType( 'Boeing', '787-8', 145, 150, 490, 2.5, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '787-9', 150, 155, 490, 2.4, 2500, 2000, 'H', 'airliner'),
  new AircraftType( 'Boeing', '787-10', 155, 160, 490, 2.3, 2500, 2000, 'H', 'airliner'),

  // Embraer
  new AircraftType( 'Embraer', 'E170', 120, 125, 430, 3.4, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E175', 125, 130, 440, 3.3, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E175-E2', 125, 130, 440, 3.3, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E190', 130, 135, 445, 3.2, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E195', 135, 140, 450, 3.1, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Embraer', 'E195-E2', 135, 140, 450, 3.1, 3000, 2000, 'M', 'regional'),

  // Regional
  new AircraftType( 'Bombardier', 'CRJ-700', 125, 130, 450, 3.3, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Bombardier', 'CRJ-900', 130, 135, 450, 3.2, 3000, 2000, 'M', 'regional'),
  new AircraftType( 'Bombardier', 'CRJ-1000', 135, 140, 450, 3.1, 3000, 2000, 'M', 'regional'),

  // Turboprops
  new AircraftType( 'ATR', 'ATR 42-500', 100, 110, 275, 3.8, 1500, 1200, 'L', 'turboprop'),
  new AircraftType( 'ATR', 'ATR 42-600', 100, 110, 275, 3.8, 1500, 1200, 'L', 'turboprop'),
  new AircraftType( 'ATR', 'ATR 72-500', 105, 115, 275, 3.7, 1500, 1200, 'M', 'turboprop'),
  new AircraftType( 'ATR', 'ATR 72-600', 105, 115, 275, 3.7, 1500, 1200, 'M', 'turboprop'),

  new AircraftType( 'De Havilland', 'Dash 8 Q400', 110, 120, 360, 3.6, 2000, 1500, 'M', 'turboprop'),
  new AircraftType( 'Saab', '340B', 100, 110, 300, 4.0, 1200, 1000, 'L', 'turboprop'),
  new AircraftType( 'Fokker', 'Fokker 100', 125, 135, 450, 3.2, 2500, 1800, 'M', 'regional'),

  // Business jets
  new AircraftType( 'Cessna', 'Citation XLS+', 105, 120, 430, 3.6, 2000, 1500, 'L', 'business'),
  new AircraftType( 'Cessna', 'Citation Latitude', 110, 125, 440, 3.5, 2000, 1500, 'L', 'business'),
  new AircraftType( 'Cessna', 'Citation Longitude', 115, 130, 480, 3.2, 3000, 2000, 'L', 'business'),

  new AircraftType( 'Gulfstream', 'G550', 125, 135, 510, 3.0, 3500, 2500, 'M', 'business'),
  new AircraftType( 'Gulfstream', 'G650', 125, 135, 510, 3.0, 4000, 2500, 'M', 'business'),

  new AircraftType( 'Bombardier', 'Challenger 350', 115, 125, 470, 3.2, 3000, 2000, 'L', 'business'),
  new AircraftType( 'Bombardier', 'Global 6000', 125, 135, 500, 3.0, 3500, 2500, 'M', 'business'),

  new AircraftType( 'Dassault', 'Falcon 900', 110, 125, 480, 3.4, 2500, 2000, 'L', 'business'),
  new AircraftType( 'Dassault', 'Falcon 7X', 120, 130, 500, 3.2, 3000, 2200, 'L', 'business'),
  new AircraftType( 'Pilatus', 'PC-24', 110, 120, 440, 3.5, 2500, 1800, 'L', 'business'),

  // Other
  new AircraftType( 'COMAC', 'ARJ21', 130, 135, 430, 3.2, 2500, 1800, 'M', 'regional'),
  new AircraftType( 'COMAC', 'C919', 135, 145, 450, 3.0, 3000, 2000, 'M', 'airliner'),
]

export const aircraftTypes = Object.fromEntries(
  aircraftTypeList.map((type) => [type.name, type])
)
