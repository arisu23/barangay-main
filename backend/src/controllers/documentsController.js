import pool from "../config/db.js";

export const getDocuments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM documents ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDocument = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM documents WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Document not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDocument = async (req, res) => {
  const { doc_type, resident_name, purpose, status } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO documents (doc_type, resident_name, purpose, status, created_at) VALUES (?, ?, ?, ?, NOW())",
      [doc_type, resident_name, purpose, status || "Pending"]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDocument = async (req, res) => {
  const { doc_type, resident_name, purpose, status } = req.body;
  try {
    await pool.query(
      "UPDATE documents SET doc_type=?, resident_name=?, purpose=?, status=? WHERE id=?",
      [doc_type, resident_name, purpose, status, req.params.id]
    );
    res.json({ message: "Document updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await pool.query("DELETE FROM documents WHERE id=?", [req.params.id]);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
