import { useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import {
  Box,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface LocationResult {
  lat: number;
  lon: number;
  name: string;
  display_name: string;
}

interface MapSearchProps {
  onSelectLocation: (coordinates: [number, number]) => void;
}

const MapSearch = ({ onSelectLocation }: MapSearchProps) => {
  const [query, setQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setLocationResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoadingLocations(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
        );
        const data = await response.json();
        setLocationResults(data as LocationResult[]);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocationResults([]);
      } finally {
        setLoadingLocations(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelectLocation = (location: LocationResult) => {
    onSelectLocation([
      parseFloat(location.lat.toString()),
      parseFloat(location.lon.toString()),
    ]);
    setQuery("");
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        left: { xs: 16, sm: 50 },
        zIndex: 1400,
        width: { xs: "calc(100% - 32px)", sm: 320 },
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search city, address, location..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
        slotProps={{
          input: {
            "aria-label": "Search locations",
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {locationResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            maxHeight: 400,
            overflow: "auto",
          }}
        >
          <List dense disablePadding>
            {locationResults.map((location, index) => (
              <ListItemButton
                key={`${location.lat}-${location.lon}-${index}`}
                onClick={() => handleSelectLocation(location)}
                sx={{
                  alignItems: "flex-start",
                  py: 1,
                  "&:not(:last-of-type)": {
                    borderBottom: "1px solid",
                    borderBottomColor: "divider",
                  },
                }}
              >
                <LocationOnRoundedIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <ListItemText
                  primary={location.name}
                  secondary={location.display_name
                    .split(", ")
                    .slice(0, 2)
                    .join(", ")}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      {query.trim() !== "" && locationResults.length === 0 && (
        <Paper elevation={2} sx={{ mt: 1, p: 1.25, borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {loadingLocations ? "Searching..." : "No locations found."}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MapSearch;