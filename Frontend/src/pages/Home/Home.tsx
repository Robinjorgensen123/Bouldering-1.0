import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import { useBoulders } from "../../features/boulders/hooks/useBoulders";
import BoulderAreaCard from "../../features/boulders/components/BoulderAreaCard";
import BoulderMap from "../../features/map/components/BoulderMap";
import BoulderDetailsPanel from "../../features/boulders/components/BoulderDetails/BoulderDetailsPanel";
import type {
  IBoulder,
  LocationGroup,
} from "../../features/boulders/types/boulder.types";

const HomePage: React.FC = () => {
  const { allBoulders, groups, error } = useBoulders();
  const [view, setView] = useState<"grid" | "map">("grid");
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null,
  );
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

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
                Browse climbing areas and inspect problems.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant={view === "grid" ? "contained" : "outlined"}
                onClick={() => setView("grid")}
                data-testid="areas-btn"
              >
                Areas
              </Button>
              <Button
                variant={view === "map" ? "contained" : "outlined"}
                color="secondary"
                onClick={() => setView("map")}
                data-testid="map-btn"
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
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
          }}
        >
          {groups.map((group) => (
            <BoulderAreaCard
              key={group.locationKey}
              group={group}
              onClick={() => setSelectedGroup(group)}
            />
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
                Boulders at {selectedGroup.locationKey}
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

export default HomePage;
