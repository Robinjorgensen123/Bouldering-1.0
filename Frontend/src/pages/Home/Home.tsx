import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { type IBoulder } from "../../types/Boulder.types";
import BoulderMap from "../../components/BoulderMap/BoulderMap";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";
import HikingRoundedIcon from "@mui/icons-material/HikingRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";

interface ApiResponse {
  success: boolean;
  data: IBoulder[];
}

interface LocationGroup {
  locationKey: string;
  boulders: IBoulder[];
}

interface HistoryLog {
  _id: string;
  ascentType?: string;
  attempts?: number;
  comment?: string;
  completedAt?: string;
  user?: {
    username?: string;
    email?: string;
  };
}

const getPreviewImageSrc = (imagesUrl?: string) => {
  if (!imagesUrl) return "";

  // Supports both stored relative paths (/uploads/...) and absolute URLs (Cloudinary/S3).
  if (/^https?:\/\//i.test(imagesUrl)) {
    return imagesUrl;
  }

  return `http://localhost:5000${imagesUrl}`;
};

const getTopoViewBoxSize = (boulder: IBoulder) => {
  const points = boulder.topoData?.linePoints ?? [];
  const holds = boulder.topoData?.holds ?? [];

  const maxPoint = points.reduce(
    (maxValue, point) => Math.max(maxValue, point.x, point.y),
    0,
  );
  const maxHold = holds.reduce(
    (maxValue, hold) =>
      Math.max(maxValue, hold.position.x, hold.position.y),
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

const Home: React.FC = () => {
  const [allBoulders, setAllBoulders] = useState<IBoulder[]>([]);
  const [groups, setGroups] = useState<LocationGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null,
  );
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");

  const { token, user } = useAuth();

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
  }, [token, user?.gradingSystem]);

  useEffect(() => {
    if (!selectedGroup) return;

    const updatedGroup = groups.find(
      (group) => group.locationKey === selectedGroup.locationKey,
    );

    setSelectedGroup(updatedGroup ?? null);
  }, [groups, selectedGroup?.locationKey]);

  useEffect(() => {
    const fetchBoulderHistory = async () => {
      if (!selectedBoulder?._id) {
        setHistoryLogs([]);
        return;
      }

      setLoadingLogs(true);
      try {
        const response = await api.get<{
          success: boolean;
          data: HistoryLog[];
        }>(`/history/boulder/${selectedBoulder._id}`);
        if (response.data.success) {
          setHistoryLogs(response.data.data || []);
        }
      } catch (error) {
        console.error("Could not fetch boulder history", error);
        setHistoryLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchBoulderHistory();
  }, [selectedBoulder?._id]);

  const totalAreas = groups.length;
  const totalBoulders = allBoulders.length;
  const topoViewBoxSize = selectedBoulder
    ? getTopoViewBoxSize(selectedBoulder)
    : 1000;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 3,
        background:
          "radial-gradient(circle at 0% 0%, rgba(255,183,77,0.16), transparent 40%), radial-gradient(circle at 100% 100%, rgba(20,90,70,0.14), transparent 35%)",
      }}
    >
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
                  Explore climbing spots, compare sectors, and jump straight
                  into each problem from one clean overview.
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
                  onClick={() => setView("grid")}
                  sx={{
                    borderRadius: 99,
                    minWidth: 90,
                    color: "common.white",
                    backgroundColor:
                      view === "grid" ? "rgba(255,255,255,0.2)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.26)",
                    },
                  }}
                >
                  Areas
                </Button>
                <Button
                  variant={view === "map" ? "contained" : "text"}
                  onClick={() => setView("map")}
                  sx={{
                    borderRadius: 99,
                    minWidth: 90,
                    color: "common.white",
                    backgroundColor:
                      view === "map" ? "rgba(255,255,255,0.2)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.26)",
                    },
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
                  Add your first boulder to start building your local climbing
                  map.
                </Typography>
              </CardContent>
            </Card>
          )}

          {groups.map((group) => (
            <Card
              key={group.locationKey}
              onClick={() => setSelectedGroup(group)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
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
      )}

      {selectedGroup && (
        <Box
          onClick={() => {
            setSelectedBoulder(null);
            setSelectedGroup(null);
          }}
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
            sx={{
              width: "min(620px, 100%)",
              borderRadius: 3,
              maxHeight: "85vh",
              overflow: "auto",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, py: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{ bgcolor: "warning.light", color: "warning.dark" }}
                  >
                    <MapRoundedIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      Boulders at this spot
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedGroup.locationKey}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Stack spacing={1.25} sx={{ px: 2.5, py: 2 }}>
                {selectedGroup.boulders.map((b) => (
                  <Card
                    key={b._id}
                    variant="outlined"
                    onClick={() => setSelectedBoulder(b)}
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
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedBoulder(null);
                    setSelectedGroup(null);
                  }}
                >
                  Close
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {selectedBoulder && (
        <Box
          onClick={() => setSelectedBoulder(null)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.52)",
            display: "grid",
            placeItems: "center",
            zIndex: 1400,
            p: 2,
          }}
        >
          <Card
            onClick={(event) => event.stopPropagation()}
            sx={{
              width: "min(920px, 100%)",
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Stack direction={{ xs: "column", md: "row" }}>
                <Box
                  sx={{
                    width: { xs: "100%", md: "52%" },
                    position: "relative",
                    bgcolor: "grey.900",
                    minHeight: { xs: 260, md: "100%" },
                  }}
                >
                  {selectedBoulder.imagesUrl ? (
                    <>
                      <Box
                        component="img"
                        src={getPreviewImageSrc(selectedBoulder.imagesUrl)}
                        alt={selectedBoulder.name}
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
                        {selectedBoulder.topoData?.linePoints?.length ? (
                          <Chip
                            icon={<RouteRoundedIcon />}
                            label={`${selectedBoulder.topoData.linePoints.length} topo points`}
                            sx={{
                              bgcolor: "rgba(15,23,42,0.7)",
                              color: "common.white",
                              "& .MuiChip-icon": { color: "inherit" },
                            }}
                          />
                        ) : null}
                      </Stack>

                      {selectedBoulder.topoData?.linePoints &&
                        selectedBoulder.topoData.linePoints.length > 1 && (
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
                              points={selectedBoulder.topoData.linePoints
                                .map(
                                  (point) =>
                                    `${Math.max(0, Math.min(topoViewBoxSize, point.x))},${Math.max(0, Math.min(topoViewBoxSize, point.y))}`,
                                )
                                .join(" ")}
                              fill="none"
                              stroke="#39FF14"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity="0.9"
                            />

                            {(selectedBoulder.topoData?.holds ?? []).map(
                              (hold, index) => (
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
                              ),
                            )}
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
                        {selectedBoulder.name}
                      </Typography>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        sx={{ mt: 1 }}
                      >
                        <Chip
                          size="small"
                          color="warning"
                          label={selectedBoulder.grade}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<MapRoundedIcon />}
                          label={selectedBoulder.location}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {selectedBoulder.topoData?.holds?.length
                            ? `${selectedBoulder.topoData.holds.length} hold markers`
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
                            {selectedBoulder.topoData?.linePoints?.length
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

                    {selectedBoulder.description && (
                      <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                        <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {selectedBoulder.description}
                        </Typography>
                        </CardContent>
                      </Card>
                    )}

                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ChatBubbleOutlineRoundedIcon color="primary" fontSize="small" />
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
                      <Button variant="outlined" onClick={() => setSelectedBoulder(null)}>
                        Back to list
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setSelectedBoulder(null)}
                      >
                        Close details
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Home;
