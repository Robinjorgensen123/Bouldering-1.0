import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { type IBoulder } from "../../types/Boulder.types";
import { Link } from "react-router-dom";
import BoulderMap from "../../components/BoulderMap/BoulderMap";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

interface ApiResponse {
  success: boolean;
  data: IBoulder[];
}

interface LocationGroup {
  locationKey: string;
  boulders: IBoulder[];
}

const Home: React.FC = () => {
  const [allBoulders, setAllBoulders] = useState<IBoulder[]>([]);
  const [groups, setGroups] = useState<LocationGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null,
  );
  const [view, setView] = useState<"grid" | "map">("grid");

  const { token } = useAuth();

  useEffect(() => {
    const fetchBoulders = async () => {
      if (!token) return;

      try {
        const response = await api.get<ApiResponse>("/boulders");
        const boulderData = response.data.data;

        if (Array.isArray(boulderData)) {
          setAllBoulders(boulderData);

          const map: { [key: string]: IBoulder[] } = {};

          boulderData.forEach((boulder) => {
            const key = boulder.location || "Unknown Location";
            if (!map[key]) {
              map[key] = [];
            }
            map[key].push(boulder);
          });

          const groupedArray = Object.keys(map).map((key) => ({
            locationKey: key,
            boulders: map[key],
          }));

          setGroups(groupedArray);
        }
      } catch (err) {
        console.error("Kunde inte hämta data:", err);
      }
    };

    fetchBoulders();
  }, [token]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight={700}>
          Boulder Areas
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant={view === "grid" ? "contained" : "outlined"}
            onClick={() => setView("grid")}
          >
            List
          </Button>
          <Button
            variant={view === "map" ? "contained" : "outlined"}
            onClick={() => setView("map")}
          >
            Map
          </Button>
        </Stack>
      </Stack>

      {view === "map" ? (
        <BoulderMap boulders={allBoulders} />
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {groups.map((group) => (
            <Card
              key={group.locationKey}
              onClick={() => setSelectedGroup(group)}
              sx={{ cursor: "pointer", borderRadius: 2 }}
            >
              {group.boulders[0]?.imagesUrl ? (
                <Box
                  component="img"
                  src={`http://localhost:5000${group.boulders[0].imagesUrl}`}
                  alt="Area preview"
                  sx={{ width: "100%", height: 170, objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 170,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "grey.100",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No preview image
                  </Typography>
                </Box>
              )}

              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography variant="h6">
                    Spot: {group.locationKey}
                  </Typography>
                  <Chip size="small" label={group.boulders[0]?.grade || "?"} />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {group.boulders.length} boulders at this location
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {selectedGroup && (
        <Box
          onClick={() => setSelectedGroup(null)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 1300,
            p: 2,
          }}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            sx={{ width: "min(560px, 100%)", borderRadius: 2 }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Boulders at this spot
              </Typography>

              <Stack spacing={1.25} sx={{ mb: 2 }}>
                {selectedGroup.boulders.map((b) => (
                  <Link
                    key={b._id}
                    to={`/boulder/${b._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ py: 1.25 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {b.name} ({b.grade})
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </Stack>

              <Button onClick={() => setSelectedGroup(null)}>Close</Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Home;
