import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { fetchBoulders as fetchBoulderList } from "../services/boulderApi";
import { type IBoulder } from "../types/boulder.types";
import BoulderMap from "./BoulderMap";
import BoulderDetailsPanel from "./BoulderDetailsPanel";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface LocationGroup {
  locationKey: string;
  boulders: IBoulder[];
}

const getPreviewImageSrc = (imagesUrl?: string) => {
  if (!imagesUrl) return "";

  if (/^https?:\/\//i.test(imagesUrl)) {
    return imagesUrl;
  }

  return `http://localhost:5000${imagesUrl}`;
};

const HomePageContent: React.FC = () => {
  const [allBoulders, setAllBoulders] = useState<IBoulder[]>([]);
  const [groups, setGroups] = useState<LocationGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null,
  );
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [error, setError] = useState<string | null>(null);

  const { token, user } = useAuth();

  useEffect(() => {
    const fetchBoulders = async () => {
      if (!token) return;

      try {
        setError(null);
        const response = await fetchBoulderList();
        const boulderData = response.data;

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
        console.error("Could not fetch data:", err);
        setError("Could not load boulders right now. Please try again.");
      }
    };

    fetchBoulders();
  }, [token, user?.gradingSystem]);

  useEffect(() => {
    if (!selectedGroup) return;

    const updatedGroup = groups.find(
      (group) => group.locationKey === selectedGroup.locationKey,
    );

    setSelectedGroup(updatedGroup ?? null);
  }, [groups, selectedGroup?.locationKey]);

  const handleOpenBoulderDetails = (boulder: IBoulder) => {
    setSelectedGroup(null);
    setSelectedBoulder(boulder);
    setIsDetailsPanelOpen(true);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 6,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(255,250,244,0.95), rgba(228,220,206,0.72))",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "flex-end" }}
            spacing={3}
          >
            <Stack spacing={1.5} sx={{ maxWidth: 620 }}>
              <Chip
                label="Explore spots"
                color="secondary"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              <Typography variant="h3" fontWeight={700}>
                Boulder Areas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse climbing areas, switch to map view, and inspect grouped
                problems by location.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant={view === "grid" ? "contained" : "outlined"}
                onClick={() => setView("grid")}
              >
                Areas
              </Button>
              <Button
                variant={view === "map" ? "contained" : "outlined"}
                color={view === "map" ? "secondary" : "inherit"}
                onClick={() => setView("map")}
              >
                Map
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
              sx={{
                cursor: "pointer",
                borderRadius: 5,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "rgba(255,250,244,0.7)",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 24px 40px rgba(78, 55, 37, 0.14)",
                },
              }}
            >
              {group.boulders[0]?.imagesUrl ? (
                <Box
                  component="img"
                  src={getPreviewImageSrc(group.boulders[0].imagesUrl)}
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
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Typography variant="h6">
                      Spot: {group.locationKey}
                    </Typography>
                    <Chip
                      size="small"
                      color="primary"
                      label={group.boulders[0]?.grade || "?"}
                    />
                  </Stack>
                  <Divider />
                  <Typography color="text.secondary">
                    {group.boulders.length} boulders at this location
                  </Typography>
                </Stack>
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
            sx={{ width: "min(560px, 100%)", borderRadius: 5 }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Boulders at this spot
              </Typography>

              <Stack spacing={1.25} sx={{ mb: 2 }}>
                {selectedGroup.boulders.map((boulder) => (
                  <Card
                    key={boulder._id}
                    variant="outlined"
                    sx={{ borderRadius: 2, cursor: "pointer" }}
                    onClick={() => handleOpenBoulderDetails(boulder)}
                  >
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {boulder.name} ({boulder.grade})
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              <Button onClick={() => setSelectedGroup(null)}>Close</Button>
            </CardContent>
          </Card>
        </Box>
      )}

      <BoulderDetailsPanel
        boulder={selectedBoulder}
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
      />
    </Box>
  );
};

export default HomePageContent;
