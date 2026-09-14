import { useState } from 'react'
import { loadJson, saveJson } from '../utils/storage.js'

export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const fallback = typeof defaultValue === 'function' ? defaultValue() : defaultValue
    return loadJson(key, fallback)
  })

  const setPersisted = (updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveJson(key, next)
      return next
    })
  }

  return [state, setPersisted]
}
