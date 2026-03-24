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
import { registerUser } from "../services/authApi";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: 4 }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 6,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(255,250,244,0.94), rgba(250,243,234,0.78))",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
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

export default RegisterForm;
