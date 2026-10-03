import { useMemo, useRef, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { formatIngredientsText, uniqueInventoryNames } from '../utils/stock.js'
import { formatArabicNumber, toArabicDigits } from '../utils/numbers.js'
import ArabicNumberInput from '../components/ArabicNumberInput.jsx'
import { matchesSearch } from '../utils/search.js'
import {
  GUEST_TYPES,
  emptyPriceTiers,
  itemPriceForGuest,
  normalizePriceTiers,
} from '../utils/guestPrices.js'
import { displayUnit, unitOptions } from '../utils/units.js'

function tiersToForm(item) {
  const tiers = normalizePriceTiers(item)
  return {
    airForce: String(tiers.airForce || ''),
    nonMember: String(tiers.nonMember || ''),
    armedForces: String(tiers.armedForces || ''),
    civilian: String(tiers.civilian || ''),
  }
}

export default function Menu({ type, items, inventory, readOnly = false, onAdd, onUpdate, onRemove, onBack }) {
  const title = type === 'restaurant' ? 'المطعم' : 'الكافتيريا'
  const isRestaurant = type === 'restaurant'
  const stockItems = uniqueInventoryNames(inventory)
  const [editingIndex, setEditingIndex] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [priceTiers, setPriceTiers] = useState(() => emptyPriceTiers())
  const [ingredients, setIngredients] = useState([])
  const [stockName, setStockName] = useState('')
  const [stockQuery, setStockQuery] = useState('')
  const [stockQty, setStockQty] = useState('')
  const [stockUnit, setStockUnit] = useState('')
  const formRef = useRef(null)
  const nameInputRef = useRef(null)
  const availableUnits = unitOptions(
    stockItems.map((item) => item.unit),
    stockUnit,
  )
  const filteredStock = useMemo(() => {
    const list = stockItems.filter((item) => matchesSearch(item.name, stockQuery))
    if (stockName && !list.some((item) => item.name === stockName)) {
      const current = stockItems.find((item) => item.name === stockName)
      if (current) return [current, ...list]
    }
    return list
  }, [stockItems, stockQuery, stockName])

  const resetForm = () => {
    setEditingIndex(null)
    setName('')
    setPrice('')
    setPriceTiers(emptyPriceTiers())
    setIngredients([])
    setStockName('')
    setStockQuery('')
    setStockQty('')
    setStockUnit('')
  }

  const handleStockNameChange = (value) => {
    setStockName(value)
    const item = stockItems.find((row) => row.name === value)
    setStockUnit(displayUnit(item?.unit))
  }

  const addIngredient = () => {
    const selectedName = stockName || stockItems[0]?.name
    const qty = parseFloat(stockQty)
    if (!selectedName) {
      alert('لا توجد أصناف في المخزن لربطها')
      return
    }
    if (!qty || qty <= 0) {
      alert('أدخل كمية المكون المستهلكة من المخزن')
      return
    }
    const unit = stockUnit || displayUnit(stockItems.find((item) => item.name === selectedName)?.unit) || ''
    setIngredients((prev) => {
      const existing = prev.find((item) => item.inventoryName === selectedName)
      if (existing) {
        return prev.map((item) => (
          item.inventoryName === selectedName
            ? { ...item, qty: item.qty + qty, unit }
            : item
        ))
      }
      return [...prev, { inventoryName: selectedName, qty, unit }]
    })
    setStockQty('')
  }

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!name) {
      alert('أكمل اسم الصنف والسعر')
      return
    }

    let payload = {
      name,
      ingredients,
      components: formatIngredientsText(ingredients),
    }

    if (isRestaurant) {
      const tiers = {}
      for (const guest of GUEST_TYPES) {
        const value = Number(priceTiers[guest.id])
        if (!Number.isFinite(value) || value < 0) {
          alert('أكمل أسعار كل الأنواع')
          return
        }
        tiers[guest.id] = value
      }
      tiers.nonMember = tiers.armedForces
      payload = { ...payload, price: tiers.civilian, priceTiers: tiers }
    } else {
      const value = Number(price)
      if (!Number.isFinite(value) || value < 0) {
        alert('أكمل اسم الصنف والسعر')
        return
      }
      payload = { ...payload, price: value }
    }

    if (ingredients.length === 0) {
      if (!confirm('الصنف غير مربوط بمكونات المخزن، لذلك لن يُخصم شيء عند طلب العميل. هل تريد الحفظ؟')) {
        return
      }
    }

    if (editingIndex === null) {
      onAdd(payload)
    } else {
      onUpdate(editingIndex, payload)
    }
    resetForm()
  }

  const startEdit = (item, index) => {
    setEditingIndex(index)
    setName(item.name)
    setPrice(String(item.price ?? ''))
    setPriceTiers(tiersToForm(item))
    setIngredients(item.ingredients || [])
    setStockName('')
    setStockQuery('')
    setStockQty('')
    setStockUnit('')
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    }, 50)
  }

  const handleRemove = (index) => {
    if (confirm('حذف الصنف؟')) {
      onRemove(index)
      if (editingIndex === index) resetForm()
    }
  }

  return (
    <>
      <BackButton onClick={onBack} />
      {readOnly ? null : (
      <div
        ref={formRef}
        className={`add-product-container${editingIndex === null ? '' : ' is-editing'}`}
      >
        <h3 style={{ marginTop: 0 }}>
          {editingIndex === null ? `إضافة صنف جديد لـ ${title}` : `تعديل صنف في ${title}`}
        </h3>
        <p className="recipe-hint">
          اكتب اسم الصنف، ثم اختر مكوناته من المخزن والكميات التي تُخصم مع كل طلب.
        </p>
        <div className="add-product-form">
          <input
            ref={nameInputRef}
            type="text"
            placeholder="اسم الصنف"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {isRestaurant ? null : (
            <ArabicNumberInput
              placeholder="السعر"
              value={price}
              onChange={setPrice}
            />
          )}
        </div>
        {isRestaurant ? (
          <div className="price-tiers">
            {GUEST_TYPES.map((guest) => (
              <div key={guest.id} className="price-tier-field">
                <label>{guest.label}</label>
                <ArabicNumberInput
                  placeholder="السعر"
                  value={priceTiers[guest.id]}
                  onChange={(value) => setPriceTiers((prev) => {
                    const next = { ...prev, [guest.id]: value }
                    if (guest.id === 'armedForces' || guest.id === 'nonMember') {
                      next.armedForces = value
                      next.nonMember = value
                    }
                    return next
                  })}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="recipe-builder">
          <h4>مكونات المخزن للصنف</h4>
          <div className="recipe-row">
            <input
              type="search"
              className="stock-search"
              value={stockQuery}
              onChange={(e) => {
                const value = e.target.value
                setStockQuery(value)
                const matches = stockItems.filter((item) => matchesSearch(item.name, value))
                if (matches.length === 1) {
                  handleStockNameChange(matches[0].name)
                }
              }}
              placeholder="ابحث عن الصنف..."
              aria-label="بحث عن صنف المخزن"
            />
            <select
              value={stockName}
              onChange={(e) => handleStockNameChange(e.target.value)}
              aria-label="اختر صنف من المخزن"
            >
              <option value="">
                {stockQuery && filteredStock.length === 0 ? 'لا توجد أصناف مطابقة' : 'اختر صنف من المخزن'}
              </option>
              {filteredStock.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} — المتبقي {toArabicDigits(item.qty)}
                </option>
              ))}
            </select>
            <ArabicNumberInput
              min="0.001"
              step="0.001"
              placeholder="الكمية لكل طلب"
              value={stockQty}
              onChange={setStockQty}
            />
            <select
              className="unit-select"
              value={stockUnit}
              onChange={(e) => setStockUnit(e.target.value)}
              aria-label="الوحدة"
            >
              <option value="">الوحدة</option>
              {availableUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <button type="button" className="add-line-btn" onClick={addIngredient}>
              + إضافة مكون
            </button>
          </div>

          {ingredients.length === 0 ? (
            <p className="recipe-empty">لم يتم ربط مكونات بعد. بدون الربط لن يُخصم شيء من المخزن.</p>
          ) : (
            <ul className="recipe-list">
              {ingredients.map((item, index) => (
                <li key={`${item.inventoryName}-${index}`}>
                  <span>{item.inventoryName}</span>
                  <strong>{toArabicDigits(item.qty)} {item.unit || ''}</strong>
                  <button type="button" onClick={() => removeIngredient(index)}>×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-row">
          <button type="button" className="add-item-btn" onClick={handleSave}>
            {editingIndex === null ? 'حفظ الصنف وربطه بالمخزن' : 'تحديث الصنف'}
          </button>
          {editingIndex !== null ? (
            <button type="button" className="cancel-btn" onClick={resetForm}>إلغاء التعديل</button>
          ) : null}
        </div>
      </div>
      )}

      <div className="menu-grid">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="menu-card">
            <h3>{item.name}</h3>
            <p>{item.components || formatIngredientsText(item.ingredients) || 'لا توجد مكونات مربوطة'}</p>
            {item.ingredients?.length ? (
              <ul className="recipe-mini">
                {item.ingredients.map((ing) => (
                  <li key={ing.inventoryName}>{toArabicDigits(ing.qty)} {ing.unit || ''} {ing.inventoryName}</li>
                ))}
              </ul>
            ) : (
              <p className="unlinked-warning">غير مربوط بالمخزن</p>
            )}
            {isRestaurant ? (
              <ul className="menu-card-prices">
                {GUEST_TYPES.map((guest) => (
                  <li key={guest.id}>
                    <span>{guest.label}</span>
                    <strong>{formatArabicNumber(itemPriceForGuest(item, guest.id))} ج</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <strong>{formatArabicNumber(item.price)} ج</strong>
            )}
            {readOnly ? null : (
            <div className="card-actions">
              <button type="button" className="edit-item-btn" onClick={() => startEdit(item, index)}>
                تعديل المكونات
              </button>
              <button type="button" className="delete-item-btn" onClick={() => handleRemove(index)}>
                حذف الصنف
              </button>
            </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
