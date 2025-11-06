// src/controllers/residentsController.js
const pool = require('../config/db');


exports.getAll = async (req, res, next) => {
try {
const [rows] = await pool.query('SELECT * FROM residents');
res.json(rows);
} catch (err) { next(err); }
};


exports.getById = async (req, res, next) => {
try {
const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [req.params.id]);
if (rows.length === 0) return res.status(404).json({ message: 'Resident not found' });
res.json(rows[0]);
} catch (err) { next(err); }
};


exports.create = async (req, res, next) => {
try {
const { first_name, last_name, middle_name, dob, gender, civil_status, address, household_no, phone, email } = req.body;
const [result] = await pool.query(
`INSERT INTO residents (first_name, last_name, middle_name, dob, gender, civil_status, address, household_no, phone, email)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
[first_name, last_name, middle_name, dob, gender, civil_status, address, household_no, phone, email]
);
const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [result.insertId]);
res.status(201).json(rows[0]);
} catch (err) { next(err); }
};


exports.update = async (req, res, next) => {
try {
const { id } = req.params;
const fields = req.body;
const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
const values = Object.values(fields);
values.push(id);
await pool.query(`UPDATE residents SET ${sets} WHERE id = ?`, values);
const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [id]);
res.json(rows[0]);
} catch (err) { next(err); }
};


exports.remove = async (req, res, next) => {
try {
await pool.query('DELETE FROM residents WHERE id = ?', [req.params.id]);
res.status(204).end();
} catch (err) { next(err); }
};