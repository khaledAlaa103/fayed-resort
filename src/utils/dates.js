import { monthMap } from '../data/chalets.js'
import { fromArabicDigits, toArabicDigits } from './numbers.js'

export { fromArabicDigits, toArabicDigits }

export function currentYear() {
  return new Date().getFullYear()
}

export function monthNumber(month) {
  return Number(monthMap[month] || month)
}

export function formatNumericDate(day, month, year = currentYear()) {
  return [
    toArabicDigits(Number(day)),
    toArabicDigits(monthNumber(month)),
    toArabicDigits(year),
  ].join('/')
}

export function formatDayMonthArabic(day, month, year = currentYear()) {
  return formatNumericDate(day, month, year)
}

export function parseDateParts(input) {
  const now = new Date()
  const fallback = {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }

  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return { day: input.getDate(), month: input.getMonth() + 1, year: input.getFullYear() }
  }

  const str = fromArabicDigits(String(input || '').trim())
  if (!str) return fallback

  const iso = str.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (iso) return { day: Number(iso[3]), month: Number(iso[2]), year: Number(iso[1]) }

  const dmy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmy) return { day: Number(dmy[1]), month: Number(dmy[2]), year: Number(dmy[3]) }

  const dm = str.match(/^(\d{1,2})[/-](\d{1,2})$/)
  if (dm) return { day: Number(dm[1]), month: Number(dm[2]), year: fallback.year }

  return fallback
}

function formatParts(day, month, year) {
  return formatNumericDate(day, month, year ?? currentYear())
}

export function formatAnyDateArabic(input) {
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return formatParts(input.getDate(), input.getMonth() + 1, input.getFullYear())
  }

  const str = fromArabicDigits(String(input || '').trim())
  if (!str) return ''

  const iso = str.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (iso) {
    return formatParts(iso[3], iso[2], iso[1])
  }

  const dmy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmy) {
    return formatParts(dmy[1], dmy[2], dmy[3])
  }

  const dm = str.match(/^(\d{1,2})[/-](\d{1,2})$/)
  if (dm) {
    return formatParts(dm[1], dm[2], currentYear())
  }

  return toArabicDigits(str)
}

export function todayArabicNumeric() {
  const now = new Date()
  return formatParts(now.getDate(), now.getMonth() + 1, now.getFullYear())
}
