import { useEffect, useState } from 'react'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Housing from './pages/Housing.jsx'
import Booking from './pages/Booking.jsx'
import Menu from './pages/Menu.jsx'
import Inventory from './pages/Inventory.jsx'
import Accounts from './pages/Accounts.jsx'
import AppDialog from './components/AppDialog.jsx'
import { api } from './api.js'
import { applyStockChange } from './utils/stock.js'
import { toArabicDigits } from './utils/numbers.js'
import { appAlert } from './utils/dialogs.js'

function PageSlot({ active, opened, children }) {
  if (!active && !opened) return null
  return (
    <div className="page-slot" hidden={!active} {...(!active ? { inert: '' } : {})}>
      {children}
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true')
  const [section, setSection] = useState('home')
  const [month, setMonth] = useState(null)
  const [day, setDay] = useState(null)
  const [chaletId, setChaletId] = useState(null)
  const [meals, setMeals] = useState([])
  const [cafeteria, setCafeteria] = useState([])
  const [inventory, setInventory] = useState([])
  const [bookings, setBookings] = useState([])
  const [yearInfo, setYearInfo] = useState({
    currentYear: new Date().getFullYear(),
    viewingYear: new Date().getFullYear(),
    live: true,
    readOnly: false,
    years: [new Date().getFullYear()],
  })
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [opened, setOpened] = useState({ home: true })

  const readOnly = Boolean(yearInfo.readOnly)
  const viewingYear = yearInfo.viewingYear

  const applyData = (mealsData, cafeteriaData, inventoryData, bookingsData, yearsData) => {
    setMeals(mealsData)
    setCafeteria(cafeteriaData)
    setInventory(inventoryData)
    setBookings(bookingsData)
    if (yearsData) setYearInfo(yearsData)
  }

  const loadAll = async () => {
    const [mealsData, cafeteriaData, inventoryData, bookingsData, yearsData] = await Promise.all([
      api.getMeals(),
      api.getCafeteria(),
      api.getInventory(),
      api.getBookings(),
      api.getYears(),
    ])
    applyData(mealsData, cafeteriaData, inventoryData, bookingsData, yearsData)
  }

  useEffect(() => {
    if (!loggedIn) return undefined
    let cancelled = false
    async function load() {
      setError('')
      setReady(false)
      try {
        await loadAll()
        if (!cancelled) setReady(true)
      } catch (err) {
        if (!cancelled) setError(err.message || 'تعذر فتح قاعدة البيانات')
      }
    }
    load()
    return () => { cancelled = true }
  }, [loggedIn])

  const persistMeals = (updater) => {
    if (readOnly) {
      appAlert('لا يمكن التعديل على سنة مؤرشفة')
      return
    }
    setMeals((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      api.saveMeals(next).catch((err) => appAlert(err.message))
      return next
    })
  }

  const persistCafeteria = (updater) => {
    if (readOnly) {
      appAlert('لا يمكن التعديل على سنة مؤرشفة')
      return
    }
    setCafeteria((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      api.saveCafeteria(next).catch((err) => appAlert(err.message))
      return next
    })
  }

  const updateInventory = (updater) => {
    if (readOnly) {
      appAlert('لا يمكن التعديل على سنة مؤرشفة')
      return
    }
    setInventory((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      api.saveInventory(next).catch((err) => appAlert(err.message))
      return next
    })
  }

  const currentBooking = bookings.find(
    (item) => item.month === month && Number(item.day) === Number(day) && Number(item.chaletId) === Number(chaletId),
  )

  const saveBookingRecord = async (data) => {
    const saved = await api.saveBooking(month, day, chaletId, data)
    setBookings((prev) => {
      const without = prev.filter(
        (item) => !(item.month === month && Number(item.day) === Number(day) && Number(item.chaletId) === Number(chaletId)),
      )
      return [...without, saved]
    })
  }

  const deleteBookingRecord = async (target = currentBooking) => {
    if (!target) return
    await api.deleteBooking(target.month, target.day, target.chaletId)
    setBookings((prev) => prev.filter((item) => item.key !== target.key))
  }

  const openSection = (id) => {
    setOpened((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
  }

  const goHome = () => {
    openSection('home')
    setSection('home')
    setMonth(null)
    setDay(null)
    setChaletId(null)
  }

  const handleNavigate = (nextSection) => {
    openSection(nextSection)
    setSection(nextSection)
    setChaletId(null)
    if (nextSection !== 'housing') {
      setMonth(null)
      setDay(null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    setLoggedIn(false)
    goHome()
  }

  const handleSelectYear = async (year) => {
    try {
      const info = await api.selectYear(Number(year))
      const [mealsData, cafeteriaData, inventoryData, bookingsData] = await Promise.all([
        api.getMeals(),
        api.getCafeteria(),
        api.getInventory(),
        api.getBookings(),
      ])
      applyData(mealsData, cafeteriaData, inventoryData, bookingsData, info)
      goHome()
    } catch (err) {
      appAlert(err.message || 'تعذر فتح بيانات هذه السنة')
    }
  }

  if (!loggedIn) {
    return <Login onSuccess={() => setLoggedIn(true)} />
  }

  if (error) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>قاعدة البيانات</h2>
          <p className="login-error">{error}</p>
          <p>شغّل المشروع بـ npm run dev حتى تُفتح قاعدة SQLite من مجلد database.</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>فايد ريزورت</h2>
          <p>جاري تحميل قاعدة البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div id="mainApp">
      <Sidebar
        section={section}
        yearInfo={yearInfo}
        onSelectYear={handleSelectYear}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {readOnly ? (
          <div className="archive-banner no-print">
            عرض أرشيف سنة {toArabicDigits(viewingYear)} — للقراءة فقط. التعديل متاح في السنة الحالية {toArabicDigits(yearInfo.currentYear)}.
          </div>
        ) : null}

        <PageSlot active={section === 'home'} opened={opened.home}>
          <Home />
        </PageSlot>

        <PageSlot active={section === 'housing' && !chaletId} opened={section === 'housing' && !chaletId}>
          <Housing
            month={month}
            day={day}
            year={viewingYear}
            bookings={bookings}
            onBack={goHome}
            onSelectMonth={(value) => {
              setMonth(value)
              setDay(null)
            }}
            onSelectDay={setDay}
            onSelectChalet={setChaletId}
          />
        </PageSlot>

        {section === 'housing' && chaletId ? (
          <Booking
            key={`${viewingYear}-${month}-${day}-${chaletId}`}
            month={month}
            day={day}
            year={viewingYear}
            chaletId={chaletId}
            meals={meals}
            cafeteria={cafeteria}
            inventory={inventory}
            existingBooking={currentBooking}
            readOnly={readOnly}
            onInventoryChange={updateInventory}
            onSaveBooking={saveBookingRecord}
            onDeleteBooking={deleteBookingRecord}
            onBack={() => setChaletId(null)}
          />
        ) : null}

        <PageSlot active={section === 'restaurant'} opened={opened.restaurant}>
          <Menu
            type="restaurant"
            items={meals}
            inventory={inventory}
            readOnly={readOnly}
            onAdd={(item) => persistMeals((prev) => [...prev, item])}
            onUpdate={(index, item) => persistMeals((prev) => prev.map((row, i) => (i === index ? { ...row, ...item } : row)))}
            onRemove={(index) => persistMeals((prev) => prev.filter((_, i) => i !== index))}
            onBack={goHome}
          />
        </PageSlot>

        <PageSlot active={section === 'cafeteria'} opened={opened.cafeteria}>
          <Menu
            type="cafeteria"
            items={cafeteria}
            inventory={inventory}
            readOnly={readOnly}
            onAdd={(item) => persistCafeteria((prev) => [...prev, item])}
            onUpdate={(index, item) => persistCafeteria((prev) => prev.map((row, i) => (i === index ? item : row)))}
            onRemove={(index) => persistCafeteria((prev) => prev.filter((_, i) => i !== index))}
            onBack={goHome}
          />
        </PageSlot>

        <PageSlot active={section === 'inventory'} opened={opened.inventory}>
          <Inventory items={inventory} readOnly={readOnly} onChange={updateInventory} onBack={goHome} />
        </PageSlot>

        <PageSlot active={section === 'accounts'} opened={opened.accounts}>
          <Accounts
            bookings={bookings}
            meals={meals}
            cafeteria={cafeteria}
            year={viewingYear}
            readOnly={readOnly}
            onBack={goHome}
            onDeleteBooking={async (booking) => {
              if (booking.stockDeductions?.length) {
                updateInventory((prev) => applyStockChange(prev, booking.stockDeductions, 1).inventory)
              }
              await deleteBookingRecord(booking)
            }}
          />
        </PageSlot>
      </main>
      <AppDialog />
    </div>
  )
}
