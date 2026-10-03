import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import Modal from '../components/Modal.jsx'
import { exportInventoryToWord } from '../utils/exportDoc.js'
import { consumedQty, roundQty } from '../utils/stock.js'
import { todayArabicNumeric } from '../utils/dates.js'
import { formatArabicNumber, numericValue, parseEditableNumber, toArabicDigits } from '../utils/numbers.js'
import ArabicDate from '../components/ArabicDate.jsx'
import ArabicNumberInput from '../components/ArabicNumberInput.jsx'
import { displayUnit, unitOptions } from '../utils/units.js'
import { matchesSearch } from '../utils/search.js'

export default function Inventory({ items, readOnly = false, onChange, onBack }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [query, setQuery] = useState('')

  const visibleItems = useMemo(() => {
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => matchesSearch(item.name, query))
  }, [items, query])

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + numericValue(item.total ?? (numericValue(item.qty) * numericValue(item.price))), 0),
    [items],
  )

  const updateField = (index, field, value) => {
    onChange((prev) => {
      const next = prev.map((item, i) => {
        if (i !== index) return item
        const updated = {
          ...item,
          [field]: field === 'qty' || field === 'price' || field === 'openingQty'
            ? parseEditableNumber(value, item[field])
            : value,
        }
        updated.total = numericValue(updated.qty) * numericValue(updated.price)
        if (field === 'qty' && updated.openingQty == null) {
          updated.openingQty = updated.qty
        }
        return updated
      })
      return next
    })
  }

  const deleteItem = (index) => {
    const itemName = items[index]?.name
    if (!confirm(`هل أنت متأكد من حذف صنف "${itemName}"؟`)) return
    onChange((prev) => prev.filter((_, i) => i !== index))
  }

  const openAddModal = () => {
    setForm(emptyForm())
    setModalOpen(true)
  }

  const saveNewItem = () => {
    if (!form.name) {
      alert('يرجى إدخال اسم الصنف')
      return
    }
    const qty = parseFloat(form.qty) || 0
    const price = parseFloat(form.price) || 0
    onChange((prev) => [
      { date: form.date, name: form.name, unit: form.unit, qty, price, total: qty * price, openingQty: qty },
      ...prev,
    ])
    setModalOpen(false)
  }

  const exportWord = () => {
    const table = document.getElementById('inventoryPrintArea')
    if (table) exportInventoryToWord(table.innerHTML)
  }

  return (
    <>
      <div className="section-toolbar">
        <h2>📦 جرد مخازن فايد ريزورت</h2>
        <div className="toolbar-actions no-print">
          <button type="button" className="btn-print" onClick={() => window.print()}>🖨️ طباعة</button>
          <button type="button" className="btn-word" onClick={exportWord}>📄 Word</button>
          {readOnly ? null : (
            <button type="button" className="add-item-btn" onClick={openAddModal}>+ إضافة صنف جديد</button>
          )}
        </div>
      </div>
      <p className="inventory-hint no-print">أول المدة هي كمية بداية الشهر، والمستهلك والمُتبقي يتحدثان تلقائياً عند سحب وجبات النزلاء.</p>
      <div className="no-print">
        <BackButton onClick={onBack} label="← رجوع للقائمة الرئيسية" />
      </div>
      <div className="search-field no-print">
        <label htmlFor="inventory-search">بحث باسم الصنف</label>
        <input
          id="inventory-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اكتب اسم الصنف..."
        />
      </div>

      <div id="inventoryPrintArea" className="data-table-wrap">
        <table className="data-table inventory-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th className="inv-col-lg inv-name-col">اسم الصنف</th>
              <th>الوحدة</th>
              <th className="inv-col-lg inv-num-col">أول المدة</th>
              <th className="inv-col-lg inv-num-col">المستهلك</th>
              <th className="inv-col-lg inv-num-col">المتبقي</th>
              <th className="inv-col-lg inv-num-col">السعر</th>
              <th>الإجمالي</th>
              {readOnly ? null : <th className="no-print">إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 8 : 9} className="empty-row">{items.length === 0 ? 'لا توجد أصناف' : 'لا توجد أصناف مطابقة للبحث'}</td>
              </tr>
            ) : visibleItems.map(({ item, index }) => {
              const remaining = numericValue(item.qty)
              const opening = numericValue(item.openingQty ?? item.qty)
              const used = consumedQty({ ...item, openingQty: opening, qty: remaining })
              const itemTotal = numericValue(item.total ?? remaining * numericValue(item.price))
              const low = remaining <= 0 || (opening > 0 && remaining / opening <= 0.15)
              return (
                <tr key={`${item.name}-${index}`} className={low ? 'low-stock-row' : ''}>
                  <td>
                    <ArabicDate
                      editable={!readOnly}
                      disabled={readOnly}
                      value={item.date}
                      onChange={(date) => updateField(index, 'date', date)}
                    />
                  </td>
                  <td className="inv-col-lg inv-name-cell">
                    <label className="inv-name-wrap">
                      <span className="inv-name-sizer">{item.name || ' '}</span>
                      <textarea
                        className="inv-input inv-name-input"
                        rows={1}
                        value={item.name}
                        disabled={readOnly}
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                      />
                    </label>
                  </td>
                  <td>
                    {readOnly ? (
                      displayUnit(item.unit)
                    ) : (
                      <select
                        className="inv-input"
                        aria-label="الوحدة"
                        value={displayUnit(item.unit)}
                        onChange={(e) => updateField(index, 'unit', e.target.value)}
                      >
                        <option value="">الوحدة</option>
                        {unitOptions(items.map((row) => row.unit), item.unit).map((unit) => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="inv-col-lg inv-num-col">
                    <ArabicNumberInput
                      className="inv-input"
                      value={item.openingQty ?? item.qty}
                      disabled={readOnly}
                      onChange={(value) => updateField(index, 'openingQty', value)}
                    />
                  </td>
                  <td className={`inv-col-lg inv-num-col ${used > 0 ? 'accent-text' : ''}`}>
                    {toArabicDigits(roundQty(used))}
                  </td>
                  <td className="inv-col-lg inv-num-col">
                    <ArabicNumberInput
                      className={`inv-input ${low ? 'low-stock-input' : ''}`}
                      value={item.qty}
                      disabled={readOnly}
                      onChange={(value) => updateField(index, 'qty', value)}
                    />
                  </td>
                  <td className="inv-col-lg inv-num-col">
                    <ArabicNumberInput
                      className="inv-input"
                      value={item.price}
                      disabled={readOnly}
                      onChange={(value) => updateField(index, 'price', value)}
                    />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {formatArabicNumber(itemTotal, 2)} ج
                  </td>
                  {readOnly ? null : (
                  <td className="no-print" style={{ textAlign: 'center' }}>
                    <button type="button" className="icon-only" onClick={() => deleteItem(index)}>🗑️</button>
                  </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={readOnly ? 6 : 7} style={{ textAlign: 'left' }}>إجمالي المخازن:</td>
              <td colSpan={2} className="danger-text inv-grand-total">
                {formatArabicNumber(Math.round(grandTotal), 0)} ج.م
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ direction: 'rtl', textAlign: 'right' }}>
          <h2 style={{ color: 'var(--primary)', borderBottom: '2px solid var(--accent)', paddingBottom: 10 }}>
            ➕ إضافة صنف جديد للمخزن
          </h2>
          <div className="modal-form-grid">
            <div className="span-2">
              <label>اسم الصنف:</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label>التاريخ:</label>
              <ArabicDate
                editable
                value={form.date}
                onChange={(date) => setForm((prev) => ({ ...prev, date }))}
              />
            </div>
            <div>
              <label>الوحدة:</label>
              <select
                aria-label="الوحدة"
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
              >
                <option value="">الوحدة</option>
                {unitOptions(items.map((item) => item.unit)).map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label>الكمية:</label>
              <ArabicNumberInput
                value={form.qty}
                onChange={(qty) => setForm((prev) => ({ ...prev, qty }))}
              />
            </div>
            <div>
              <label>سعر الوحدة:</label>
              <ArabicNumberInput
                value={form.price}
                onChange={(price) => setForm((prev) => ({ ...prev, price }))}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="save-btn" style={{ flex: 2 }} onClick={saveNewItem}>
              تأكيد الإضافة
            </button>
            <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function emptyForm() {
  return { name: '', date: todayArabicNumeric(), unit: '', qty: 1, price: 0 }
}
