import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const UserSettings = () => {
  const { user, updateUser } = useAuth();

  const handleScaleChange = async (scale: "font" | "v-scale") => {
    if (!user) return;
    if (user.gradingSystem === scale) return;

    try {
      const response = await api.put("/user/settings", {
        gradingSystem: scale,
      });
      if (response.data.success) {
        updateUser(response.data.data);
      }
    } catch (error) {
      console.error("Failed to update settings", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
      >
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TuneRoundedIcon color="primary" />
              <Typography variant="h4" fontWeight="bold">
                Settings
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
                >
                  V-Scale
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserSettings;
