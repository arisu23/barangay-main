import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all incidents
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM incidents ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching incidents:", err);
    res.status(500).json({ message: "Error fetching incidents" });
  }
});

// Add a new incident
router.post("/", async (req, res) => {
  const { date, type, persons_involved, resolution_status, mediation_records, outcome } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO incidents (date, type, persons_involved, resolution_status, mediation_records, outcome) VALUES (?, ?, ?, ?, ?, ?)",
      [date, type, persons_involved, resolution_status, mediation_records, outcome]
    );
    res.json({ id: result.insertId, message: "Incident recorded successfully" });
  } catch (err) {
    console.error("Error adding incident:", err);
    res.status(500).json({ message: "Error adding incident" });
  }
});

// Update incident
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { date, type, persons_involved, resolution_status, mediation_records, outcome } = req.body;
  try {
    await pool.query(
      "UPDATE incidents SET date=?, type=?, persons_involved=?, resolution_status=?, mediation_records=?, outcome=? WHERE id=?",
      [date, type, persons_involved, resolution_status, mediation_records, outcome, id]
    );
    res.json({ message: "Incident updated successfully" });
  } catch (err) {
    console.error("Error updating incident:", err);
    res.status(500).json({ message: "Error updating incident" });
  }
});

// Delete incident
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM incidents WHERE id=?", [id]);
    res.json({ message: "Incident deleted successfully" });
  } catch (err) {
    console.error("Error deleting incident:", err);
    res.status(500).json({ message: "Error deleting incident" });
  }
});

export default router;
