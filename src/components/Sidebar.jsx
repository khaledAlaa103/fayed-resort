import { toArabicDigits } from '../utils/numbers.js'

const NAV_ITEMS = [
  { id: 'housing', label: 'الإسكان' },
  { id: 'restaurant', label: 'المطعم' },
  { id: 'cafeteria', label: 'الكافتيريا' },
  { id: 'inventory', label: 'إدارة المخزن' },
  { id: 'accounts', label: 'الحسابات' },
]

export default function Sidebar({ section, yearInfo, onSelectYear, onNavigate, onLogout }) {
  const years = yearInfo?.years || []
  const viewingYear = yearInfo?.viewingYear
  const currentYear = yearInfo?.currentYear

  return (
    <aside className="sidebar">
      <img className="sidebar-logo" src="/logo.png" alt="Fayed Resort" />
      <h2>لوحة الإدارة</h2>

      <div className="year-switcher">
        <label htmlFor="yearSelect">السنة</label>
        <select
          id="yearSelect"
          value={viewingYear}
          onChange={(e) => onSelectYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {toArabicDigits(year)}{year === currentYear ? ' — الحالية' : ' — أرشيف'}
            </option>
          ))}
        </select>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={section === item.id ? 'active' : ''}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button type="button" className="logout-btn" onClick={onLogout}>
        تسجيل خروج
      </button>
    </aside>
  )
}
