import { Airport } from '../world/Airport.js'
import { Runway } from '../world/Runway.js'
import { Waypoint } from '../world/Waypoint.js'
import { HoldProcedure } from '../world/HoldProcedure.js'
import { Position } from '../world/Position.js'
import { metresToNm } from '../utils/Utils.js'
import { ILS } from '../world/ILS.js'
import { MapFeature } from '../world/MapFeature.js'

// prettier-ignore
export const airport = new Airport( 'Heathrow', 'LHR', 'EGLL',
  [
    new Runway( '09L', new Position(-0.73, 0.34), 90, metresToNm(3902), metresToNm(45), new ILS(18, 35, 3), { distance: 2, offset: 2 }),
    new Runway( '09R', new Position(-0.63, -0.42), 90, metresToNm(3658), metresToNm(45), new ILS(18, 35, 3), { distance: 2, offset: -2 }),
  ],
  [ new Waypoint( 'BNN', 'Bovingdon', new Position(-3.3,-14.9), new HoldProcedure(116, 'right', 60)),
    new Waypoint( 'LAM', 'Lambourne', new Position(22.8,-10.1), new HoldProcedure(263, 'right',60)),
    new Waypoint( 'OCK', 'Ockham', new Position(-0.1,9.7), new HoldProcedure(302, 'right',60)),
    new Waypoint( 'BIG', 'Biggin', new Position(26.9,8.8), new HoldProcedure(122, 'right',60)),
  ],
  [
    new MapFeature('Coastline', [
      new Position(-57.79, 52.71), new Position(-55.95, 52.54), new Position(-56.15, 51.16),
      new Position(-54.92, 49.67), new Position(-55.90, 49.43), new Position(-55.90, 47.39),
      new Position(-56.58, 48.55), new Position(-57.03, 47.56), new Position(-57.58, 48.17),
      new Position(-58.15, 47.25), new Position(-58.73, 47.68)
    ]),

    new MapFeature('Coastline', [
      new Position(-58.11, 44.26), new Position(-57.40, 43.96), new Position(-57.48, 45.44),
      new Position(-56.20, 45.27), new Position(-55.34, 46.20), new Position(-55.82, 47.24),
      new Position(-53.55, 45.40), new Position(-50.88, 44.96), new Position(-48.38, 45.54),
      new Position(-48.06, 44.77), new Position(-48.35, 45.27), new Position(-49.93, 44.36),
      new Position(-48.14, 44.79), new Position(-46.83, 44.00), new Position(-40.99, 45.83),
      new Position(-42.09, 45.10), new Position(-40.24, 43.98), new Position(-40.41, 42.37),
      new Position(-39.11, 42.98), new Position(-35.00, 41.60), new Position(-35.62, 41.93),
      new Position(-35.08, 41.52), new Position(-37.26, 39.05), new Position(-35.79, 39.91),
      new Position(-35.39, 41.13), new Position(-33.20, 41.06), new Position(-31.88, 39.29),
      new Position(-35.37, 35.89), new Position(-34.63, 34.91), new Position(-31.70, 37.93),
      new Position(-25.69, 41.81), new Position(-24.58, 40.82), new Position(-25.84, 41.12),
      new Position(-24.75, 40.43), new Position(-26.10, 38.05), new Position(-27.10, 37.96),
      new Position(-26.66, 37.04), new Position(-26.79, 37.80), new Position(-24.62, 38.03),
      new Position(-24.34, 37.39), new Position(-23.71, 38.49), new Position(-23.26, 37.96),
      new Position(-21.33, 38.61), new Position(-20.50, 37.31), new Position(-19.69, 38.10),
      new Position(-17.88, 37.43), new Position(-18.25, 39.28), new Position(-16.96, 40.28),
      new Position(-16.97, 38.84), new Position(-17.76, 38.34), new Position(-17.12, 38.51),
      new Position(-17.15, 37.81), new Position(-16.43, 37.90), new Position(-15.79, 39.51),
      new Position(-15.10, 37.82), new Position(-15.50, 39.37), new Position(-14.52, 39.93),
      new Position(-13.33, 38.24), new Position(-13.87, 39.94), new Position(-15.82, 39.74),
      new Position(-17.28, 41.34), new Position(-13.79, 43.57), new Position(-13.81, 42.36),
      new Position(-13.17, 43.41), new Position(-13.62, 43.87), new Position(-12.51, 44.86),
      new Position(-11.06, 42.77), new Position(-12.43, 42.61), new Position(-11.68, 41.83),
      new Position(-11.11, 42.71), new Position(-9.24, 41.54), new Position(-3.28, 40.18),
      new Position(-3.87, 39.50), new Position(-3.27, 40.12), new Position(0.37, 40.09),
      new Position(7.70, 38.72), new Position(6.33, 38.43), new Position(6.05, 37.03),
      new Position(6.66, 38.32), new Position(13.55, 39.50), new Position(19.16, 41.65),
      new Position(18.94, 40.50), new Position(21.54, 42.70), new Position(25.98, 44.13),
      new Position(30.57, 39.23), new Position(41.65, 35.99), new Position(45.90, 32.29),
      new Position(53.48, 33.49), new Position(53.45, 28.18), new Position(55.80, 25.19),
      new Position(61.66, 23.64), new Position(62.81, 22.22), new Position(66.61, 21.52),
      new Position(66.19, 20.81), new Position(67.19, 20.89), new Position(69.12, 18.81),
      new Position(69.47, 14.27), new Position(67.74, 9.33), new Position(68.46, 8.42),
      new Position(70.19, 8.74), new Position(71.15, 5.53), new Position(70.24, 4.57),
      new Position(58.05, 5.82), new Position(55.29, 6.33), new Position(54.29, 7.34),
      new Position(50.54, 7.70), new Position(50.92, 8.15), new Position(49.87, 8.48),
      new Position(50.50, 7.53), new Position(49.25, 6.83), new Position(47.52, 6.82),
      new Position(47.49, 7.43), new Position(47.39, 6.69), new Position(45.64, 6.46),
      new Position(44.43, 7.46), new Position(45.55, 6.43), new Position(45.52, 5.28),
      new Position(44.12, 4.25), new Position(44.20, 2.98), new Position(43.03, 2.96),
      new Position(43.86, 4.91), new Position(42.97, 5.41), new Position(43.25, 4.65),
      new Position(42.66, 4.70), new Position(42.19, 5.66), new Position(41.21, 4.35),
      new Position(40.47, 5.81), new Position(40.69, 4.85), new Position(39.85, 5.47),
      new Position(37.08, 3.58), new Position(36.44, 5.13), new Position(36.82, 3.49),
      new Position(39.81, 3.15), new Position(40.75, 1.43), new Position(42.04, 1.29),
      new Position(42.79, 2.22), new Position(44.02, 1.40), new Position(43.14, -0.16),
      new Position(42.07, -0.14), new Position(42.78, 0.64), new Position(41.64, -0.46),
      new Position(35.86, -0.94), new Position(35.85, -2.13), new Position(37.21, -2.57),
      new Position(35.96, -3.63), new Position(36.98, -3.67), new Position(37.39, -4.67),
      new Position(46.23, -3.07), new Position(48.70, -4.89), new Position(47.18, -6.52),
      new Position(47.19, -5.82), new Position(46.35, -5.79), new Position(47.09, -6.96),
      new Position(43.77, -6.28), new Position(47.59, -7.65), new Position(46.27, -8.79),
      new Position(49.02, -7.54), new Position(49.28, -8.71), new Position(46.05, -8.96),
      new Position(45.53, -10.01), new Position(38.32, -9.16), new Position(39.63, -9.60),
      new Position(39.34, -10.47), new Position(39.70, -9.59), new Position(41.00, -9.75),
      new Position(40.47, -10.29), new Position(41.57, -10.07), new Position(41.29, -10.71),
      new Position(42.23, -9.99), new Position(45.47, -10.40), new Position(46.73, -9.33),
      new Position(51.28, -9.36), new Position(52.02, -9.97), new Position(52.35, -16.01),
      new Position(51.43, -16.70), new Position(48.83, -14.69), new Position(46.64, -14.88),
      new Position(46.79, -14.28), new Position(45.82, -14.04), new Position(46.05, -12.91),
      new Position(45.65, -13.96), new Position(44.56, -13.02), new Position(45.73, -14.30),
      new Position(43.56, -14.61), new Position(42.60, -15.83), new Position(43.35, -15.23),
      new Position(43.65, -16.06), new Position(44.51, -15.57), new Position(45.40, -16.35),
      new Position(48.84, -16.30), new Position(49.97, -17.26), new Position(48.05, -18.01),
      new Position(50.26, -17.98), new Position(47.94, -19.07), new Position(49.58, -18.79),
      new Position(49.36, -19.36), new Position(50.33, -18.55), new Position(50.77, -20.05),
      new Position(51.42, -19.52), new Position(50.70, -18.22), new Position(54.35, -19.39),
      new Position(53.10, -20.33), new Position(51.28, -19.75), new Position(52.00, -20.15),
      new Position(51.22, -20.49), new Position(54.02, -20.24), new Position(52.24, -21.13),
      new Position(52.94, -21.79), new Position(53.69, -20.84), new Position(53.43, -22.61),
      new Position(51.10, -22.52), new Position(52.69, -22.96), new Position(51.17, -25.28),
      new Position(52.52, -23.11), new Position(55.14, -21.89), new Position(53.77, -21.63),
      new Position(54.75, -20.14), new Position(56.89, -21.06), new Position(56.02, -19.99),
      new Position(56.80, -19.58), new Position(55.00, -19.97), new Position(55.99, -18.08),
      new Position(57.32, -18.17), new Position(55.97, -17.98), new Position(58.70, -18.09),
      new Position(62.46, -20.31), new Position(65.21, -24.22), new Position(64.20, -24.97),
      new Position(65.05, -24.34), new Position(64.36, -24.43), new Position(64.41, -22.90),
      new Position(64.45, -23.62), new Position(63.04, -23.10), new Position(62.82, -24.13),
      new Position(61.01, -24.09), new Position(62.89, -25.23), new Position(62.28, -25.60),
      new Position(62.80, -26.03), new Position(63.56, -25.54), new Position(65.26, -28.76),
      new Position(64.71, -28.15), new Position(63.57, -28.70), new Position(58.82, -28.20),
      new Position(56.36, -28.97), new Position(59.24, -29.01), new Position(60.48, -30.03),
      new Position(61.37, -29.13), new Position(64.67, -29.20), new Position(64.35, -31.07),
      new Position(61.16, -32.31), new Position(60.70, -33.62), new Position(64.91, -31.25),
      new Position(64.92, -29.76), new Position(66.16, -28.87), new Position(66.28, -27.74),
      new Position(68.99, -31.16), new Position(66.96, -33.26), new Position(66.23, -36.35),
      new Position(65.37, -36.46), new Position(67.61, -38.52), new Position(66.28, -36.63),
      new Position(69.06, -30.95)
    ]),

    new MapFeature('Coastline', [
      new Position(-42.04, 48.53), new Position(-38.46, 48.21), new Position(-31.44, 53.71),
      new Position(-27.19, 52.27), new Position(-26.38, 49.22), new Position(-23.01, 47.01),
      new Position(-24.48, 46.59), new Position(-24.50, 44.90), new Position(-28.27, 44.10),
      new Position(-28.83, 44.72), new Position(-28.39, 43.92), new Position(-30.55, 42.27),
      new Position(-32.13, 42.16), new Position(-33.60, 43.85), new Position(-35.73, 44.75),
      new Position(-34.48, 45.54), new Position(-35.65, 45.05), new Position(-35.34, 45.55),
      new Position(-36.64, 45.95), new Position(-35.83, 45.03), new Position(-36.30, 44.59),
      new Position(-39.91, 45.77), new Position(-42.04, 48.53)
    ]),

    new MapFeature('Coastline', [
      new Position(-24.57, 40.15), new Position(-23.72, 41.54), new Position(-21.46, 40.85),
      new Position(-22.05, 40.77), new Position(-22.05, 38.30), new Position(-22.74, 38.05),
      new Position(-24.13, 38.58), new Position(-23.80, 39.66), new Position(-24.57, 40.15)
    ]),

    new MapFeature('Coastline', [
      new Position(-21.31, 40.45), new Position(-21.15, 41.14), new Position(-18.01, 41.48),
      new Position(-19.17, 40.97), new Position(-18.63, 40.14), new Position(-19.40, 39.66),
      new Position(-18.56, 38.77), new Position(-19.16, 38.12), new Position(-20.04, 38.61),
      new Position(-20.21, 40.32), new Position(-21.31, 40.45)
    ]),

    new MapFeature('Coastline', [
      new Position(36.85, -2.95), new Position(38.40, -2.27), new Position(40.43, -3.08),
      new Position(37.41, -4.65), new Position(36.34, -3.60), new Position(36.85, -2.95)
    ]),

    new MapFeature('Coastline', [
      new Position(41.76, 4.43), new Position(42.95, 4.39), new Position(42.79, 3.46),
      new Position(41.76, 4.43)
    ]),

    new MapFeature('Coastline', [
      new Position(42.25, 3.07), new Position(41.72, 2.97), new Position(42.68, 3.32),
      new Position(42.25, 3.07)
    ]),

    new MapFeature('Coastline', [
      new Position(44.15, 3.49), new Position(45.82, 6.09), new Position(49.04, 5.98),
      new Position(50.58, 6.93), new Position(52.52, 5.81), new Position(50.69, 3.21),
      new Position(44.84, 1.33), new Position(44.90, 3.26), new Position(44.15, 3.49)
    ]),

    new MapFeature('Coastline', [
      new Position(44.61, -9.86), new Position(45.47, -10.26), new Position(43.58, -10.06),
      new Position(44.61, -9.86)
    ]),

    new MapFeature('Coastline', [
      new Position(48.18, -6.71), new Position(47.67, -5.71), new Position(47.21, -7.00),
      new Position(48.15, -7.53), new Position(48.18, -6.71)
    ]),

    new MapFeature('Coastline', [
      new Position(48.33, -5.71), new Position(49.36, -5.33), new Position(52.86, -9.02),
      new Position(49.67, -8.66), new Position(49.38, -7.51), new Position(48.30, -7.42),
      new Position(49.25, -6.11), new Position(48.33, -6.69), new Position(48.33, -5.71)
    ]),

    new MapFeature('Coastline', [
      new Position(62.83, -24.46), new Position(63.50, -23.93), new Position(64.08, -24.71),
      new Position(62.83, -24.46)
    ]),
  ],
  60
)
