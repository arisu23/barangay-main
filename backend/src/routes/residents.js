import express from 'express'
import pool from '../config/db.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// ✅ Ensure upload folder exists (inside uploads/residents)
const uploadDir = './uploads/residents'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir) // ✅ Now saves inside "uploads/residents"
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

// ❌ REMOVE this line — you already serve /uploads globally in index.js
// router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// ✅ Get all residents
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM residents')

    // ✅ Add full photo URL for frontend display
    const residentsWithPhoto = rows.map(r => ({
      ...r,
      photo: r.photo
        ? `${req.protocol}://${req.get('host')}${r.photo}`
        : null
    }))

    res.json(residentsWithPhoto)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Get single resident
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ message: 'Resident not found' })

    const resident = rows[0]
    if (resident.photo) {
      resident.photo = `${req.protocol}://${req.get('host')}${resident.photo}`
    }

    res.json(resident)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Create new resident with optional photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      dob,
      gender,
      civil_status,
      place_of_birth,
      address,
      household_no,
      phone,
      email
    } = req.body

    // ✅ Save path to /uploads/residents/<filename>
    const photo = req.file ? `/uploads/residents/${req.file.filename}` : null

    const [result] = await pool.query(
      `INSERT INTO residents 
        (first_name, middle_name, last_name, dob, gender, civil_status, place_of_birth, address, household_no, phone, email, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, middle_name, last_name, dob, gender, civil_status, place_of_birth, address, household_no, phone, email, photo]
    )

    const fullPhotoUrl = photo ? `${req.protocol}://${req.get('host')}${photo}` : null

    res.status(201).json({ id: result.insertId, message: 'Resident added successfully', photo: fullPhotoUrl })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Update resident with optional new photo
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      dob,
      gender,
      civil_status,
      place_of_birth,
      address,
      household_no,
      phone,
      email
    } = req.body

    // ✅ Correct photo path
    const photo = req.file ? `/uploads/residents/${req.file.filename}` : null

    let query = `
      UPDATE residents 
      SET first_name=?, middle_name=?, last_name=?, dob=?, gender=?, civil_status=?, place_of_birth=?, address=?, household_no=?, phone=?, email=?`
    const params = [first_name, middle_name, last_name, dob, gender, civil_status, place_of_birth, address, household_no, phone, email]

    if (photo) {
      query += `, photo=?`
      params.push(photo)
    }

    query += ` WHERE id=?`
    params.push(req.params.id)

    await pool.query(query, params)
    res.json({ message: 'Resident updated successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ Delete resident
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM residents WHERE id = ?', [req.params.id])
    res.json({ message: 'Resident deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
