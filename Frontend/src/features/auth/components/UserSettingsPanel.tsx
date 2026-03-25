import { useAuth } from "../hooks/useAuth";
import { updateGradingSystem } from "../services/authApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useNavigate } from "react-router-dom";

const UserSettingsPanel = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleScaleChange = async (scale: "font" | "v-scale") => {
    if (!user) return;
    if (user.gradingSystem === scale) return;

    try {
      const response = await updateGradingSystem(scale);
      if (response.success) {
        updateUser(response.data);
      }
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
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

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.2 }}
              >
                Sign out from this device.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleLogout}
              >
                Log out
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserSettingsPanel;
