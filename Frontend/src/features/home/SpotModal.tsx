import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { type LocationGroup } from "./hooks/useBoulderGroups";
import { type IBoulder } from "../../types/Boulder.types";
import { useDeviceType } from "../../hooks/useDeviceType";

interface SpotModalProps {
  group: LocationGroup;
  onClose: () => void;
  onSelectBoulder: (boulder: IBoulder) => void;
}

export const SpotModal: React.FC<SpotModalProps> = ({
  group,
  onClose,
  onSelectBoulder,
}) => {
  const { isMobile, isDesktop } = useDeviceType();

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1300,
        p: isMobile ? 1 : 2,
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: isDesktop ? "min(620px, 100%)" : "100%",
          borderRadius: 3,
          maxHeight: isMobile ? "92vh" : "85vh",
          overflow: "auto",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 2.5, py: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: "warning.light", color: "warning.dark" }}>
                <MapRoundedIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Boulders at this spot
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {group.locationKey}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          <Stack spacing={1.25} sx={{ px: 2.5, py: 2 }}>
            {group.boulders.map((b) => (
              <Card
                key={b._id}
                variant="outlined"
                onClick={() => onSelectBoulder(b)}
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "warning.main",
                    boxShadow: 2,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardContent sx={{ py: 1.25, px: 1.75 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {b.name} ({b.grade})
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
