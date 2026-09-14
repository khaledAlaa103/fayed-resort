import BackButton from '../components/BackButton.jsx'
import { chaletsData, housingMonths } from '../data/chalets.js'
import { isChaletBooked } from '../utils/storage.js'

export default function Housing({
  month,
  day,
  onBack,
  onSelectMonth,
  onSelectDay,
  onSelectChalet,
}) {
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
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              className={day === d ? 'active' : ''}
              onClick={() => onSelectDay(d)}
            >
              {d}
            </button>
          ))}
        </div>
      ) : null}

      {month && day ? (
        <>
          <h3>خريطة شاليهات يوم {day} {month}</h3>
          <div className="chalet-grid">
            {chaletsData.map((ch) => {
              const booked = isChaletBooked(month, day, ch.id)
              return (
                <div
                  key={ch.id}
                  className={`chalet ${ch.type} ${booked ? 'booked' : ''}`}
                  onClick={() => onSelectChalet(ch.id)}
                >
                  <strong>{ch.id}</strong>
                  <br />
                  <small>{ch.area}</small>
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </>
  )
}
