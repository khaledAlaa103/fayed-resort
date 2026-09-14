export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function bookingKey(month, day, id) {
  return `book_${month}_${day}_${id}`
}

export function loadBooking(month, day, id) {
  return loadJson(bookingKey(month, day, id), null)
}

export function saveBooking(month, day, id, data) {
  saveJson(bookingKey(month, day, id), data)
}

export function removeBooking(month, day, id) {
  localStorage.removeItem(bookingKey(month, day, id))
}

export function isChaletBooked(month, day, id) {
  return Boolean(localStorage.getItem(bookingKey(month, day, id)))
}
