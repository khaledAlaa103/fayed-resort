import { currentYear, formatNumericDate, fromArabicDigits, monthNumber, parseDateParts } from '../utils/dates.js'

function partValue(value) {
  const digits = fromArabicDigits(value).replace(/\D/g, '')
  return digits ? Number(digits) : ''
}

export default function ArabicDate({
  day,
  month,
  year,
  value,
  editable = false,
  disabled = false,
  className = '',
  onChange,
}) {
  const parsed = value != null
    ? parseDateParts(value)
    : {
      day: Number(day),
      month: monthNumber(month),
      year: year ?? currentYear(),
    }
  const [d, m, y] = formatNumericDate(parsed.day, parsed.month, parsed.year).split('/')

  const emit = (next) => {
    if (!onChange) return
    onChange(formatNumericDate(
      next.day || parsed.day,
      next.month || parsed.month,
      next.year || parsed.year,
    ))
  }

  if (!editable) {
    return (
      <span className={`arabic-date ${className}`.trim()} dir="rtl">
        <bdi>{d}</bdi>
        <span>/</span>
        <bdi>{m}</bdi>
        <span>/</span>
        <bdi>{y}</bdi>
      </span>
    )
  }

  return (
    <span className={`arabic-date editable ${className}`.trim()} dir="rtl">
      <input
        className="date-day"
        inputMode="numeric"
        value={d}
        disabled={disabled}
        aria-label="اليوم"
        onChange={(e) => emit({ ...parsed, day: partValue(e.target.value) })}
      />
      <span>/</span>
      <input
        className="date-month"
        inputMode="numeric"
        value={m}
        disabled={disabled}
        aria-label="الشهر"
        onChange={(e) => emit({ ...parsed, month: partValue(e.target.value) })}
      />
      <span>/</span>
      <input
        className="date-year"
        inputMode="numeric"
        value={y}
        disabled={disabled}
        aria-label="السنة"
        onChange={(e) => emit({ ...parsed, year: partValue(e.target.value) })}
      />
    </span>
  )
}
