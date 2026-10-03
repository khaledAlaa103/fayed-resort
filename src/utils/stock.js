import { toArabicDigits } from './numbers.js'

export function roundQty(value) {
  return Math.round((Number(value) || 0) * 1000) / 1000
}

export function formatIngredientsText(ingredients) {
  if (!ingredients?.length) return ''
  return ingredients
    .map((item) => {
      const qty = roundQty(item.qty)
      const unit = item.unit ? ` ${item.unit}` : ''
      return `${toArabicDigits(qty)}${unit} ${item.inventoryName}`
    })
    .join('، ')
}

export function uniqueInventoryNames(inventory) {
  const seen = new Set()
  return inventory.filter((item) => {
    if (!item.name || seen.has(item.name)) return false
    seen.add(item.name)
    return true
  })
}

export function buildDeductions(orderItems, meals, cafeteria) {
  const totals = {}

  for (const order of orderItems || []) {
    const catalog = order.source === 'cafeteria' ? cafeteria : meals
    const menuItem = catalog.find((item) => item.name === order.name)
    const recipe = order.ingredients?.length
      ? order.ingredients
      : (menuItem?.ingredients || [])
    const portions = Number(order.qty) || 1

    for (const ingredient of recipe) {
      const name = ingredient.inventoryName
      if (!name) continue
      totals[name] = roundQty((totals[name] || 0) + (Number(ingredient.qty) || 0) * portions)
    }
  }

  return Object.entries(totals).map(([inventoryName, qty]) => ({ inventoryName, qty }))
}

export function applyStockChange(inventory, deductions, direction) {
  const next = inventory.map((item) => ({ ...item }))
  const missing = []
  const shortfalls = []

  for (const deduction of deductions || []) {
    const item = next.find((row) => row.name === deduction.inventoryName)
    if (!item) {
      missing.push(deduction.inventoryName)
      continue
    }

    const delta = roundQty(deduction.qty * direction)
    const previousQty = Number(item.qty) || 0
    const newQty = roundQty(previousQty + delta)

    if (direction < 0 && newQty < 0) {
      shortfalls.push({
        name: item.name,
        needed: deduction.qty,
        available: previousQty,
      })
    }

    item.qty = newQty
    item.total = roundQty(item.qty * (Number(item.price) || 0))
  }

  return { inventory: next, missing, shortfalls }
}

export function ensureOpeningQty(items) {
  return items.map((item) => ({
    ...item,
    openingQty: item.openingQty ?? item.qty,
  }))
}

export function consumedQty(item) {
  return roundQty((Number(item.openingQty) || 0) - (Number(item.qty) || 0))
}
