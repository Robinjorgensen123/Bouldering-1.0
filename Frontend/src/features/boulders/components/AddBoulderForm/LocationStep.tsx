import { Paper, Stack, Typography, Button, Alert } from "@mui/material";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import NearMeRoundedIcon from "@mui/icons-material/NearMeRounded";

interface Props {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  onGetCoords: () => void;
}

export const LocationStep = ({ lat, lng, loading, onGetCoords }: Props) => (
  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <ExploreRoundedIcon color="primary" fontSize="small" />
        <Typography variant="subtitle1" fontWeight={700}>
          Location
        </Typography>
      </Stack>
      <Button
        variant="outlined"
        onClick={onGetCoords}
        disabled={loading}
        startIcon={<NearMeRoundedIcon />}
      >
        {loading ? "Acquiring..." : "Get Coordinates"}
      </Button>
      {lat && lng && (
        <Alert severity="success">
          Lat: {lat.toFixed(5)} | Lng: {lng.toFixed(5)}
        </Alert>
      )}
    </Stack>
  </Paper>
);
