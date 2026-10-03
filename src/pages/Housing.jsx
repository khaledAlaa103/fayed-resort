import BackButton from '../components/BackButton.jsx'
import { chaletsData, chaletTypeLabel, daysInMonth, housingMonths } from '../data/chalets.js'
import ArabicDate from '../components/ArabicDate.jsx'
import { toArabicDigits } from '../utils/dates.js'

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
  const isBooked = (chaletId) => bookings.some(
    (item) => item.month === month && Number(item.day) === Number(day) && Number(item.chaletId) === Number(chaletId),
  )

  return (
    <>
      <BackButton onClick={onBack} />
      <h2>قسم الإسكان</h2>
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
              className={day === d ? 'active' : ''}
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
              const booked = isBooked(ch.id)
              return (
                <button
                  type="button"
                  key={ch.id}
                  className={`chalet ${ch.type} ${booked ? 'booked' : ''}`}
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
