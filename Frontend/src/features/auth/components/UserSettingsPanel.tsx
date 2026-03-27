import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { changePassword, updateGradingSystem } from "../services/authApi";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const UserSettingsPanel = () => {
  const { user, updateUser } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordToast, setPasswordToast] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleScaleChange = async (scale: "font" | "v-scale") => {
    if (!user) return;
    if (user.gradingSystem === scale) return;
    setErrorToast(null);
    setSuccess(null);

    try {
      const response = await updateGradingSystem(scale);
      if (response.success) {
        updateUser(response.data);
        setSuccess("Settings updated.");
      }
    } catch (error) {
      console.error("Failed to update settings", error);
      setErrorToast("Could not update settings. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    setErrorToast(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorToast("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorToast("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorToast("Passwords do not match.");
      return;
    }

    try {
      const response = await changePassword(currentPassword, newPassword);
      if (response.success) {
        setPasswordToast(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setErrorToast(
        err.response?.data?.message || "Could not update password.",
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
      <Snackbar
        open={passwordToast}
        autoHideDuration={4000}
        onClose={() => setPasswordToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setPasswordToast(false)}
          sx={{ width: "100%" }}
        >
          Password changed successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorToast}
        autoHideDuration={5000}
        onClose={() => setErrorToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setErrorToast(null)}
          sx={{ width: "100%" }}
        >
          {errorToast}
        </Alert>
      </Snackbar>
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 6,
          background:
            "linear-gradient(180deg, rgba(255,250,244,0.94), rgba(250,243,234,0.78))",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            {success && <Alert severity="success">{success}</Alert>}

            <Stack spacing={1.5}>
              <Chip
                label="Personal preferences"
                color="secondary"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <TuneRoundedIcon color="primary" />
                <Typography variant="h4" fontWeight="bold">
                  Settings
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                Adjust how grades are displayed throughout the app.
              </Typography>
            </Stack>

            <Box>
              <Typography variant="h6" fontWeight={700}>
                Grading System
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 2 }}
              >
                Choose your preferred grade format for route display.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  className={user?.gradingSystem === "font" ? "active" : ""}
                  variant={
                    user?.gradingSystem === "font" ? "contained" : "outlined"
                  }
                  onClick={() => handleScaleChange("font")}
                  fullWidth
                  color="primary"
                >
                  Fontainebleau
                </Button>
                <Button
                  aria-label="V-Scale"
                  className={user?.gradingSystem === "v-scale" ? "active" : ""}
                  variant={
                    user?.gradingSystem === "v-scale" ? "contained" : "outlined"
                  }
                  onClick={() => handleScaleChange("v-scale")}
                  fullWidth
                  color="secondary"
                >
                  V-Scale
                </Button>
              </Stack>
            </Box>

            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordChange();
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Change Password
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 2 }}
              >
                Update your password for better account security.
              </Typography>

              <Stack spacing={1.5}>
                <TextField
                  label="Current Password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                />

                <TextField
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Confirm New Password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Update Password
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserSettingsPanel;
