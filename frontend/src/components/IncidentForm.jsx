import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Stack } from "@mui/material";

const IncidentForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    date: "",
    type: "",
    persons_involved: "",
    resolution_status: "Ongoing",
    mediation_records: "",
    outcome: "",
  });

  useEffect(() => {
    if (initialData.id) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField name="date" label="Date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField name="type" label="Incident Type" value={form.type} onChange={handleChange} required />
        <TextField name="persons_involved" label="Persons Involved" value={form.persons_involved} onChange={handleChange} multiline />
        <TextField select name="resolution_status" label="Resolution Status" value={form.resolution_status} onChange={handleChange}>
          <MenuItem value="Settled">Settled</MenuItem>
          <MenuItem value="Referred">Referred</MenuItem>
          <MenuItem value="Ongoing">Ongoing</MenuItem>
        </TextField>
        <TextField name="mediation_records" label="Mediation Records" value={form.mediation_records} onChange={handleChange} multiline />
        <TextField name="outcome" label="Outcome" value={form.outcome} onChange={handleChange} multiline />
        <Button type="submit" variant="contained">Save</Button>
      </Stack>
    </form>
  );
};

export default IncidentForm;
