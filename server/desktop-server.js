import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { handleApiRequest } from './api-handler.js'
import { getDb } from './database.js'

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function safeFile(staticDir, urlPath) {
  const decoded = decodeURIComponent((urlPath || '/').split('?')[0] || '/')
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '')
  const resolved = path.resolve(staticDir, relative)
  const root = path.resolve(staticDir)
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return null
  return resolved
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.statusCode = 200
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  fs.createReadStream(filePath).pipe(res)
}

function serveStatic(req, res, staticDir) {
  const urlPath = (req.url || '/').split('?')[0] || '/'
  const requested = safeFile(staticDir, urlPath)
  if (requested && fs.existsSync(requested) && fs.statSync(requested).isFile()) {
    sendFile(res, requested)
    return
  }
  const index = path.join(staticDir, 'index.html')
  if (fs.existsSync(index)) {
    sendFile(res, index)
    return
  }
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('Not found')
}

export function startDesktopServer({ staticDir, host = '127.0.0.1', port = 0 }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        await getDb()
        if (await handleApiRequest(req, res)) return
        serveStatic(req, res, staticDir)
      } catch (error) {
        console.error('[desktop]', error)
        if (!res.headersSent) {
          res.statusCode = error.status || 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: error.message || 'خطأ في التشغيل' }))
        }
      }
    })

    server.on('error', reject)
    server.listen(port, host, () => {
      const address = server.address()
      resolve({
        server,
        url: `http://${host}:${address.port}/`,
      })
    })
  })
}
