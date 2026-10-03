import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { exportAccountsToWord } from '../utils/exportDoc.js'
import { formatArabicNumber, toArabicDigits } from '../utils/numbers.js'
import ArabicDate from '../components/ArabicDate.jsx'
import { matchesSearch } from '../utils/search.js'

function formatOrders(items, pred) {
  const list = (items || []).filter(pred)
  if (!list.length) return '---'
  return list.map((item) => `${item.name} (x${toArabicDigits(item.qty || 1)})`).join(' - ')
}

export default function Accounts({
  onBack,
  bookings: bookingRecords = [],
  meals = [],
  cafeteria = [],
  year,
  readOnly = false,
  onDeleteBooking,
}) {
  const mealNames = useMemo(() => new Set(meals.map((item) => item.name)), [meals])
  const cafeteriaNames = useMemo(() => new Set(cafeteria.map((item) => item.name)), [cafeteria])

  const [query, setQuery] = useState('')

  const bookings = useMemo(() => bookingRecords.map((data) => {
    const items = data.items || []
    const itemsTotal = items.reduce((s, i) => s + i.total, 0)
    const grandTotal = (data.stayPrice || 0) + itemsTotal
    return {
      ...data,
      stayPrice: data.stayPrice || 0,
      items,
      restaurantOrders: formatOrders(items, (item) => (
        item.source === 'restaurant' || (!item.source && mealNames.has(item.name))
      )),
      cafeteriaOrders: formatOrders(items, (item) => (
        item.source === 'cafeteria' || (!item.source && cafeteriaNames.has(item.name))
      )),
      total: grandTotal,
    }
  }), [bookingRecords, mealNames, cafeteriaNames])

  const visibleBookings = useMemo(() => bookings.filter((booking) => (
    matchesSearch(booking.name, query) || matchesSearch(booking.chaletId, query)
  )), [bookings, query])

  const totalAllBookings = bookings.reduce((sum, b) => sum + b.total, 0)
  const visibleTotal = visibleBookings.reduce((sum, b) => sum + b.total, 0)

  const exportWord = () => {
    const area = document.getElementById('exportArea')
    if (area) exportAccountsToWord(area.innerHTML)
  }

  const deleteBooking = async (booking) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز نهائياً؟')) return
    await onDeleteBooking(booking)
    alert('تم حذف الحجز وإرجاع الكميات إلى المخزن')
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
          <span>{formatArabicNumber(query.trim() ? visibleTotal : totalAllBookings)} ج.م</span>
        </div>
      </div>
      <div className="search-field no-print">
        <label htmlFor="accounts-search">بحث بالاسم أو الشاليه</label>
        <input
          id="accounts-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اكتب الاسم أو رقم الشاليه..."
        />
      </div>

      <div id="exportArea" className="data-table-wrap">
        <table className="data-table" id="accountsTable">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الشاليه</th>
              <th>الاسم</th>
              <th>الإقامة</th>
              <th>المطعم</th>
              <th>الكافتيريا</th>
              <th>الإجمالي</th>
              {readOnly ? null : (
              <th className="no-print" style={{ textAlign: 'center' }}>حذف</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleBookings.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 7 : 8} className="empty-row">{bookings.length === 0 ? 'لا توجد بيانات' : 'لا توجد نتائج مطابقة للبحث'}</td>
              </tr>
            ) : (
              visibleBookings.map((b) => (
                <tr key={b.key}>
                  <td><ArabicDate day={b.day} month={b.month} year={b.year || year} /></td>
                  <td style={{ textAlign: 'center' }}>{toArabicDigits(b.chaletId)}</td>
                  <td>{b.name}</td>
                  <td>{formatArabicNumber(b.stayPrice)} ج</td>
                  <td>{b.restaurantOrders}</td>
                  <td>{b.cafeteriaOrders}</td>
                  <td className="accent-text">{formatArabicNumber(b.total)} ج</td>
                  {readOnly ? null : (
                  <td className="no-print" style={{ textAlign: 'center' }}>
                    <button type="button" className="icon-only" onClick={() => deleteBooking(b)}>🗑️</button>
                  </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={readOnly ? 5 : 6} style={{ textAlign: 'left' }}>الإجمالي الكلي:</td>
              <td colSpan={2} className="danger-text">{formatArabicNumber(query.trim() ? visibleTotal : totalAllBookings)} ج.م</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
