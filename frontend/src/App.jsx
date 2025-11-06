import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useLocation } from "react-router-dom";

// ✅ Import Pages
import ResidentsPage from "./pages/ResidentsPage";
import HouseholdsPage from "./pages/HouseholdsPage";
import IncidentsPage from "./pages/IncidentsPage";
import DocumentsPage from "./pages/DocumentsPage";
import CertificatePage from "./pages/CertificatePage";
import LoginPage from "./pages/LoginPage";
// import { useReactToPrint } from "react-to-print";

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  
  return (
    <>
      {isLoginPage ? null : (
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Barangay Information System</Typography>

          <div>
            <Button color="inherit" component={Link} to="/residents">
              Residents
            </Button>
            <Button color="inherit" component={Link} to="/households">
              Households
            </Button>
            <Button color="inherit" component={Link} to="/incidents">
              Incidents
            </Button>
            <Button color="inherit" component={Link} to="/documents">
              Documents
            </Button>
            <Button color="inherit" component={Link} to="/certificate">
              Certificate
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      )}

      {/* Main Content */}
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/households" element={<HouseholdsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
                 <Route path="/certificate" element={<CertificatePage />} />
        </Routes>
      </Container>
    </>
  );
}
