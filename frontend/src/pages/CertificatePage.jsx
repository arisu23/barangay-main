import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Container, Button, Paper, TextField, Typography, Box } from "@mui/material";

export default function CertificatePage() {
  const certificateRef = useRef(); // reference to printable area
  const [residentName, setResidentName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dateIssued, setDateIssued] = useState("");

  // ✅ This is where to use it:
  const handlePrint = useReactToPrint({
    content: () => certificateRef.current, // <— old syntax (v2.x)
    documentTitle: "Barangay Certificate",
    onAfterPrint: () => alert("Certificate printed successfully!"),
  });

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5">Barangay Certificate Issuance</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2, mb: 4 }}>
        <TextField label="Resident Name" value={residentName} onChange={(e) => setResidentName(e.target.value)} />
        <TextField label="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        <TextField
          label="Date Issued"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateIssued}
          onChange={(e) => setDateIssued(e.target.value)}
        />
        <Button variant="contained" onClick={handlePrint}>
          Print Certificate
        </Button>
      </Box>

      {/* Printable certificate */}
      <Paper ref={certificateRef} sx={{ p: 5, border: "2px solid black", width: "800px", mx: "auto" }}>
        <Typography variant="h4" textAlign="center">
          Barangay Certificate
        </Typography>
        <Typography variant="body1" sx={{ mt: 3 }}>
          This certifies that <b>{residentName || "________"}</b> is a bonafide resident of Barangay XXX.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Purpose: <b>{purpose || "________"}</b>
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Issued on <b>{dateIssued || "________"}</b>.
        </Typography>
      </Paper>
    </Container>
  );
}
