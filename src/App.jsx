import { useState } from 'react'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Housing from './pages/Housing.jsx'
import Booking from './pages/Booking.jsx'
import Menu from './pages/Menu.jsx'
import Inventory from './pages/Inventory.jsx'
import Accounts from './pages/Accounts.jsx'
import { defaultMeals } from './data/meals.js'
import { defaultCafeteria } from './data/cafeteria.js'
import { getDefaultInventory } from './data/inventory.js'
import { usePersistedState } from './hooks/usePersistedState.js'
import { loadJson, saveJson } from './utils/storage.js'

function loadInventory() {
  if (!localStorage.getItem('inventory_final_complete_v4')) {
    localStorage.setItem('inventory_final_complete_v4', 'true')
    const data = getDefaultInventory()
    saveJson('inventoryData', data)
    return data
  }
  const stored = loadJson('inventoryData', null)
  if (!stored || stored.length === 0) {
    const data = getDefaultInventory()
    saveJson('inventoryData', data)
    return data
  }
  return stored
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('isLoggedIn') === 'true')
  const [section, setSection] = useState('home')
  const [month, setMonth] = useState(null)
  const [day, setDay] = useState(null)
  const [chaletId, setChaletId] = useState(null)
  const [accountsTick, setAccountsTick] = useState(0)
  const [meals, setMeals] = usePersistedState('mealsData', defaultMeals)
  const [cafeteria, setCafeteria] = usePersistedState('cafeteriaData', defaultCafeteria)
  const [inventory, setInventory] = useState(() => loadInventory())

  const updateInventory = (updater) => {
    setInventory((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveJson('inventoryData', next)
      return next
    })
  }

  const goHome = () => {
    setSection('home')
    setMonth(null)
    setDay(null)
    setChaletId(null)
  }

  const handleNavigate = (nextSection) => {
    setSection(nextSection)
    setChaletId(null)
    if (nextSection !== 'housing') {
      setMonth(null)
      setDay(null)
    }
    if (nextSection === 'accounts') {
      setAccountsTick((tick) => tick + 1)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    setLoggedIn(false)
    goHome()
  }

  if (!loggedIn) {
    return <Login onSuccess={() => setLoggedIn(true)} />
  }

  return (
    <div id="mainApp">
      <Sidebar section={section} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        {section === 'home' ? <Home /> : null}

        {section === 'housing' && !chaletId ? (
          <Housing
            month={month}
            day={day}
            onBack={goHome}
            onSelectMonth={(value) => {
              setMonth(value)
              setDay(null)
            }}
            onSelectDay={setDay}
            onSelectChalet={setChaletId}
          />
        ) : null}

        {section === 'housing' && chaletId ? (
          <Booking
            key={`${month}-${day}-${chaletId}`}
            month={month}
            day={day}
            chaletId={chaletId}
            meals={meals}
            cafeteria={cafeteria}
            onBack={() => setChaletId(null)}
          />
        ) : null}

        {section === 'restaurant' ? (
          <Menu
            type="restaurant"
            items={meals}
            onAdd={(item) => setMeals((prev) => [...prev, item])}
            onRemove={(index) => setMeals((prev) => prev.filter((_, i) => i !== index))}
            onBack={goHome}
          />
        ) : null}

        {section === 'cafeteria' ? (
          <Menu
            type="cafeteria"
            items={cafeteria}
            onAdd={(item) => setCafeteria((prev) => [...prev, item])}
            onRemove={(index) => setCafeteria((prev) => prev.filter((_, i) => i !== index))}
            onBack={goHome}
          />
        ) : null}

        {section === 'inventory' ? (
          <Inventory items={inventory} onChange={updateInventory} onBack={goHome} />
        ) : null}

        {section === 'accounts' ? (
          <Accounts refreshKey={accountsTick} onBack={goHome} />
        ) : null}
      </main>
    </div>
  )
}
