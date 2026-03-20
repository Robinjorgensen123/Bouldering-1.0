import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";

interface HomeHeroProps {
  totalAreas: number;
  totalBoulders: number;
  view: "grid" | "map";
  onViewChange: (view: "grid" | "map") => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  totalAreas,
  totalBoulders,
  view,
  onViewChange,
}) => (
  <Card
    elevation={0}
    sx={{
      mb: 3,
      borderRadius: 4,
      overflow: "hidden",
      color: "common.white",
      background:
        "linear-gradient(120deg, #183A37 0%, #245A4B 45%, #D97706 115%)",
    }}
  >
    <CardContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: { xs: 3, sm: 3.5 } }}>
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 1.6, opacity: 0.85 }}
            >
              Discover and track
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ lineHeight: 1.15, maxWidth: 580 }}
            >
              Boulder Areas
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 620 }}>
              Explore climbing spots, compare sectors, and jump straight into
              each problem from one clean overview.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              p: 0.5,
              borderRadius: 99,
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Button
              variant={view === "grid" ? "contained" : "text"}
              onClick={() => onViewChange("grid")}
              sx={{
                borderRadius: 99,
                minWidth: 90,
                color: "common.white",
                backgroundColor:
                  view === "grid" ? "rgba(255,255,255,0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.26)" },
              }}
            >
              Areas
            </Button>
            <Button
              variant={view === "map" ? "contained" : "text"}
              onClick={() => onViewChange("map")}
              sx={{
                borderRadius: 99,
                minWidth: 90,
                color: "common.white",
                backgroundColor:
                  view === "map" ? "rgba(255,255,255,0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.26)" },
              }}
            >
              Map
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Chip
            icon={<MapRoundedIcon />}
            label={`${totalAreas} areas`}
            sx={{
              color: "common.white",
              backgroundColor: "rgba(255,255,255,0.14)",
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
          <Chip
            icon={<TerrainRoundedIcon />}
            label={`${totalBoulders} boulders`}
            sx={{
              color: "common.white",
              backgroundColor: "rgba(255,255,255,0.14)",
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
          <Chip
            icon={<HikingRoundedIcon />}
            label="Plan your next session"
            sx={{
              color: "common.white",
              backgroundColor: "rgba(255,255,255,0.14)",
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);
