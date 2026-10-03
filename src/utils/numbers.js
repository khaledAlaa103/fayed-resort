const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function toArabicDigits(value) {
  return String(value ?? '')
    .replace(/\d/g, (digit) => ARABIC_DIGITS[digit])
    .replace(/\./g, '٫')
}

export function fromArabicDigits(value) {
  return String(value ?? '')
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[٫،,]/g, '.')
    .replace(/٬/g, '')
}

export function normalizeNumberInput(value) {
  let raw = fromArabicDigits(value).replace(/[^\d.-]/g, '')
  const negative = raw.startsWith('-')
  raw = raw.replace(/-/g, '')
  const dot = raw.indexOf('.')
  if (dot !== -1) {
    raw = `${raw.slice(0, dot + 1)}${raw.slice(dot + 1).replace(/\./g, '')}`
  }
  return `${negative ? '-' : ''}${raw}`
}

export function numericValue(value) {
  const num = parseFloat(fromArabicDigits(String(value ?? '')).replace(/,/g, '.'))
  return Number.isFinite(num) ? num : 0
}

export function parseEditableNumber(value, previous = 0) {
  const raw = normalizeNumberInput(String(value ?? '')).trim()
  if (raw === '') return ''
  if (!/^-?\d*(?:\.\d*)?$/.test(raw)) {
    return previous
  }
  return raw
}

export function formatEnglishNumber(value, fractionDigits) {
  const options = fractionDigits == null
    ? { maximumFractionDigits: 3 }
    : {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }
  return numericValue(value).toLocaleString('en-US', options)
}

export function formatArabicNumber(value, fractionDigits) {
  const options = fractionDigits == null
    ? { maximumFractionDigits: 3 }
    : {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }
  return numericValue(value).toLocaleString('ar-EG', options)
}
