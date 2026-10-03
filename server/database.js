import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import initSqlJs from 'sql.js'
import { defaultMeals } from '../src/data/meals.js'
import { defaultCafeteria } from '../src/data/cafeteria.js'
import { getDefaultInventory } from '../src/data/inventory.js'
import { ensureOpeningQty } from '../src/utils/stock.js'

let ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export let DB_DIR = path.join(ROOT, 'database')
export let DB_PATH = path.join(DB_DIR, 'fayed-resort.db')
export let ARCHIVE_DIR = path.join(DB_DIR, 'archive')
let YEAR_FILE = path.join(DB_DIR, 'year.json')
let WASM_PATH = path.join(ROOT, 'node_modules/sql.js/dist/sql-wasm.wasm')
const MAX_YEARS = 5

export function configureDataPaths({ root, dataDir, wasmPath } = {}) {
  if (root) ROOT = root
  DB_DIR = dataDir || path.join(ROOT, 'database')
  DB_PATH = path.join(DB_DIR, 'fayed-resort.db')
  ARCHIVE_DIR = path.join(DB_DIR, 'archive')
  YEAR_FILE = path.join(DB_DIR, 'year.json')
  WASM_PATH = wasmPath || path.join(ROOT, 'node_modules/sql.js/dist/sql-wasm.wasm')
}

let db
let SQL
let currentYear
let viewingYear
let liveMode = true

function calendarYear() {
  return new Date().getFullYear()
}

function readYearMeta() {
  if (fs.existsSync(YEAR_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(YEAR_FILE, 'utf8'))
      const year = Number(data.currentYear)
      if (year) return { currentYear: year }
    } catch {
      // ignore corrupt year file and recreate it
    }
  }
  return { currentYear: calendarYear() }
}

function writeYearMeta(meta) {
  fs.mkdirSync(DB_DIR, { recursive: true })
  fs.writeFileSync(YEAR_FILE, JSON.stringify({ currentYear: meta.currentYear }, null, 2))
}

function persistTo(filePath) {
  if (!db) return
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, Buffer.from(db.export()))
}

function persist() {
  if (!liveMode) return
  persistTo(DB_PATH)
}

function assertWritable() {
  if (!liveMode) {
    const err = new Error('عرض أرشيف للقراءة فقط. لا يمكن التعديل على سنة سابقة.')
    err.status = 403
    throw err
  }
}

function run(sql, params = []) {
  const stmt = db.prepare(sql)
  if (params.length) stmt.bind(params)
  stmt.step()
  stmt.free()
}

function all(sql, params = []) {
  const stmt = db.prepare(sql)
  if (params.length) stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      components TEXT,
      price REAL NOT NULL,
      ingredients TEXT
    );

    CREATE TABLE IF NOT EXISTS cafeteria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      components TEXT,
      price REAL NOT NULL,
      ingredients TEXT
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      name TEXT NOT NULL,
      unit TEXT,
      qty REAL,
      price REAL,
      total REAL,
      opening_qty REAL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL,
      day INTEGER NOT NULL,
      chalet_id INTEGER NOT NULL,
      name TEXT,
      u_type TEXT,
      rank TEXT,
      stay_price REAL,
      items TEXT,
      id_card_image TEXT,
      stock_deductions TEXT,
      UNIQUE(month, day, chalet_id)
    );
  `)
  addColumnIfMissing('meals', 'price_tiers', 'TEXT')
}

function addColumnIfMissing(table, column, type) {
  const cols = all(`PRAGMA table_info(${table})`)
  if (!cols.some((col) => col.name === column)) {
    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`)
  }
}

function ensureMealPriceTiers() {
  const rows = all('SELECT id, name, price, price_tiers FROM meals')
  for (const row of rows) {
    const existing = parseJson(row.price_tiers, null) || {}
    const def = defaultMeals.find((item) => item.name === row.name)
    const fallback = Number(row.price) || 0
    const defTiers = def?.priceTiers || {}
    const civilian = Number(defTiers.civilian) || Number(existing.civilian) || fallback
    const armedForces = Number(defTiers.armedForces) || Number(existing.armedForces) || civilian
    const clean = {
      airForce: Number(defTiers.airForce) || Number(existing.airForce) || fallback,
      nonMember: armedForces,
      armedForces,
      civilian,
    }
    const same = Number(existing.airForce) === clean.airForce
      && Number(existing.nonMember) === clean.nonMember
      && Number(existing.armedForces) === clean.armedForces
      && Number(existing.civilian) === clean.civilian
    if (same) continue
    run('UPDATE meals SET price_tiers = ? WHERE id = ?', [JSON.stringify(clean), row.id])
  }
}

