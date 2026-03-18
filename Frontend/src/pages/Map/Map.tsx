import { useState, useEffect } from "react";
import BoulderMap from "../../components/BoulderMap/BoulderMap";
import api from "../../services/api";
import { IBoulder } from "../../types/Boulder.types";
import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

const Map = () => {
  const [boulders, setBoulders] = useState<IBoulder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoulders = async () => {
      try {
        const response = await api.get("/boulders");
        if (response.data.success) {
          setBoulders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching boulders for map", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoulders();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "grid",
          placeItems: "center",
          px: 3,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading map...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "calc(100vh - 60px)", md: "calc(100vh - 64px)" },
        position: "relative",
        overflow: "hidden",
        bgcolor: "grey.100",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 400,
          px: 2,
          py: 1.5,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: 3,
          maxWidth: { xs: "calc(100% - 32px)", sm: 320 },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <MapRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Boulder Map
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Explore all registered problems and tap a marker to open route details.
        </Typography>
        <Chip
          size="small"
          color="primary"
          variant="outlined"
          label={`${boulders.length} boulders loaded`}
          sx={{ alignSelf: "flex-start" }}
        />
      </Stack>

      <BoulderMap boulders={boulders} isFullScreen={true} />
    </Box>
  );
};

export default Map;
