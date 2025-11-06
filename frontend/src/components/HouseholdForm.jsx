import React, { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";

const HouseholdForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    household_no: "",
    head_of_family: "",
    members: "",
    socio_economic_classification: "",
    senior_citizens: 0,
    pwds: 0,
    solo_parents: 0,
    indigents: 0,
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
        <TextField name="household_no" label="Household No." value={form.household_no} onChange={handleChange} required />
        <TextField name="head_of_family" label="Head of Family" value={form.head_of_family} onChange={handleChange} required />
        <TextField name="members" label="Members (Comma-separated)" value={form.members} onChange={handleChange} multiline />
        <TextField name="socio_economic_classification" label="Socio-Economic Classification" value={form.socio_economic_classification} onChange={handleChange} />
        <TextField name="senior_citizens" label="No. of Senior Citizens" type="number" value={form.senior_citizens} onChange={handleChange} />
        <TextField name="pwds" label="No. of PWDs" type="number" value={form.pwds} onChange={handleChange} />
        <TextField name="solo_parents" label="No. of Solo Parents" type="number" value={form.solo_parents} onChange={handleChange} />
        <TextField name="indigents" label="No. of Indigents" type="number" value={form.indigents} onChange={handleChange} />
        <Button type="submit" variant="contained">Save</Button>
      </Stack>
    </form>
  );
};

export default HouseholdForm;
