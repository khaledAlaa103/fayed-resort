import { normalizeGuestType } from './guestPrices.js'

export const STAY_PRICES = {
  single: {
    airForce: 200,
    nonMember: 300,
    armedForces: 350,
    civilian: 500,
  },
  double: {
    airForce: 250,
    nonMember: 350,
    armedForces: 450,
    civilian: 600,
  },
}

export function stayPriceFor(chaletType, guestType) {
  const room = chaletType === 'single' ? 'single' : 'double'
  const guest = normalizeGuestType(guestType)
  return Number(STAY_PRICES[room][guest]) || STAY_PRICES[room].civilian
}
