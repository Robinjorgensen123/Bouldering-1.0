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
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { type IBoulder } from "../../types/Boulder.types";
import { type HistoryLog } from "./hooks/useBoulderHistory";
import { useDeviceType } from "../../hooks/useDeviceType";

const getPreviewImageSrc = (imagesUrl?: string) => {
  if (!imagesUrl) return "";
  if (/^https?:\/\//i.test(imagesUrl)) return imagesUrl;
  return `http://localhost:5000${imagesUrl}`;
};

const getTopoViewBoxSize = (boulder: IBoulder) => {
  const points = boulder.topoData?.linePoints ?? [];
  const holds = boulder.topoData?.holds ?? [];
  const maxPoint = points.reduce((m, p) => Math.max(m, p.x, p.y), 0);
  const maxHold = holds.reduce(
    (m, h) => Math.max(m, h.position.x, h.position.y),
    0,
  );
  return Math.max(1000, maxPoint, maxHold) + 24;
};

const getHoldColor = (holdType: string) => {
  switch (holdType) {
    case "start":
      return "#22C55E";
    case "finish":
      return "#EF4444";
    case "foot":
      return "#38BDF8";
    default:
      return "#F59E0B";
  }
};

interface BoulderDetailModalProps {
  boulder: IBoulder;
  historyLogs: HistoryLog[];
  loadingLogs: boolean;
  onClose: () => void;
}

export const BoulderDetailModal: React.FC<BoulderDetailModalProps> = ({
  boulder,
  historyLogs,
  loadingLogs,
  onClose,
}) => {
  const { isMobile, isDesktop } = useDeviceType();
  const topoViewBoxSize = getTopoViewBoxSize(boulder);

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.52)",
        display: "grid",
        placeItems: "center",
        zIndex: 1400,
        p: isMobile ? 1 : 2,
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: isDesktop ? "min(920px, 100%)" : "100%",
          maxHeight: isMobile ? "94vh" : "90vh",
          overflow: "auto",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Stack direction={{ xs: "column", md: "row" }}>
            {/* Left: image + topo overlay */}
            <Box
              sx={{
                width: { xs: "100%", md: "52%" },
                position: "relative",
                bgcolor: "grey.900",
                minHeight: { xs: 260, md: "100%" },
              }}
            >
              {boulder.imagesUrl ? (
                <>
                  <Box
                    component="img"
                    src={getPreviewImageSrc(boulder.imagesUrl)}
                    alt={boulder.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      minHeight: { xs: 260, md: 460 },
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      right: 16,
                      zIndex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<PhotoLibraryRoundedIcon />}
                      label="Image available"
                      sx={{
                        bgcolor: "rgba(15,23,42,0.7)",
                        color: "common.white",
                        "& .MuiChip-icon": { color: "inherit" },
                      }}
                    />
                    {boulder.topoData?.linePoints?.length ? (
                      <Chip
                        icon={<RouteRoundedIcon />}
                        label={`${boulder.topoData.linePoints.length} topo points`}
                        sx={{
                          bgcolor: "rgba(15,23,42,0.7)",
                          color: "common.white",
                          "& .MuiChip-icon": { color: "inherit" },
                        }}
                      />
                    ) : null}
                  </Stack>

                  {boulder.topoData?.linePoints &&
                    boulder.topoData.linePoints.length > 1 && (
                      <Box
                        component="svg"
                        viewBox={`0 0 ${topoViewBoxSize} ${topoViewBoxSize}`}
                        preserveAspectRatio="none"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          pointerEvents: "none",
                        }}
                      >
                        <polyline
                          points={boulder.topoData.linePoints
                            .map(
                              (p) =>
                                `${Math.max(0, Math.min(topoViewBoxSize, p.x))},${Math.max(0, Math.min(topoViewBoxSize, p.y))}`,
                            )
                            .join(" ")}
                          fill="none"
                          stroke="#ff2714"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.9"
                        />
                        {(boulder.topoData?.holds ?? []).map((hold, index) => (
                          <g key={`${hold.type}-${index}`}>
                            <circle
                              cx={hold.position.x}
                              cy={hold.position.y}
                              r="14"
                              fill={getHoldColor(hold.type)}
                              opacity="0.95"
                            />
                            <circle
                              cx={hold.position.x}
                              cy={hold.position.y}
                              r="18"
                              fill="transparent"
                              stroke="rgba(255,255,255,0.9)"
                              strokeWidth="3"
                            />
                          </g>
                        ))}
                      </Box>
                    )}
                </>
              ) : (
                <Box
                  sx={{
                    minHeight: { xs: 260, md: 460 },
                    display: "grid",
                    placeItems: "center",
                    color: "common.white",
                    background:
                      "repeating-linear-gradient(45deg, #1f2937, #1f2937 10px, #111827 10px, #111827 20px)",
                  }}
                >
                  <Typography variant="body2">No image uploaded</Typography>
                </Box>
              )}
            </Box>

            {/* Right: details + comments */}
            <Box sx={{ width: { xs: "100%", md: "48%" }, p: 2.5 }}>
              <Stack spacing={2.25}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", letterSpacing: 1.3 }}
                  >
                    Boulder details
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {boulder.name}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={{ mt: 1 }}
                  >
                    <Chip size="small" color="warning" label={boulder.grade} />
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<MapRoundedIcon />}
                      label={boulder.location}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {boulder.topoData?.holds?.length
                        ? `${boulder.topoData.holds.length} hold markers`
                        : "No hold markers added"}
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <Card variant="outlined" sx={{ flex: 1, borderRadius: 2.5 }}>
                    <CardContent sx={{ py: 1.4 }}>
                      <Typography variant="caption" color="text.secondary">
                        Topo overlay
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {boulder.topoData?.linePoints?.length
                          ? "Available"
                          : "Not added yet"}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined" sx={{ flex: 1, borderRadius: 2.5 }}>
                    <CardContent sx={{ py: 1.4 }}>
                      <Typography variant="caption" color="text.secondary">
                        Comments
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {historyLogs.length} entries
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>

                {boulder.description && (
                  <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {boulder.description}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ChatBubbleOutlineRoundedIcon
                      color="primary"
                      fontSize="small"
                    />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Comments & activity
                    </Typography>
                  </Stack>

                  <Stack spacing={1.25} sx={{ mt: 1.25 }}>
                    {loadingLogs ? (
                      <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            Loading comments...
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : historyLogs.length === 0 ? (
                      <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            No comments yet for this boulder.
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      historyLogs.map((log) => (
                        <Card
                          key={log._id}
                          variant="outlined"
                          sx={{ borderRadius: 2.5 }}
                        >
                          <CardContent sx={{ py: 1.25 }}>
                            <Typography variant="body2" fontWeight={700}>
                              {log.user?.username ||
                                log.user?.email ||
                                "Climber"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.3 }}
                            >
                              {log.ascentType || "log"}
                              {typeof log.attempts === "number"
                                ? ` • ${log.attempts} attempts`
                                : ""}
                              {log.completedAt
                                ? ` • ${new Date(log.completedAt).toLocaleDateString()}`
                                : ""}
                            </Typography>
                            {log.comment && (
                              <Typography variant="body2" sx={{ mt: 0.75 }}>
                                {log.comment}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1.25}>
                  <Button variant="outlined" onClick={onClose}>
                    Back to list
                  </Button>
                  <Button variant="contained" onClick={onClose}>
                    Close details
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
