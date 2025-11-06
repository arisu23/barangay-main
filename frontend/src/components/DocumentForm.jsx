import React, { useState } from "react";
import { createDocument } from "../api/documentsApi";
import { DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

export default function DocumentForm({ onClose, reload }) {
  const [form, setForm] = useState({
    doc_type: "",
    resident_name: "",
    purpose: "",
    status: "Pending",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDocument(form);
    reload();
    onClose();
  };

  return (
    <>
      <DialogTitle>New Document / Certificate</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Document Type" name="doc_type" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Resident Name" name="resident_name" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Purpose" name="purpose" margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </>
  );
}
