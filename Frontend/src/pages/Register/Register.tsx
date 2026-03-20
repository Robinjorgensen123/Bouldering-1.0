import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../services/api";
import { useDeviceType } from "../../hooks/useDeviceType";

const Register = () => {
  const { isMobile } = useDeviceType();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("auth/register", { email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: isMobile ? 2 : 4,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight="bold"
                  gutterBottom
                >
                  Sign Up
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create an account to log sends, manage boulders, and track
                  your climbing history.
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                fullWidth
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                fullWidth
              />

              <Button type="submit" variant="contained" size="large" fullWidth>
                Sign Up
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
              >
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" underline="hover">
                  Log In
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
