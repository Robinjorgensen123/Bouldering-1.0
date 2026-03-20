import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { AuthResponse } from "../../types/User.types";
import { useAuth } from "../../hooks/useAuth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      login(token, user);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight={700}>
                Log In
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Continue where you left off and manage your boulders.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button type="submit" variant="contained" size="large">
                Log In
              </Button>

              <Typography variant="body2" color="text.secondary">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
