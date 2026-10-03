export const STOCK_UNITS = [
  'كيلو',
  'كيس',
  'زجاجة',
  'علبة',
  'برطمان',
  'كرتونة',
  'باكت',
  'قطعة',
  'عدد',
  'فرخة',
  'شكارة',
  'صفيحة',
  'جركن',
  'جالون',
  'ظرف',
  'طبق',
  'ربطة',
  'بيضة',
  'قالب',
  'رول',
]

export function displayUnit(unit) {
  if (!unit) return ''
  if (unit === 'ك' || unit === 'كجم') return 'كيلو'
  return unit
}

export function unitOptions(...extra) {
  return [...new Set([
    ...STOCK_UNITS,
    ...extra.flat().map(displayUnit).filter(Boolean),
  ])]
}
