import { useState } from 'react'
import { normalizeNumberInput, toArabicDigits } from '../utils/numbers.js'

function formatDisplay(value, western) {
  if (value === '' || value == null) return ''
  return western ? String(value) : toArabicDigits(value)
}

export default function ArabicNumberInput({
  value,
  onChange,
  className = '',
  western = false,
  ...props
}) {
  const [draft, setDraft] = useState(null)

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      dir="ltr"
      lang={western ? 'en' : 'ar'}
      className={className}
      value={draft ?? formatDisplay(value, western)}
      onFocus={() => setDraft(formatDisplay(value, western))}
      onChange={(e) => {
        const next = normalizeNumberInput(e.target.value)
        setDraft(western ? next : toArabicDigits(next))
        onChange?.(next)
      }}
      onBlur={() => setDraft(null)}
    />
  )
}
