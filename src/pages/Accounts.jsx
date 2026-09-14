import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { monthMap } from '../data/chalets.js'
import { exportAccountsToWord } from '../utils/exportDoc.js'

function loadBookings() {
  const bookings = []
  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith('book_')) return
    try {
      const data = JSON.parse(localStorage.getItem(key))
      const [, monthPart, day, chaletId] = key.split('_')
      const monthNumeric = monthMap[monthPart] || monthPart
      const itemsTotal = data.items ? data.items.reduce((s, i) => s + i.total, 0) : 0
      const grandTotal = (data.stayPrice || 0) + itemsTotal
      bookings.push({
        key,
        date: `${day}/${monthNumeric}`,
        chaletId,
        name: data.name || 'غير مسجل',
        stayPrice: data.stayPrice || 0,
        items: data.items || [],
        total: grandTotal,
      })
    } catch {
      // skip corrupted records
    }
  })
  return bookings
}

export default function Accounts({ onBack, refreshKey }) {
  const [version, setVersion] = useState(0)
  const bookings = useMemo(() => loadBookings(), [refreshKey, version])
  const totalAllBookings = bookings.reduce((sum, b) => sum + b.total, 0)

  const exportWord = () => {
    const area = document.getElementById('exportArea')
    if (area) exportAccountsToWord(area.innerHTML)
  }

  const deleteBooking = (key) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز نهائياً؟')) return
    localStorage.removeItem(key)
    alert('تم حذف الحجز بنجاح')
    setVersion((v) => v + 1)
  }

  return (
    <>
      <div className="no-print" style={{ marginBottom: 15 }}>
        <BackButton onClick={onBack} label="← رجوع للقائمة الرئيسية" />
      </div>

      <div className="section-toolbar">
        <h2>تقرير حسابات - فايد ريزورت</h2>
        <div className="toolbar-actions no-print">
          <button type="button" className="btn-print" onClick={() => window.print()}>🖨️ طباعة</button>
          <button type="button" className="btn-word" onClick={exportWord}>📄 Word</button>
        </div>
        <div className="total-badge">
          <strong>الإجمالي: </strong>
          <span>{totalAllBookings.toLocaleString()} ج.م</span>
        </div>
      </div>

      <div id="exportArea" className="data-table-wrap">
        <table className="data-table" id="accountsTable">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الشاليه</th>
              <th>الاسم</th>
              <th>الإقامة</th>
              <th>الطلبات</th>
              <th>الإجمالي</th>
              <th className="no-print" style={{ textAlign: 'center' }}>حذف</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">لا توجد بيانات</td>
              </tr>
            ) : (
              bookings.map((b) => {
                const itemsList = b.items.length > 0 ? b.items.map((i) => i.name).join(' - ') : '---'
                return (
                  <tr key={b.key}>
                    <td style={{ fontWeight: 'bold' }}>{b.date}</td>
                    <td style={{ textAlign: 'center' }}>{b.chaletId}</td>
                    <td>{b.name}</td>
                    <td>{b.stayPrice} ج</td>
                    <td style={{ fontSize: '0.85rem' }}>{itemsList}</td>
                    <td className="accent-text">{b.total} ج</td>
                    <td className="no-print" style={{ textAlign: 'center' }}>
                      <button type="button" className="icon-only" onClick={() => deleteBooking(b.key)}>🗑️</button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} style={{ textAlign: 'left' }}>الإجمالي الكلي:</td>
              <td colSpan={2} className="danger-text">{totalAllBookings.toLocaleString()} ج.م</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
