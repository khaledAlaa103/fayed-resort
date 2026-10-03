import { fromArabicDigits } from './numbers.js'

export function normalizeSearch(value) {
  return fromArabicDigits(String(value ?? ''))
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function matchesSearch(text, query) {
  const q = normalizeSearch(query)
  if (!q) return true
  return normalizeSearch(text).includes(q)
}
