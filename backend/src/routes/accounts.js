import express from 'express'
import pool from '../config/db.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// ✅ Get all accounts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, username, role FROM accounts ORDER BY user_id ASC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching accounts:', err)
    res.status(500).json({ message: 'Error fetching accounts', error: err.message })
  }
})

// ✅ Get single account by user_id
router.get('/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, username, role FROM accounts WHERE user_id = ?',
      [req.params.userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Account not found' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('Error fetching account:', err)
    res.status(500).json({ message: 'Error fetching account', error: err.message })
  }
})

// ✅ Create new account
router.post('/', async (req, res) => {
  const { username, password, role } = req.body

  console.log('📝 Creating account:', { username, role })

  // Validation
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' })
  }

  if (!['Admin', 'Staff'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be Admin or Staff' })
  }

  try {
    // Check if username already exists
    const [usernameCheck] = await pool.query(
      'SELECT username FROM accounts WHERE username = ?',
      [username]
    )

    if (usernameCheck.length > 0) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert account (user_id will be auto-generated)
    const [result] = await pool.query(
      'INSERT INTO accounts (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    )

    console.log('✅ Account created successfully:', result.insertId)

    res.status(201).json({
      message: 'Account created successfully',
      user_id: result.insertId,
      username: username,
      role: role
    })
  } catch (err) {
    console.error('❌ Error creating account:', err.message)
    console.error('Error details:', err)
    res.status(500).json({ message: 'Error creating account', error: err.message })
  }
})

// ✅ Update account (username, password, role)
router.put('/:userId', async (req, res) => {
  const { username, password, role } = req.body
  const userId = req.params.userId

  if (!username && !password && !role) {
    return res.status(400).json({ message: 'At least one field must be provided' })
  }

  if (role && !['Admin', 'Staff'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be Admin or Staff' })
  }

  try {
    // Check if account exists
    const [accountCheck] = await pool.query(
      'SELECT * FROM accounts WHERE user_id = ?',
      [userId]
    )

    if (accountCheck.length === 0) {
      return res.status(404).json({ message: 'Account not found' })
    }

    let updateQuery = 'UPDATE accounts SET '
    let updateValues = []
    const updates = []

    if (username) {
      // Check if new username already exists
      const [usernameCheck] = await pool.query(
        'SELECT username FROM accounts WHERE username = ? AND user_id != ?',
        [username, userId]
      )

      if (usernameCheck.length > 0) {
        return res.status(400).json({ message: 'Username already exists' })
      }

      updates.push('username = ?')
      updateValues.push(username)
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updates.push('password = ?')
      updateValues.push(hashedPassword)
    }

    if (role) {
      updates.push('role = ?')
      updateValues.push(role)
    }

    updateQuery += updates.join(', ') + ' WHERE user_id = ?'
    updateValues.push(userId)

    await pool.query(updateQuery, updateValues)

    res.json({
      message: 'Account updated successfully',
      user_id: userId,
      ...(username && { username }),
      ...(role && { role })
    })
  } catch (err) {
    console.error('Error updating account:', err)
    res.status(500).json({ message: 'Error updating account', error: err.message })
  }
})

// ✅ Delete account
router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    // Check if account exists
    const [accountCheck] = await pool.query(
      'SELECT * FROM accounts WHERE user_id = ?',
      [userId]
    )

    if (accountCheck.length === 0) {
      return res.status(404).json({ message: 'Account not found' })
    }

    // Delete account
    await pool.query('DELETE FROM accounts WHERE user_id = ?', [userId])

    res.json({ message: 'Account deleted successfully', user_id: userId })
  } catch (err) {
    console.error('Error deleting account:', err)
    res.status(500).json({ message: 'Error deleting account', error: err.message })
  }
})

export default router
