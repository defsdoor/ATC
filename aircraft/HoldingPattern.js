export const HoldPhase = {
  OUTBOUND_LEG: 0,
  OUTBOUND_TURN: 1,
  INBOUND_LEG: 2,
  INBOUND_TURN: 3,
  INBOUND: 4,
  OUTBOUND: 5,
}

export class HoldingPattern {
  constructor(turnDirection, outboundTime) {
    this.turnDirection = turnDirection || 'right'
    this.outboundTime = outboundTime || 1
    this.phase = HoldPhase.OUTBOUND_LEG
  }
}
