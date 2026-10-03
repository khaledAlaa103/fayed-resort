export const GUEST_TYPES = [
  { id: 'airForce', label: 'قوات جوية' },
  { id: 'nonMember', label: 'غير عضو قوات جوية' },
  { id: 'armedForces', label: 'قوات مسلحة' },
  { id: 'civilian', label: 'مدني' },
]

const VALID_TYPES = new Set(GUEST_TYPES.map((item) => item.id))

export function normalizeGuestType(value) {
  if (VALID_TYPES.has(value)) return value
  if (value === 'military') return 'armedForces'
  return 'civilian'
}

export function guestTypeLabel(value) {
  const type = normalizeGuestType(value)
  return GUEST_TYPES.find((item) => item.id === type)?.label || 'مدني'
}

export function isMilitaryGuest(guestType) {
  const type = normalizeGuestType(guestType)
  return type === 'airForce' || type === 'nonMember' || type === 'armedForces'
}

export function emptyPriceTiers() {
  return {
    airForce: '',
    nonMember: '',
    armedForces: '',
    civilian: '',
  }
}

export function normalizePriceTiers(item = {}) {
  const tiers = item.priceTiers || {}
  const fallback = Number(item.price) || 0
  const civilian = Number(tiers.civilian) || fallback
  const armedForces = Number(tiers.armedForces) || civilian
  return {
    airForce: Number(tiers.airForce) || fallback,
    nonMember: armedForces,
    armedForces,
    civilian,
  }
}

export function itemPriceForGuest(item, guestType) {
  if (!item) return 0
  const type = normalizeGuestType(guestType)
  const tiers = normalizePriceTiers(item)
  return Number(tiers[type]) || Number(item.price) || 0
}
