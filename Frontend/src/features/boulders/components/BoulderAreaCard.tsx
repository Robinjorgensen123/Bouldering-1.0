import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import type { LocationGroup } from "../types/boulder.types";
import { getPreviewImageSrc } from "../utils/imageUtils";

interface Props {
  group: LocationGroup;
  onClick: () => void;
}

const BoulderAreaCard: React.FC<Props> = ({ group, onClick }) => {
  const previewUrl = getPreviewImageSrc(group.boulders[0]?.imagesUrl || "");
  const optimizedUrl = previewUrl?.includes("res.cloudinary.com")
    ? previewUrl.replace("/upload/", "/upload/f_auto,q_auto/")
    : previewUrl;

  return (
    <Card
      onClick={onClick}
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
      {optimizedUrl ? (
        <Box
          component="img"
          src={optimizedUrl}
          alt={group.locationKey}
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
            alignItems="flex-start"
          >
            <Typography variant="h6">Spot: {group.locationKey}</Typography>
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
  );
};

export default BoulderAreaCard;
