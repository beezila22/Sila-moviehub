// server/server.js
const express = require('express')
const path = require('path')
const fs = require('fs').promises
const bodyParser = require('body-parser')
const cors = require('cors')
const { nanoid } = require('nanoid')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const DB_PATH = path.join(__dirname, 'db.json')

// Helper: read/write DB (simple)
async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // file not found -> init
      return { movies: [] }
    }
    throw err
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}

// ensure db exists
(async () => {
  try {
    await fs.access(DB_PATH)
  } catch {
    await writeDB({ movies: [] })
  }
})()

const ADMIN_KEY = process.env.ADMIN_KEY || 'change_me'
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-key']
  if (!token || token !== ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })
  next()
}

// Public routes
app.get('/api/movies', async (req, res) => {
  const db = await readDB()
  const q = (req.query.q || '').toLowerCase()
  const filtered = db.movies.filter(m => (!q || m.title.toLowerCase().includes(q)))
  res.json(filtered)
})

app.get('/api/movies/:id', async (req, res) => {
  const db = await readDB()
  const m = db.movies.find(x => x.id === req.params.id)
  if (!m) return res.status(404).json({ error: 'not found' })
  res.json(m)
})

// Admin routes
app.post('/api/admin/movies', requireAdmin, async (req, res) => {
  const payload = req.body
  const db = await readDB()
  const movie = { id: nanoid(8), ...payload, createdAt: new Date().toISOString() }
  db.movies.unshift(movie)
  await writeDB(db)
  res.json(movie)
})

app.put('/api/admin/movies/:id', requireAdmin, async (req, res) => {
  const db = await readDB()
  const idx = db.movies.findIndex(m => m.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  db.movies[idx] = { ...db.movies[idx], ...req.body }
  await writeDB(db)
  res.json(db.movies[idx])
})

app.delete('/api/admin/movies/:id', requireAdmin, async (req, res) => {
  const db = await readDB()
  db.movies = db.movies.filter(m => m.id !== req.params.id)
  await writeDB(db)
  res.json({ ok: true })
})

// Serve static client build if present
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('Server running on', PORT))
