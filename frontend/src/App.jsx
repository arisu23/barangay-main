import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout'

// ✅ Import Pages
import ResidentsPage from "./pages/ResidentsPage";
import HouseholdsPage from "./pages/HouseholdsPage";
import IncidentsPage from "./pages/IncidentsPage";
import DocumentsPage from "./pages/DocumentsPage";
import CertificatePage from "./pages/CertificatePage";
import LoginPage from "./pages/LoginPage";
import ManageUser from "./pages/Manageuser";
import { isLoggedIn, getCurrentUser, logout, isAdmin } from "./api/authApi"
// import { useReactToPrint } from "react-to-print";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (isLoggedIn()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } else if (!isLoginPage) {
      // Redirect to login if not authenticated
      navigate("/");
    }
  }, [location, navigate, isLoginPage]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>
      {!isLoginPage && isAuthenticated ? (
        <AppBar position="static" color="primary">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Barangay Information System</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Show Manage Account only to Admin */}
              {isAdmin() && (
                <Button color="inherit" component={Link} to="/manage-users">
                  Manage Account
                </Button>
              )}
              
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

              {/* User info and logout */}
              <Typography variant="caption" sx={{ ml: 2, mr: 2 }}>
                {user?.username} ({user?.role})
              </Typography>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                size="small"
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      ) : null}

      {/* Main Content */}
      <Container sx={{ marginTop: isLoginPage ? 0 : 4 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/manage-users" element={isAdmin() ? <ManageUser /> : <ResidentsPage />} />
          <Route path="/residents" element={isAuthenticated ? <ResidentsPage /> : <LoginPage />} />
          <Route path="/households" element={isAuthenticated ? <HouseholdsPage /> : <LoginPage />} />
          <Route path="/incidents" element={isAuthenticated ? <IncidentsPage /> : <LoginPage />} />
          <Route path="/documents" element={isAuthenticated ? <DocumentsPage /> : <LoginPage />} />
          <Route path="/certificate" element={isAuthenticated ? <CertificatePage /> : <LoginPage />} />
        </Routes>
      </Container>
    </>
  );
}
