import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { pool, initDB } from './db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

await initDB()

/* =========================
   AUTH MIDDLEWARE
========================= */
function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Missing token' })
  }

  const token = header.split(' ')[1]

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

/* =========================
   AUTH ROUTES
========================= */

// SIGNUP
app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  const existing = await pool.query(
    'SELECT id FROM users WHERE email=$1',
    [email]
  )

  if (existing.rows.length) {
    return res.status(400).json({ error: 'User exists' })
  }

  const hash = await bcrypt.hash(password, 10)

  await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1,$2)',
    [email, hash]
  )

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  res.json({ token })
})

// LOGIN
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  const result = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  )

  if (!result.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = result.rows[0]
  const ok = await bcrypt.compare(password, user.password_hash)

  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  res.json({ token })
})

/* =========================
   POSTS ROUTES (CRUD)
========================= */

// GET ALL POSTS (Home page)
app.get('/posts', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, body, created_at, user_email FROM posts ORDER BY created_at DESC'
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load posts' })
  }
})

// ADD POST
app.post('/posts', auth, async (req, res) => {
  const { body } = req.body

  if (!body) {
    return res.status(400).json({ error: 'Body is required' })
  }

  await pool.query(
    'INSERT INTO posts (body, user_email) VALUES ($1,$2)',
    [body, req.user.email]
  )

  res.json({ success: true })
})

// GET SINGLE POST
app.get('/posts/:id', auth, async (req, res) => {
  const { id } = req.params

  const result = await pool.query(
    'SELECT id, body, created_at, user_email FROM posts WHERE id=$1',
    [id]
  )

  if (!result.rows.length) {
    return res.status(404).json({ error: 'Post not found' })
  }

  res.json(result.rows[0])
})

// UPDATE POST
app.put('/posts/:id', auth, async (req, res) => {
  const { id } = req.params
  const { body } = req.body

  if (!body) {
    return res.status(400).json({ error: 'Body is required' })
  }

  await pool.query(
    'UPDATE posts SET body=$1 WHERE id=$2',
    [body, id]
  )

  res.json({ success: true })
})

// DELETE SINGLE POST
app.delete('/posts/:id', auth, async (req, res) => {
  const { id } = req.params

  await pool.query(
    'DELETE FROM posts WHERE id=$1',
    [id]
  )

  res.json({ success: true })
})

// DELETE ALL POSTS
app.delete('/posts', auth, async (req, res) => {
  await pool.query('DELETE FROM posts')
  res.json({ success: true })
})

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})
