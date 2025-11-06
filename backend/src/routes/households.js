import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all households
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM households ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching households:", err);
    res.status(500).json({ message: "Error fetching households" });
  }
});

// Add new household
router.post("/", async (req, res) => {
  const { household_no, head_of_family, members, socio_economic_classification, senior_citizens, pwds, solo_parents, indigents } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO households (household_no, head_of_family, members, socio_economic_classification, senior_citizens, pwds, solo_parents, indigents)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [household_no, head_of_family, members, socio_economic_classification, senior_citizens, pwds, solo_parents, indigents]
    );
    res.json({ id: result.insertId, message: "Household added successfully" });
  } catch (err) {
    console.error("Error adding household:", err);
    res.status(500).json({ message: "Error adding household" });
  }
});

// Update household
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { household_no, head_of_family, members, socio_economic_classification, senior_citizens, pwds, solo_parents, indigents } = req.body;
  try {
    await pool.query(
      `UPDATE households 
       SET household_no=?, head_of_family=?, members=?, socio_economic_classification=?, senior_citizens=?, pwds=?, solo_parents=?, indigents=? 
       WHERE id=?`,
      [household_no, head_of_family, members, socio_economic_classification, senior_citizens, pwds, solo_parents, indigents, id]
    );
    res.json({ message: "Household updated successfully" });
  } catch (err) {
    console.error("Error updating household:", err);
    res.status(500).json({ message: "Error updating household" });
  }
});

// Delete household
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM households WHERE id=?", [id]);
    res.json({ message: "Household deleted successfully" });
  } catch (err) {
    console.error("Error deleting household:", err);
    res.status(500).json({ message: "Error deleting household" });
  }
});

export default router;