function seedIfEmpty() {
  const userCount = all('SELECT COUNT(*) AS count FROM users')[0]?.count || 0
  if (userCount > 0) return

  run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', 'fayed'])

  for (const item of defaultMeals) {
    run(
      'INSERT INTO meals (name, components, price, ingredients, price_tiers) VALUES (?, ?, ?, ?, ?)',
      [item.name, item.components || '', item.price, JSON.stringify(item.ingredients || []), JSON.stringify(item.priceTiers || {})],
    )
  }

  for (const item of defaultCafeteria) {
    run(
      'INSERT INTO cafeteria (name, components, price, ingredients) VALUES (?, ?, ?, ?)',
      [item.name, item.components || '', item.price, JSON.stringify(item.ingredients || [])],
    )
  }

  for (const item of ensureOpeningQty(getDefaultInventory())) {
    run(
      'INSERT INTO inventory (date, name, unit, qty, price, total, opening_qty) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.date, item.name, item.unit, item.qty, item.price, item.total, item.openingQty ?? item.qty],
    )
  }
}

function loadDatabaseFromFile(filePath, { live }) {
  if (db) {
    try { db.close() } catch { /* already closed */ }
  }
  if (fs.existsSync(filePath)) {
    db = new SQL.Database(fs.readFileSync(filePath))
  } else {
    db = new SQL.Database()
  }
  createTables()
  if (live) {
    seedIfEmpty()
  }
  ensureMealPriceTiers()
  if (live) persistTo(DB_PATH)
}

function listArchiveYears() {
  if (!fs.existsSync(ARCHIVE_DIR)) return []
  return fs.readdirSync(ARCHIVE_DIR)
    .map((name) => {
      const match = name.match(/^(\d{4})\.db$/)
      return match ? Number(match[1]) : null
    })
    .filter(Boolean)
}

function listAvailableYears() {
  const minYear = currentYear - (MAX_YEARS - 1)
  const years = new Set([currentYear, ...listArchiveYears()])
  return [...years]
    .filter((year) => year >= minYear && year <= currentYear)
    .sort((a, b) => b - a)
}

function pruneArchives() {
  const minYear = currentYear - (MAX_YEARS - 1)
  for (const year of listArchiveYears()) {
    if (year < minYear) {
      fs.unlinkSync(path.join(ARCHIVE_DIR, `${year}.db`))
    }
  }
}

function performRollover() {
  const oldYear = currentYear
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true })
  persistTo(DB_PATH)
  const archivePath = path.join(ARCHIVE_DIR, `${oldYear}.db`)
  if (!fs.existsSync(archivePath)) {
    fs.copyFileSync(DB_PATH, archivePath)
  }

  run('DELETE FROM bookings')
  const items = all('SELECT * FROM inventory')
  for (const item of items) {
    const qty = Number(item.qty) || 0
    const price = Number(item.price) || 0
    run(
      'UPDATE inventory SET qty = ?, opening_qty = ?, total = ?, date = ? WHERE id = ?',
      [qty, qty, qty * price, `1/1/${oldYear + 1}`, item.id],
    )
  }

  currentYear = oldYear + 1
  viewingYear = currentYear
  liveMode = true
  writeYearMeta({ currentYear })
  persist()
  pruneArchives()
  console.log(`[db] Rolled over ${oldYear} → ${currentYear}. Archive saved to archive/${oldYear}.db`)
}

function maybeRollover() {
  if (!db) return
  const cal = calendarYear()
  if (currentYear >= cal) return

  const resumeArchiveYear = liveMode ? null : viewingYear
  if (!liveMode) {
    loadDatabaseFromFile(DB_PATH, { live: true })
    liveMode = true
    viewingYear = currentYear
  }

  while (currentYear < calendarYear()) {
    performRollover()
  }

  if (resumeArchiveYear && resumeArchiveYear !== currentYear) {
    const archivePath = path.join(ARCHIVE_DIR, `${resumeArchiveYear}.db`)
    if (fs.existsSync(archivePath)) {
      loadDatabaseFromFile(archivePath, { live: false })
      liveMode = false
      viewingYear = resumeArchiveYear
    }
  }
}

function yearState() {
  return {
    currentYear,
    viewingYear,
    live: liveMode,
    readOnly: !liveMode,
    years: listAvailableYears(),
    maxYears: MAX_YEARS,
  }
}

export async function getDb() {
  if (db) {
    maybeRollover()
    return db
  }

  SQL = await initSqlJs({
    locateFile: () => WASM_PATH,
  })

  fs.mkdirSync(DB_DIR, { recursive: true })
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true })

  const meta = readYearMeta()
  currentYear = meta.currentYear
  viewingYear = currentYear
  liveMode = true
  writeYearMeta({ currentYear })
  loadDatabaseFromFile(DB_PATH, { live: true })
  maybeRollover()
  return db
}

export function isReadOnly() {
  return !liveMode
}

export function getYearState() {
  maybeRollover()
  return yearState()
}

