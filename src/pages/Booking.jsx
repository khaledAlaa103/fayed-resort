import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { loadBooking, saveBooking, removeBooking } from '../utils/storage.js'
import { compressImage } from '../utils/image.js'

export default function Booking({ month, day, chaletId, meals, cafeteria, onBack }) {
  const existing = useMemo(() => loadBooking(month, day, chaletId) || {}, [month, day, chaletId])
  const [uType, setUType] = useState(existing.uType || 'civilian')
  const [rank, setRank] = useState(existing.rank || '')
  const [name, setName] = useState(existing.name || '')
  const [stayPrice, setStayPrice] = useState(existing.stayPrice ?? '')
  const [idCardImage, setIdCardImage] = useState(existing.idCardImage || '')
  const [idCardFile, setIdCardFile] = useState(null)
  const [selectedItems, setSelectedItems] = useState(existing.items || [])
  const [itemValue, setItemValue] = useState('')
  const [itemQty, setItemQty] = useState(1)
  const [saving, setSaving] = useState(false)

  const options = [
    ...meals.map((m) => ({ label: `مطعم: ${m.name} (${m.price} ج)`, value: `${m.name}|${m.price}` })),
    ...cafeteria.map((c) => ({ label: `كافتيريا: ${c.name} (${c.price} ج)`, value: `${c.name}|${c.price}` })),
  ]

  const itemsTotal = selectedItems.reduce((sum, item) => sum + item.total, 0)
  const grandTotal = (parseFloat(stayPrice) || 0) + itemsTotal
  const hasBooking = Boolean(loadBooking(month, day, chaletId))

  const addItem = () => {
    const value = itemValue || options[0]?.value
    if (!value) return
    const [itemName, price] = value.split('|')
    const qty = parseInt(itemQty, 10) || 1
    setSelectedItems((prev) => [
      ...prev,
      { name: itemName, qty, total: parseInt(price, 10) * qty },
    ])
  }

  const removeItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let imageData = idCardImage
      if (idCardFile) {
        imageData = await compressImage(idCardFile)
      }

      saveBooking(month, day, chaletId, {
        name,
        uType,
        rank: uType === 'military' ? rank : '',
        stayPrice: parseFloat(stayPrice) || 0,
        items: selectedItems,
        idCardImage: imageData,
      })

      alert('تم الحفظ بنجاح')
      onBack()
    } catch {
      alert('حدث خطأ أثناء حفظ الصورة')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelBooking = () => {
    if (!confirm('هل أنت متأكد من إلغاء الحجز تماماً؟')) return
    removeBooking(month, day, chaletId)
    alert('تم إلغاء الحجز بنجاح')
    onBack()
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <div className="panel">
        <div className="panel-header">
          <h3>حجز شاليه: {chaletId} (يوم {day} {month})</h3>
          {hasBooking ? (
            <button type="button" className="cancel-booking-btn" onClick={handleCancelBooking}>
              إلغاء الحجز تماماً
            </button>
          ) : null}
        </div>
        <hr />
        <div className="booking-grid">
          <div>
            <label>النوع:</label>
            <select value={uType} onChange={(e) => setUType(e.target.value)}>
              <option value="civilian">مدني</option>
              <option value="military">عسكري</option>
            </select>

            {uType === 'military' ? (
              <div className="rank-field">
                <label>الرتبة:</label>
                <input type="text" value={rank} onChange={(e) => setRank(e.target.value)} />
              </div>
            ) : null}

            <label>الاسم:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>سعر الإقامة:</label>
            <input
              type="number"
              value={stayPrice}
              onChange={(e) => setStayPrice(e.target.value)}
            />

            <div className="id-card-box">
              <label><b>إرفاق صورة الكارنيه أو البطاقة:</b></label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setIdCardFile(file)
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => setIdCardImage(ev.target.result)
                    reader.readAsDataURL(file)
                  }
                }}
              />
              {idCardImage ? (
                <div style={{ marginTop: 10 }}>
                  <img src={idCardImage} alt="صورة البطاقة" className="id-preview" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="booking-items">
            <h4>إضافة وجبات أو مشروبات</h4>
            <select value={itemValue} onChange={(e) => setItemValue(e.target.value)}>
              <optgroup label="المطعم">
                {meals.map((m) => (
                  <option key={`r-${m.name}`} value={`${m.name}|${m.price}`}>
                    {m.name} ({m.price} ج)
                  </option>
                ))}
              </optgroup>
              <optgroup label="الكافتيريا">
                {cafeteria.map((c) => (
                  <option key={`c-${c.name}`} value={`${c.name}|${c.price}`}>
                    {c.name} ({c.price} ج)
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="flex-row">
              <input
                className="qty-input"
                type="number"
                min="1"
                value={itemQty}
                onChange={(e) => setItemQty(e.target.value)}
              />
              <button type="button" className="add-line-btn" onClick={addItem}>+ إضافة</button>
            </div>
            <div style={{ marginTop: 15 }}>
              {selectedItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="selected-item">
                  <span>{item.name} (x{item.qty})</span>
                  <span>
                    {item.total} ج
                    <button type="button" onClick={() => removeItem(index)}>×</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-total">
          <span>إجمالي المبلغ:</span>
          <strong>{grandTotal.toLocaleString()} جنيه</strong>
        </div>
        <button type="button" className="save-booking-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ بيانات الحجز'}
        </button>
      </div>
    </>
  )
}
