import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import Modal from '../components/Modal.jsx'
import { exportInventoryToWord, formatMoney } from '../utils/exportDoc.js'

export default function Inventory({ items, onChange, onBack }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + ((item.qty * item.price) || 0), 0),
    [items],
  )

  const updateField = (index, field, value) => {
    onChange((prev) => {
      const next = prev.map((item, i) => {
        if (i !== index) return item
        const updated = {
          ...item,
          [field]: field === 'qty' || field === 'price' ? (parseFloat(value) || 0) : value,
        }
        updated.total = (updated.qty * updated.price) || 0
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
      { date: form.date, name: form.name, unit: form.unit, qty, price, total: qty * price },
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
          <button type="button" className="add-item-btn" onClick={openAddModal}>+ إضافة صنف جديد</button>
        </div>
      </div>
      <div className="no-print">
        <BackButton onClick={onBack} label="← رجوع للقائمة الرئيسية" />
      </div>

      <div id="inventoryPrintArea" className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>اسم الصنف</th>
              <th>الوحدة</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
              <th className="no-print">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const itemTotal = (item.qty * item.price) || 0
              return (
                <tr key={`${item.name}-${index}`}>
                  <td>
                    <input
                      className="inv-input"
                      style={{ width: 90 }}
                      value={item.date}
                      onChange={(e) => updateField(index, 'date', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="inv-input"
                      style={{ width: '95%', textAlign: 'right' }}
                      value={item.name}
                      onChange={(e) => updateField(index, 'name', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.unit}</td>
                  <td>
                    <input
                      className="inv-input"
                      style={{ width: 70 }}
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateField(index, 'qty', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="inv-input"
                      style={{ width: 80 }}
                      type="number"
                      value={item.price}
                      onChange={(e) => updateField(index, 'price', e.target.value)}
                    />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {formatMoney(itemTotal, 2)} ج
                  </td>
                  <td className="no-print" style={{ textAlign: 'center' }}>
                    <button type="button" className="icon-only" onClick={() => deleteItem(index)}>🗑️</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} style={{ textAlign: 'left' }}>إجمالي قيمة المخزن الكلية:</td>
              <td colSpan={2} className="danger-text">
                {formatMoney(grandTotal, 2)} ج.م
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
              <input
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label>الوحدة:</label>
              <input
                placeholder="كجم، كيس..."
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
              />
            </div>
            <div>
              <label>الكمية:</label>
              <input
                type="number"
                value={form.qty}
                onChange={(e) => setForm((prev) => ({ ...prev, qty: e.target.value }))}
              />
            </div>
            <div>
              <label>سعر الوحدة:</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
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
  const todayArabic = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  return { name: '', date: todayArabic, unit: '', qty: 1, price: 0 }
}