export function selectYear(year) {
  maybeRollover()
  const y = Number(year)
  const available = listAvailableYears()
  if (!available.includes(y)) {
    const err = new Error('هذه السنة غير متاحة. يمكن عرض السنة الحالية وحتى 5 سنوات سابقة فقط.')
    err.status = 404
    throw err
  }

  if (y === currentYear) {
    if (!liveMode) {
      loadDatabaseFromFile(DB_PATH, { live: true })
    }
    liveMode = true
    viewingYear = currentYear
    return yearState()
  }

  const archivePath = path.join(ARCHIVE_DIR, `${y}.db`)
  if (!fs.existsSync(archivePath)) {
    const err = new Error('ملف أرشيف هذه السنة غير موجود.')
    err.status = 404
    throw err
  }

  if (liveMode) persist()
  loadDatabaseFromFile(archivePath, { live: false })
  liveMode = false
  viewingYear = y
  return yearState()
}

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function mapMenuRow(row) {
  let priceTiers = parseJson(row.price_tiers, null)
  if (!priceTiers && row.name) {
    const def = defaultMeals.find((item) => item.name === row.name)
    priceTiers = def?.priceTiers || null
  }
  return {
    id: row.id,
    name: row.name,
    components: row.components || '',
    price: row.price,
    priceTiers,
    ingredients: parseJson(row.ingredients, []),
  }
}

function mapInventoryRow(row) {
  return {
    id: row.id,
    date: row.date,
    name: row.name,
    unit: row.unit,
    qty: row.qty,
    price: row.price,
    total: row.total,
    openingQty: row.opening_qty ?? row.qty,
  }
}

function mapBookingRow(row) {
  return {
    id: row.id,
    month: row.month,
    day: row.day,
    chaletId: row.chalet_id,
    name: row.name,
    uType: row.u_type,
    rank: row.rank || '',
    stayPrice: row.stay_price || 0,
    items: parseJson(row.items, []),
    idCardImage: row.id_card_image || '',
    stockDeductions: parseJson(row.stock_deductions, []),
    key: `book_${row.month}_${row.day}_${row.chalet_id}`,
  }
}

export function getMeals() {
  return all('SELECT * FROM meals ORDER BY id').map(mapMenuRow)
}

export function getCafeteria() {
  return all('SELECT * FROM cafeteria ORDER BY id').map(mapMenuRow)
}

export function getInventory() {
  return all('SELECT * FROM inventory ORDER BY id').map(mapInventoryRow)
}

export function getBookings() {
  return all('SELECT * FROM bookings ORDER BY id').map(mapBookingRow)
}

export function getBooking(month, day, chaletId) {
  const rows = all(
    'SELECT * FROM bookings WHERE month = ? AND day = ? AND chalet_id = ?',
    [month, Number(day), Number(chaletId)],
  )
  return rows[0] ? mapBookingRow(rows[0]) : null
}

export function replaceMeals(items) {
  assertWritable()
  run('DELETE FROM meals')
  for (const item of items || []) {
    run(
      'INSERT INTO meals (name, components, price, ingredients, price_tiers) VALUES (?, ?, ?, ?, ?)',
      [
        item.name,
        item.components || '',
        item.price,
        JSON.stringify(item.ingredients || []),
        JSON.stringify(item.priceTiers || {}),
      ],
    )
  }
  persist()
  return getMeals()
}

export function replaceCafeteria(items) {
  assertWritable()
  run('DELETE FROM cafeteria')
  for (const item of items || []) {
    run(
      'INSERT INTO cafeteria (name, components, price, ingredients) VALUES (?, ?, ?, ?)',
      [item.name, item.components || '', item.price, JSON.stringify(item.ingredients || [])],
    )
  }
  persist()
  return getCafeteria()
}

export function replaceInventory(items) {
  assertWritable()
  run('DELETE FROM inventory')
  for (const item of items || []) {
    const qty = Number(item.qty) || 0
    const price = Number(item.price) || 0
    run(
      'INSERT INTO inventory (date, name, unit, qty, price, total, opening_qty) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        item.date || '',
        item.name,
        item.unit || '',
        qty,
        price,
        item.total ?? qty * price,
        item.openingQty ?? qty,
      ],
    )
  }
  persist()
  return getInventory()
}

export function upsertBooking(month, day, chaletId, data) {
  assertWritable()
  const existing = getBooking(month, day, chaletId)
  const values = [
    data.name || '',
    data.uType || 'civilian',
    data.rank || '',
    Number(data.stayPrice) || 0,
    JSON.stringify(data.items || []),
    data.idCardImage || '',
    JSON.stringify(data.stockDeductions || []),
    month,
    Number(day),
    Number(chaletId),
  ]

  if (existing) {
    run(
      `UPDATE bookings SET
        name = ?, u_type = ?, rank = ?, stay_price = ?, items = ?, id_card_image = ?, stock_deductions = ?
       WHERE month = ? AND day = ? AND chalet_id = ?`,
      values,
    )
  } else {
    run(
      `INSERT INTO bookings (name, u_type, rank, stay_price, items, id_card_image, stock_deductions, month, day, chalet_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values,
    )
  }
  persist()
  return getBooking(month, day, chaletId)
}

export function deleteBooking(month, day, chaletId) {
  assertWritable()
  run(
    'DELETE FROM bookings WHERE month = ? AND day = ? AND chalet_id = ?',
    [month, Number(day), Number(chaletId)],
  )
  persist()
}

export function loginUser(username, password) {
  const rows = all(
    'SELECT id, username FROM users WHERE username = ? AND password = ?',
    [username, password],
  )
  return rows[0] || null
}
