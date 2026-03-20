import React from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { type LocationGroup } from "./hooks/useBoulderGroups";

const getPreviewImageSrc = (imagesUrl?: string) => {
  if (!imagesUrl) return "";
  if (/^https?:\/\//i.test(imagesUrl)) return imagesUrl;
  return `http://localhost:5000${imagesUrl}`;
};

interface LocationGridProps {
  groups: LocationGroup[];
  onSelectGroup: (group: LocationGroup) => void;
}

export const LocationGrid: React.FC<LocationGridProps> = ({
  groups,
  onSelectGroup,
}) => (
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
    {groups.length === 0 && (
      <Card
        sx={{
          gridColumn: "1 / -1",
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            No boulder areas yet
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Add your first boulder to start building your local climbing map.
          </Typography>
        </CardContent>
      </Card>
    )}

    {groups.map((group) => (
      <Card
        key={group.locationKey}
        onClick={() => onSelectGroup(group)}
        sx={{
          cursor: "pointer",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          transition: "transform 0.22s ease, box-shadow 0.22s ease",
          "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
        }}
      >
        {group.boulders[0]?.imagesUrl ? (
          <Box
            component="img"
            src={getPreviewImageSrc(group.boulders[0].imagesUrl)}
            alt="Area preview"
            sx={{ width: "100%", height: 190, objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 190,
              display: "grid",
              placeItems: "center",
              background:
                "repeating-linear-gradient(45deg, #f4f4f5, #f4f4f5 10px, #eceef0 10px, #eceef0 20px)",
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
            alignItems="center"
            spacing={1}
          >
            <Typography variant="h6" fontWeight={700}>
              Spot: {group.locationKey}
            </Typography>
            <Chip
              size="small"
              label={group.boulders[0]?.grade || "?"}
              color="warning"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {group.boulders.length} boulders at this location
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Box>
);
