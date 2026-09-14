import { useState } from 'react'
import BackButton from '../components/BackButton.jsx'

export default function Menu({ type, items, onAdd, onRemove, onBack }) {
  const title = type === 'restaurant' ? 'المطعم' : 'الكافتيريا'
  const [name, setName] = useState('')
  const [components, setComponents] = useState('')
  const [price, setPrice] = useState('')

  const handleAdd = () => {
    if (!name || !price) {
      alert('أكمل البيانات')
      return
    }
    onAdd({ name, components, price: parseInt(price, 10) })
    setName('')
    setComponents('')
    setPrice('')
  }

  const handleRemove = (index) => {
    if (confirm('حذف الصنف؟')) onRemove(index)
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <div className="add-product-container">
        <h3 style={{ marginTop: 0 }}>إضافة صنف جديد لـ {title}</h3>
        <div className="add-product-form">
          <input
            type="text"
            placeholder="اسم الصنف"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="المكونات"
            value={components}
            onChange={(e) => setComponents(e.target.value)}
          />
          <input
            type="number"
            placeholder="السعر"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="button" className="add-item-btn" onClick={handleAdd}>
            إضافة صنف جديد
          </button>
        </div>
      </div>

      <div className="menu-grid">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="menu-card">
            <h3>{item.name}</h3>
            <p>{item.components || 'لا يوجد'}</p>
            <strong>{item.price} ج</strong>
            <button
              type="button"
              className="delete-item-btn"
              onClick={() => handleRemove(index)}
            >
              حذف الصنف
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
