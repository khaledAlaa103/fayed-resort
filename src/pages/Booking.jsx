import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { compressImage } from '../utils/image.js'
import { applyStockChange, buildDeductions } from '../utils/stock.js'
import ArabicDate from '../components/ArabicDate.jsx'
import ArabicNumberInput from '../components/ArabicNumberInput.jsx'
import { formatArabicNumber, toArabicDigits } from '../utils/numbers.js'
import {
  GUEST_TYPES,
  isMilitaryGuest,
  itemPriceForGuest,
  normalizeGuestType,
} from '../utils/guestPrices.js'
import { stayPriceFor } from '../utils/stayPrices.js'
import { chaletsData, chaletTypeLabel } from '../data/chalets.js'
import { api } from '../api.js'
import { appAlert, appConfirm } from '../utils/dialogs.js'

export default function Booking({
  month,
  day,
  year,
  chaletId,
  meals,
  cafeteria,
  inventory,
  existingBooking,
  readOnly = false,
  onInventoryChange,
  onSaveBooking,
  onDeleteBooking,
  onBack,
}) {
  const existing = existingBooking || {}
  const chalet = chaletsData.find((item) => Number(item.id) === Number(chaletId))
  const [uType, setUType] = useState(() => normalizeGuestType(existing.uType || 'civilian'))
  const [rank, setRank] = useState(existing.rank || '')
  const [name, setName] = useState(existing.name || '')
  const [stayPrice, setStayPrice] = useState(
    existing.stayPrice ?? stayPriceFor(chalet?.type, existing.uType || 'civilian'),
  )
  const [idCardImage, setIdCardImage] = useState(existing.idCardImage || '')
  const [idCardFile, setIdCardFile] = useState(null)
  const [selectedItems, setSelectedItems] = useState(existing.items || [])
  const [itemValue, setItemValue] = useState('r:0')
  const [itemQty, setItemQty] = useState(1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!existingBooking?.hasIdCard || existingBooking.idCardImage) return undefined
    let cancelled = false
    api.getBooking(month, day, chaletId).then((full) => {
      if (!cancelled && full?.idCardImage) setIdCardImage(full.idCardImage)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [existingBooking, month, day, chaletId])

  const itemsTotal = selectedItems.reduce((sum, item) => sum + item.total, 0)
  const grandTotal = (parseFloat(stayPrice) || 0) + itemsTotal
  const hasBooking = Boolean(existingBooking)
  const showRank = isMilitaryGuest(uType)

  const pricedMeal = (item, guestType = uType) => {
    const unitPrice = itemPriceForGuest(item, guestType)
    return unitPrice
  }

  const retotalMeals = (guestType, items) => items.map((row) => {
    if (row.source === 'cafeteria') return row
    const meal = meals.find((item) => item.name === row.name)
    if (!meal) return row
    const unitPrice = pricedMeal(meal, guestType)
    return { ...row, unitPrice, total: unitPrice * (Number(row.qty) || 1) }
  })

  const handleGuestTypeChange = (nextType) => {
    setUType(nextType)
    setStayPrice(stayPriceFor(chalet?.type, nextType))
    setSelectedItems((prev) => retotalMeals(nextType, prev))
  }

  const parseSelection = (value) => {
    const [source, indexText] = (value || itemValue || 'r:0').split(':')
    const index = parseInt(indexText, 10)
    if (source === 'c') {
      return { source: 'cafeteria', item: cafeteria[index] }
    }
    return { source: 'restaurant', item: meals[index] }
  }

  const addItem = () => {
    const { source, item } = parseSelection(itemValue)
    if (!item) return
    const qty = parseInt(itemQty, 10) || 1
    const unitPrice = source === 'cafeteria' ? (Number(item.price) || 0) : pricedMeal(item)
    setSelectedItems((prev) => [
      ...prev,
      {
        name: item.name,
        qty,
        unitPrice,
        total: unitPrice * qty,
        source,
        ingredients: item.ingredients || [],
      },
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

      const previous = existingBooking
      let stock = inventory
      if (previous?.stockDeductions?.length) {
        stock = applyStockChange(stock, previous.stockDeductions, 1).inventory
      }

      const unlinked = selectedItems.filter((item) => !item.ingredients?.length)
      const stockDeductions = buildDeductions(selectedItems, meals, cafeteria)
      const result = applyStockChange(stock, stockDeductions, -1)
      onInventoryChange(result.inventory)

      await onSaveBooking({
        name,
        uType,
        rank: showRank ? rank : '',
        stayPrice: parseFloat(stayPrice) || 0,
        items: selectedItems,
        idCardImage: imageData,
        stockDeductions,
      })

      const messages = ['تم حفظ الحجز وخصم مكونات الوجبات من المخزن.']
      if (unlinked.length) {
        messages.push(`أصناف غير مربوطة بالمخزن: ${unlinked.map((item) => item.name).join('، ')}`)
      }
      if (result.missing.length) {
        messages.push(`مكونات غير موجودة في المخزن: ${result.missing.join('، ')}`)
      }
      if (result.shortfalls.length) {
        messages.push(result.shortfalls.map((row) => (
          `${row.name}: المطلوب ${toArabicDigits(row.needed)} والمتوفر كان ${toArabicDigits(row.available)}`
        )).join('\n'))
      }
      await appAlert(messages.join('\n'))
      onBack()
    } catch (err) {
      await appAlert(err.message || 'حدث خطأ أثناء حفظ الحجز')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelBooking = async () => {
    const confirmed = await appConfirm('هل أنت متأكد من إلغاء الحجز تماماً؟')
    if (!confirmed) return
    const previous = existingBooking
    if (previous?.stockDeductions?.length) {
      const restored = applyStockChange(inventory, previous.stockDeductions, 1).inventory
      onInventoryChange(restored)
    }
    await onDeleteBooking()
    await appAlert('تم إلغاء الحجز وإرجاع الكميات إلى المخزن')
    onBack()
  }

  return (
    <>
      <BackButton onClick={onBack} />
      <div className="panel">
        <div className="panel-header">
          <h3>حجز شاليه: {toArabicDigits(chaletId)} {chaletTypeLabel(chalet?.type)} (يوم <ArabicDate day={day} month={month} year={year} />)</h3>
          {hasBooking && !readOnly ? (
            <button type="button" className="cancel-booking-btn" onClick={handleCancelBooking}>
              إلغاء الحجز تماماً
            </button>
          ) : null}
        </div>
        <hr />
        <div className="booking-grid">
          <div>
            <label>النوع:</label>
            <select value={uType} onChange={(e) => handleGuestTypeChange(e.target.value)} disabled={readOnly}>
              {GUEST_TYPES.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            {showRank ? (
              <div className="rank-field">
                <label>الرتبة:</label>
                <input
                  type="text"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  disabled={readOnly}
                  autoComplete="off"
                />
              </div>
            ) : null}

            <label>الاسم:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={readOnly}
              autoComplete="off"
            />

            <label>سعر الإقامة:</label>
            <ArabicNumberInput
              value={stayPrice}
              onChange={setStayPrice}
              disabled={readOnly}
            />
            <p className="stay-tariff-hint">
              {chalet?.type === 'single' ? 'سويت فردي' : 'سويت زوجي'} —
              قوات جوية {formatArabicNumber(stayPriceFor(chalet?.type, 'airForce'))} /
              غير عضو {formatArabicNumber(stayPriceFor(chalet?.type, 'nonMember'))} /
              قوات مسلحة {formatArabicNumber(stayPriceFor(chalet?.type, 'armedForces'))} /
              مدني {formatArabicNumber(stayPriceFor(chalet?.type, 'civilian'))}
            </p>
            <p className="stay-tariff-hint">الأطفال أقل من ١٢ سنة نصف وجبة. الداى يوز ١٠٠ للفرد والطفل ٥٠ جنيه.</p>

            {readOnly ? null : (
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
            )}
            {readOnly && idCardImage ? (
              <div className="id-card-box">
                <label><b>صورة الكارنيه أو البطاقة:</b></label>
                <div style={{ marginTop: 10 }}>
                  <img src={idCardImage} alt="صورة البطاقة" className="id-preview" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="booking-items">
            <h4>{readOnly ? 'الوجبات والمشروبات' : 'إضافة وجبات أو مشروبات'}</h4>
            {readOnly ? null : (
              <p className="recipe-hint">كل طلب مربوط بالمخزن يُخصم من المكونات فور حفظ الحجز.</p>
            )}
            {readOnly ? null : (
            <>
            <select value={itemValue} onChange={(e) => setItemValue(e.target.value)}>
              <optgroup label="المطعم">
                {meals.map((m, index) => (
                  <option key={`r-${m.name}`} value={`r:${index}`}>
                    {m.name} ({formatArabicNumber(itemPriceForGuest(m, uType))} ج){m.ingredients?.length ? '' : ' — غير مربوط'}
                  </option>
                ))}
              </optgroup>
              <optgroup label="الكافتيريا">
                {cafeteria.map((c, index) => (
                  <option key={`c-${c.name}`} value={`c:${index}`}>
                    {c.name} ({formatArabicNumber(c.price)} ج){c.ingredients?.length ? '' : ' — غير مربوط'}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="flex-row">
              <ArabicNumberInput
                className="qty-input"
                value={itemQty}
                onChange={setItemQty}
              />
              <button type="button" className="add-line-btn" onClick={addItem}>+ إضافة</button>
            </div>
            </>
            )}
            <div style={{ marginTop: 15 }}>
              {selectedItems.map((item, index) => (
                <div key={`${item.name}-${index}`} className="selected-item">
                  <span>
                    {item.name} (x{toArabicDigits(item.qty)})
                    {item.ingredients?.length ? '' : ' — بدون خصم مخزن'}
                  </span>
                  <span>
                    {formatArabicNumber(item.total)} ج
                    {readOnly ? null : (
                    <button type="button" onClick={() => removeItem(index)}>×</button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-total">
          <span>إجمالي المبلغ:</span>
          <strong>{formatArabicNumber(grandTotal)} جنيه</strong>
        </div>
        {readOnly ? null : (
        <button type="button" className="save-booking-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ بيانات الحجز'}
        </button>
        )}
      </div>
    </>
  )
}
