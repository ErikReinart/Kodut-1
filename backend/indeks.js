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

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  // check if user exists
  const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email])
  if (existing.rows.length) {
    return res.status(400).json({ error: 'User exists' })
  }

  // insert user
  const hash = await bcrypt.hash(password, 10)
  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1,$2)', [email, hash])

  // create JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET)
  res.json({ token })
})

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  if (!result.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = result.rows[0]
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET)
  res.json({ token })
})

app.listen(3000, () => console.log('Backend running on http://localhost:3000'))

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Missing token' })

  const token = header.split(' ')[1]

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

app.post('/posts', auth, async (req, res) => {
  const { body } = req.body

  if (!body) {
    return res.status(400).json({ error: 'Body is required' })
  }

  await pool.query(
    'INSERT INTO posts (body, user_email) VALUES ($1, $2)',
    [body, req.user.email]
  )

  res.json({ success: true })
})

// home page
app.get('/posts', auth, async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT p.body, p.created_at, p.user_email, u.email 
        FROM posts p
        JOIN users u on p.user_email = u.email
        ORDER BY p.created_at DESC
      `);
  
    // format posts to match frontend
    const posts = result.rows.map(post => ({
      id: post.id,
      owner: post.email,
      ownerProfilePicture: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      text: post.body,
      timeCreated: post.created_at,
      likeCount: 0,
      image: null
    }));

    res.json(posts); // Returning the array of posts
  } catch (err) {
    console.error('Failed to fetch posts: ' , err);
    res.status(500).json({ error: 'Internal server error'})
  }
});

//deleting all posts
app.delete('/posts', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts');

    const result = await pool.query(`
        SELECT p.body, p.created_at, p.user_email, u.email 
        FROM posts p
        JOIN users u on p.user_email = u.email
        ORDER BY p.created_at DESC
      `);

    // format posts to match frontend
    const posts = result.rows.map(post => ({
      id: post.id,
      owner: post.email,
      ownerProfilePicture: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      text: post.body,
      timeCreated: post.created_at,
      likeCount: 0,
      image: null
    }));

    res.json({ success: true, posts });
  } catch (err) {
    console.error('Failed to delete posts:', err);
    res.status(500).json({ error: 'Failed to delete posts' });
  }
});