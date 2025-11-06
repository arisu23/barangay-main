import React, { useEffect, useState } from "react";
import { getIncidents, createIncident, deleteIncident } from "../api/incidentsApi";
import IncidentForm from "../components/IncidentForm";
import { Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, Container } from "@mui/material";

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [adding, setAdding] = useState(false);

  const loadIncidents = async () => {
    const res = await getIncidents();
    setIncidents(res.data);
  };

  const handleAdd = async (formData) => {
    await createIncident(formData);
    setAdding(false);
    loadIncidents();
  };

  const handleDelete = async (id) => {
    await deleteIncident(id);
    loadIncidents();
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 2 }}>Incident & Blotter Records</Typography>

      {adding ? (
        <IncidentForm onSubmit={handleAdd} />
      ) : (
        <Button variant="contained" onClick={() => setAdding(true)}>Add Incident</Button>
      )}

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Persons Involved</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Outcome</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.date}</TableCell>
              <TableCell>{i.type}</TableCell>
              <TableCell>{i.persons_involved}</TableCell>
              <TableCell>{i.resolution_status}</TableCell>
              <TableCell>{i.outcome}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDelete(i.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default IncidentsPage;
