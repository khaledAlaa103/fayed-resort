import {
  deleteBooking,
  getBooking,
  getBookings,
  getCafeteria,
  getInventory,
  getMeals,
  getYearState,
  isReadOnly,
  loginUser,
  replaceCafeteria,
  replaceInventory,
  replaceMeals,
  selectYear,
  upsertBooking,
} from './database.js'

function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function pathnameOf(req) {
  const raw = req.url || '/'
  try {
    return decodeURIComponent(new URL(raw, 'http://127.0.0.1').pathname)
  } catch {
    return decodeURIComponent(raw.split('?')[0] || '/')
  }
}

function decodeParts(pathname) {
  return pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
}

export async function handleApiRequest(req, res) {
  const url = pathnameOf(req)
  if (!url.startsWith('/api')) return false

  const method = req.method || 'GET'
  const parts = decodeParts(url)

  if (method === 'GET' && url === '/api/health') {
    send(res, 200, { ok: true, file: 'database/fayed-resort.db', ...getYearState() })
    return true
  }

  if (method === 'GET' && url === '/api/years') {
    send(res, 200, getYearState())
    return true
  }

  if (method === 'POST' && url === '/api/years/select') {
    const body = await readBody(req)
    send(res, 200, selectYear(body.year))
    return true
  }

  if (method === 'POST' && url === '/api/login') {
    const body = await readBody(req)
    const user = loginUser(body.username, body.password)
    if (!user) {
      send(res, 401, { error: 'خطأ في البيانات!' })
      return true
    }
    send(res, 200, { ok: true, username: user.username })
    return true
  }

  if (url === '/api/meals') {
    if (method === 'GET') {
      send(res, 200, getMeals())
      return true
    }
    if (method === 'PUT') {
      if (isReadOnly()) {
        send(res, 403, { error: 'عرض أرشيف للقراءة فقط. لا يمكن التعديل على سنة سابقة.' })
        return true
      }
      send(res, 200, replaceMeals(await readBody(req)))
      return true
    }
  }

  if (url === '/api/cafeteria') {
    if (method === 'GET') {
      send(res, 200, getCafeteria())
      return true
    }
    if (method === 'PUT') {
      if (isReadOnly()) {
        send(res, 403, { error: 'عرض أرشيف للقراءة فقط. لا يمكن التعديل على سنة سابقة.' })
        return true
      }
      send(res, 200, replaceCafeteria(await readBody(req)))
      return true
    }
  }

  if (url === '/api/inventory') {
    if (method === 'GET') {
      send(res, 200, getInventory())
      return true
    }
    if (method === 'PUT') {
      if (isReadOnly()) {
        send(res, 403, { error: 'عرض أرشيف للقراءة فقط. لا يمكن التعديل على سنة سابقة.' })
        return true
      }
      send(res, 200, replaceInventory(await readBody(req)))
      return true
    }
  }

  if (method === 'GET' && url === '/api/bookings') {
    send(res, 200, getBookings())
    return true
  }

  if (parts[0] === 'api' && parts[1] === 'bookings' && parts.length === 5) {
    const [, , month, day, chaletId] = parts
    if (method === 'GET') {
      send(res, 200, getBooking(month, day, chaletId))
      return true
    }
    if (method === 'PUT' || method === 'DELETE') {
      if (isReadOnly()) {
        send(res, 403, { error: 'عرض أرشيف للقراءة فقط. لا يمكن التعديل على سنة سابقة.' })
        return true
      }
    }
    if (method === 'PUT') {
      send(res, 200, upsertBooking(month, day, chaletId, await readBody(req)))
      return true
    }
    if (method === 'DELETE') {
      deleteBooking(month, day, chaletId)
      send(res, 200, { ok: true })
      return true
    }
  }

  send(res, 404, { error: 'Not found' })
  return true
}
