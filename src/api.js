async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'تعذر الاتصال بقاعدة البيانات')
  }
  return data
}

export const api = {
  login: (username, password) => request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
  getMeals: () => request('/api/meals'),
  saveMeals: (items) => request('/api/meals', { method: 'PUT', body: JSON.stringify(items) }),
  getCafeteria: () => request('/api/cafeteria'),
  saveCafeteria: (items) => request('/api/cafeteria', { method: 'PUT', body: JSON.stringify(items) }),
  getInventory: () => request('/api/inventory'),
  saveInventory: (items) => request('/api/inventory', { method: 'PUT', body: JSON.stringify(items) }),
  getBooking: (month, day, chaletId) => request(
    `/api/bookings/${encodeURIComponent(month)}/${day}/${chaletId}`,
  ),
  getBookings: () => request('/api/bookings'),
  saveBooking: (month, day, chaletId, data) => request(
    `/api/bookings/${encodeURIComponent(month)}/${day}/${chaletId}`,
    { method: 'PUT', body: JSON.stringify(data) },
  ),
  deleteBooking: (month, day, chaletId) => request(
    `/api/bookings/${encodeURIComponent(month)}/${day}/${chaletId}`,
    { method: 'DELETE' },
  ),
  getYears: () => request('/api/years'),
  selectYear: (year) => request('/api/years/select', {
    method: 'POST',
    body: JSON.stringify({ year }),
  }),
}
