/* eslint-disable @typescript-eslint/no-require-imports -- cPanel entry point is intentionally CommonJS */
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = '127.0.0.1'
const port = Number(process.env.PORT || 3000)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (error) {
      console.error('Request handling error:', error)
      res.statusCode = 500
      res.end('Internal server error')
    }
  }).listen(port, hostname, () => {
    console.log(`BoldTrip ready on http://${hostname}:${port}`)
  })
})
