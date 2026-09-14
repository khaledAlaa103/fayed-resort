const NAV_ITEMS = [
  { id: 'housing', label: 'الإسكان' },
  { id: 'restaurant', label: 'المطعم' },
  { id: 'cafeteria', label: 'الكافتيريا' },
  { id: 'inventory', label: 'إدارة المخزن' },
  { id: 'accounts', label: 'الحسابات' },
]

export default function Sidebar({ section, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <h2>لوحة الإدارة</h2>
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
      <button type="button" className="logout-btn" onClick={onLogout}>
        تسجيل خروج
      </button>
    </aside>
  )
}
