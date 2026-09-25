// A minimal local stand-in for `vercel dev` that serves the serverless
// functions built into /api by `npm run build:api`. It exists so that the API
// can be run for local development and E2E tests without a Vercel account,
// login, or token.
//
// It emulates just the parts of the Vercel Node.js runtime helpers that the
// functions in /api-src use: `req.query`, a parsed `req.body`,
// `res.status()`, `res.json()`, and `res.send()`.
//
// Usage: node scripts/dev-api-server.mjs [--port=3001] [--host=0.0.0.0]

import fs from 'fs'
import http from 'http'
import path from 'path'
import querystring from 'querystring'
import { fileURLToPath, pathToFileURL } from 'url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apiDir = path.join(rootDir, 'api')

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter(arg => arg.startsWith('--'))
    .map(arg => arg.slice(2).split('='))
)

const port = Number(args.port ?? process.env.PORT ?? 3001)
const host = args.host ?? '0.0.0.0'

const readBody = req =>
  new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })

// Mirrors the body parsing behavior of the Vercel Node.js runtime.
const parseBody = (req, buffer) => {
  const contentType = (req.headers['content-type'] ?? 'text/plain')
    .split(';')[0]
    .trim()

  switch (contentType) {
    case 'application/json':
      return buffer.length ? JSON.parse(buffer.toString()) : {}
    case 'application/x-www-form-urlencoded':
      return querystring.parse(buffer.toString())
    case 'text/plain':
      return buffer.toString()
    default:
      return buffer
  }
}

const addResponseHelpers = res => {
  res.status = statusCode => {
    res.statusCode = statusCode
    return res
  }

  res.send = body => {
    if (body !== null && typeof body === 'object' && !Buffer.isBuffer(body)) {
      return res.json(body)
    }

    res.end(body)
    return res
  }

  res.json = body => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(body))
    return res
  }

  return res
}

const handlerCache = new Map()

const loadHandler = async name => {
  if (!handlerCache.has(name)) {
    handlerCache.set(
      name,
      import(pathToFileURL(path.join(apiDir, `${name}.mjs`))).then(
        mod => mod.default
      )
    )
  }

  return handlerCache.get(name)
}

const server = http.createServer(async (req, res) => {
  addResponseHelpers(res)

  try {
    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`)
    const match = url.pathname.match(/^\/api\/([\w-]+)\/?$/)
    const name = match?.[1]

    if (!name || !fs.existsSync(path.join(apiDir, `${name}.mjs`))) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    req.query = querystring.parse(url.searchParams.toString())

    try {
      req.body = parseBody(req, await readBody(req))
    } catch {
      res.status(400).json({ error: 'Invalid request body' })
      return
    }

    const handler = await loadHandler(name)
    await handler(req, res)
  } catch (error) {
    console.error(error)

    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    } else {
      res.end()
    }
  }
})

server.listen(port, host, () => {
  console.log(`Farmhand API listening on http://${host}:${port}`)
})
