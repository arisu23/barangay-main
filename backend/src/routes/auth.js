import express from 'express'
import pool from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-env'

// ✅ Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  console.log('🔐 Login attempt:', username)

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  try {
    // Find user by username
    const [accounts] = await pool.query(
      'SELECT user_id, username, password, role FROM accounts WHERE username = ?',
      [username]
    )

    if (accounts.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const account = accounts[0]

    // Verify password
    const passwordMatch = await bcrypt.compare(password, account.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: account.user_id,
        username: account.username,
        role: account.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log('✅ Login successful:', username, 'Role:', account.role)

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        user_id: account.user_id,
        username: account.username,
        role: account.role
      }
    })
  } catch (err) {
    console.error('❌ Error during login:', err.message)
    res.status(500).json({ message: 'Error during login', error: err.message })
  }
})

// ✅ Get current user info (requires token)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = req.user
    res.json({
      user_id: user.user_id,
      username: user.username,
      role: user.role
    })
  } catch (err) {
    console.error('Error fetching user:', err)
    res.status(500).json({ message: 'Error fetching user', error: err.message })
  }
})

// ✅ Logout route (frontend handles clearing token)
router.post('/logout', (req, res) => {
  console.log('🚪 User logged out')
  res.json({ message: 'Logged out successfully' })
})

// ✅ Middleware to verify JWT token
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid token:', err.message)
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// ✅ Middleware to check if user is Admin
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export default router
