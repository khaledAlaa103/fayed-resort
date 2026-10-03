import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { chaletsData, chaletTypeLabel, daysInMonth, housingMonths } from '../data/chalets.js'
import ArabicDate from '../components/ArabicDate.jsx'
import { toArabicDigits } from '../utils/dates.js'
import { matchesSearch, normalizeSearch } from '../utils/search.js'

function timesLabel(count) {
  const n = Number(count) || 0
  if (n === 1) return `${toArabicDigits(1)} مرة`
  if (n === 2) return 'مرتين'
  return `${toArabicDigits(n)} مرات`
}

function guestKey(name) {
  return normalizeSearch(name) || 'بدون-اسم'
}

export default function Housing({
  month,
  day,
  year,
  bookings,
  onBack,
  onSelectMonth,
  onSelectDay,
  onSelectChalet,
}) {
  const [query, setQuery] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const [resultsMonth, setResultsMonth] = useState(null)

  const bookedIds = useMemo(() => {
    const ids = new Set()
    for (const item of bookings) {
      if (item.month === month && Number(item.day) === Number(day)) {
        ids.add(Number(item.chaletId))
      }
    }
    return ids
  }, [bookings, month, day])

  const nameSuggestions = useMemo(() => {
    if (!query.trim()) return []
    const map = new Map()
    for (const item of bookings) {
      if (!item.name || !matchesSearch(item.name, query)) continue
      const key = guestKey(item.name)
      if (!map.has(key)) map.set(key, item.name)
    }
    return [...map.entries()].map(([key, name]) => ({ key, name }))
  }, [bookings, query])

  const selectedGuest = nameSuggestions.find((item) => item.key === selectedKey)
    || (selectedKey ? { key: selectedKey, name: bookings.find((item) => guestKey(item.name) === selectedKey)?.name || '' } : null)

  const selectedBookings = useMemo(() => {
    if (!selectedKey) return []
    return bookings
      .filter((item) => guestKey(item.name) === selectedKey)
      .filter((item) => !resultsMonth || item.month === resultsMonth)
      .sort((a, b) => {
        const monthDiff = housingMonths.indexOf(a.month) - housingMonths.indexOf(b.month)
        if (monthDiff) return monthDiff
        return Number(a.day) - Number(b.day) || Number(a.chaletId) - Number(b.chaletId)
      })
  }, [bookings, selectedKey, resultsMonth])

  const guestDays = useMemo(() => {
    const days = new Set()
    for (const item of selectedBookings) {
      if (!month || item.month === month) days.add(Number(item.day))
    }
    return days
  }, [selectedBookings, month])

  const guestChaletIds = useMemo(() => {
    const ids = new Set()
    if (!day) return ids
    for (const item of selectedBookings) {
      if ((!month || item.month === month) && Number(item.day) === Number(day)) {
        ids.add(Number(item.chaletId))
      }
    }
    return ids
  }, [selectedBookings, month, day])

  const showGuestDays = (guest) => {
    setSelectedKey(guest.key)
    setResultsMonth(month || null)
  }

  const selectGuestDay = (booking) => {
    if (booking.month && booking.month !== month) onSelectMonth(booking.month)
    onSelectDay(Number(booking.day))
  }

  const clearSearch = () => {
    setQuery('')
    setSelectedKey('')
    setResultsMonth(null)
  }

  const handleQueryChange = (value) => {
    setQuery(value)
    setSelectedKey('')
    setResultsMonth(null)
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <h2>قسم الإسكان</h2>

      <div className="search-field no-print">
        <label htmlFor="housing-guest-search">بحث باسم الحاجز</label>
        <div className="search-field-row">
          <input
            id="housing-guest-search"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="اكتب اسم الحاجز..."
          />
          {query || selectedKey ? (
            <button type="button" className="search-clear" onClick={clearSearch} aria-label="إلغاء البحث">
              ×
            </button>
          ) : null}
        </div>
      </div>

      {query.trim() && !selectedKey ? (
        <div className="guest-search-results no-print">
          {nameSuggestions.length === 0 ? (
            <p>لا يوجد حاجز بهذا الاسم.</p>
          ) : (
            <>
              <p>اضغط على اسم الحاجز لعرض عدد الحجوزات والأيام:</p>
              <ul>
                {nameSuggestions.map((guest) => (
                  <li key={guest.key}>
                    <button type="button" onClick={() => showGuestDays(guest)}>
                      {guest.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}

      {selectedKey ? (
        <div className="guest-search-results no-print">
          <div className="guest-search-card">
            <div className="guest-search-head">
              <strong>{selectedGuest?.name || 'الحاجز'}</strong>
              <button type="button" className="search-clear" onClick={clearSearch} aria-label="إلغاء البحث">
                ×
              </button>
            </div>
            {selectedBookings.length === 0 ? (
              <span>{resultsMonth ? `لا توجد حجوزات في شهر ${resultsMonth}.` : 'لا توجد حجوزات.'}</span>
            ) : (
              <>
                <span>
                  حجز {timesLabel(selectedBookings.length)}
                  {resultsMonth ? ` في ${resultsMonth}` : ' خلال السنة'}
                </span>
                <ul>
                  {selectedBookings.map((booking) => {
                    const active = booking.month === month && Number(booking.day) === Number(day)
                    return (
                      <li key={booking.key || `${booking.month}-${booking.day}-${booking.chaletId}`}>
                        <button
                          type="button"
                          className={active ? 'active' : ''}
                          onClick={() => selectGuestDay(booking)}
                        >
                          {resultsMonth ? '' : `${booking.month} — `}
                          يوم {toArabicDigits(booking.day)} — شاليه {toArabicDigits(booking.chaletId)}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : null}

      <div className="month-selector">
        {housingMonths.map((m) => (
          <button
            key={m}
            type="button"
            className={month === m ? 'active' : ''}
            onClick={() => onSelectMonth(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {month ? (
        <div className="days-container">
          {Array.from({ length: daysInMonth[month] || 31 }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              className={`${day === d ? 'active' : ''} ${guestDays.has(d) ? 'guest-hit' : ''}`}
              onClick={() => onSelectDay(d)}
            >
              {toArabicDigits(d)}
            </button>
          ))}
        </div>
      ) : null}

      {month && day ? (
        <>
          <h3>خريطة شاليهات يوم <ArabicDate day={day} month={month} year={year} /></h3>
          <div className="chalet-legend">
            <span className="legend-double">سويت زوجي</span>
            <span className="legend-single">سويت فردي</span>
          </div>
          <div className="chalet-grid">
            {chaletsData.map((ch) => {
              const booked = bookedIds.has(Number(ch.id))
              const guestHit = guestChaletIds.has(Number(ch.id))
              return (
                <button
                  type="button"
                  key={ch.id}
                  className={`chalet ${ch.type} ${booked ? 'booked' : ''} ${guestHit ? 'guest-hit' : ''}`}
                  onClick={() => onSelectChalet(ch.id)}
                >
                  <strong>{toArabicDigits(ch.id)}</strong>
                  <span className="chalet-type">{chaletTypeLabel(ch.type)}</span>
                  <small>{ch.area}</small>
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </>
  )
}
