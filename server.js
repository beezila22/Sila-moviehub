const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const { nanoid } = require('nanoid')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// lowdb file
const file = path.join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

async function initDB() {
  await db.read()
  db.data ||= { movies: [] }
  await db.write()
}
initDB()

const ADMIN_KEY = process.env.ADMIN_KEY || 'change_me'
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-key']
  if (!token || token !== ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })
  next()
}

// Public routes
app.get('/api/movies', async (req, res) => {
  await db.read()
  const q = (req.query.q || '').toLowerCase()
  const filtered = db.data.movies.filter(m => (!q || m.title.toLowerCase().includes(q)))
  res.json(filtered)
})

app.get('/api/movies/:id', async (req, res) => {
  await db.read()
  const m = db.data.movies.find(x => x.id === req.params.id)
  if (!m) return res.status(404).json({ error: 'not found' })
  res.json(m)
})

// Admin routes
app.post('/api/admin/movies', requireAdmin, async (req, res) => {
  await db.read()
  const payload = req.body
  const movie = { id: nanoid(8), ...payload, createdAt: new Date().toISOString() }
  db.data.movies.unshift(movie)
  await db.write()
  res.json(movie)
})

app.put('/api/admin/movies/:id', requireAdmin, async (req, res) => {
  await db.read()
  const idx = db.data.movies.findIndex(m => m.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  db.data.movies[idx] = { ...db.data.movies[idx], ...req.body }
  await db.write()
  res.json(db.data.movies[idx])
})

app.delete('/api/admin/movies/:id', requireAdmin, async (req, res) => {
  await db.read()
  db.data.movies = db.data.movies.filter(m => m.id !== req.params.id)
  await db.write()
  res.json({ ok: true })
})

// Serve static client build if present
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('Server running on', PORT))
