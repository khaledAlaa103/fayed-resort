import { handleApiRequest } from './api-handler.js'
import { getDb, getYearState } from './database.js'

export function fayedDbPlugin() {
  return {
    name: 'fayed-sqlite-db',
    async configureServer(server) {
      await getDb()
      const year = getYearState()
      console.log(`[db] SQLite ready: year ${year.currentYear} at database/fayed-resort.db`)
      if (year.years.length > 1) {
        console.log(`[db] Archives available: ${year.years.filter((y) => y !== year.currentYear).join(', ')}`)
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        if (!url.startsWith('/api')) return next()

        try {
          await getDb()
          const handled = await handleApiRequest(req, res)
          if (!handled) next()
        } catch (error) {
          console.error('[db]', error)
          if (!res.headersSent) {
            res.statusCode = error.status || 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: error.message || 'Database error' }))
          }
        }
      })
    },
  }
}
