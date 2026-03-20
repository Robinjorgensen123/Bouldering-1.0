import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IBoulder } from "../../types/Boulder.types";
import { useEffect, useState } from "react";
import BoulderDetailsPanel from "../BoulderDetailsPanel/BoulderDetailsPanel";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useDeviceType } from "../../hooks/useDeviceType";

const markerIcon = new URL(
  "leaflet/dist/images/marker-icon.png",
  import.meta.url,
).href;
const markerShadow = new URL(
  "leaflet/dist/images/marker-shadow.png",
  import.meta.url,
).href;

interface BoulderGroup {
  key: string;
  coordinates: [number, number];
  boulders: IBoulder[];
}

const CLUSTER_DISTANCE_METERS = 18;

interface Props {
  boulders: IBoulder[];
  isFullScreen?: boolean;
  focusBoulder?: IBoulder | null;
  focusLocation?: [number, number] | null;
}

const getPreviewImageSrc = (imagesUrl?: string) => {
  if (!imagesUrl) return "";

  if (/^https?:\/\//i.test(imagesUrl)) {
    return imagesUrl;
  }

  return `http://localhost:5000${imagesUrl}`;
};

const createGroupedMarkerIcon = (count: number) =>
  L.divIcon({
    className: "grouped-boulder-marker",
    html: `
      <div style="position: relative; width: 30px; height: 41px;">
        <img src="${markerIcon}" alt="marker" style="width: 30px; height: 41px; display: block;" />
        <span style="position: absolute; top: -4px; right: -8px; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px; background: #245A4B; color: white; font-size: 12px; font-weight: 700; line-height: 22px; text-align: center; box-shadow: 0 3px 10px rgba(0,0,0,0.24); border: 2px solid white;">${count}</span>
      </div>
    `,
    iconSize: [34, 41],
    iconAnchor: [15, 41],
    popupAnchor: [1, -34],
  });

const getDistanceInMeters = (
  first: [number, number],
  second: [number, number],
) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;

  const latitudeDelta = toRadians(second[0] - first[0]);
  const longitudeDelta = toRadians(second[1] - first[1]);
  const firstLatitude = toRadians(first[0]);
  const secondLatitude = toRadians(second[0]);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const groupNearbyBoulders = (boulders: IBoulder[]): BoulderGroup[] => {
  const groups: BoulderGroup[] = [];

  boulders.forEach((boulder) => {
    const position: [number, number] = [
      boulder.coordinates.lat,
      boulder.coordinates.lng,
    ];

    const matchingGroup = groups.find((group) => {
      return (
        getDistanceInMeters(group.coordinates, position) <=
        CLUSTER_DISTANCE_METERS
      );
    });

    if (matchingGroup) {
      matchingGroup.boulders.push(boulder);

      const latitudeAverage =
        matchingGroup.boulders.reduce(
          (sum, item) => sum + item.coordinates.lat,
          0,
        ) / matchingGroup.boulders.length;
      const longitudeAverage =
        matchingGroup.boulders.reduce(
          (sum, item) => sum + item.coordinates.lng,
          0,
        ) / matchingGroup.boulders.length;

      matchingGroup.coordinates = [latitudeAverage, longitudeAverage];
      return;
    }

    groups.push({
      key: boulder._id || `${position[0]}:${position[1]}`,
      coordinates: position,
      boulders: [boulder],
    });
  });

  return groups.map((group, index) => ({
    ...group,
    key: `${group.key}-${index}`,
  }));
};

const FlyToBoulder = ({
  boulder,
}: {
  boulder: IBoulder | null | undefined;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!boulder) return;

    map.flyTo([boulder.coordinates.lat, boulder.coordinates.lng], 14, {
      duration: 0.8,
    });
  }, [map, boulder?._id]);

  return null;
};

const FlyToLocation = ({
  coordinates,
}: {
  coordinates: [number, number] | null | undefined;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!coordinates) return;

    map.flyTo(coordinates, 12, {
      duration: 0.8,
    });
  }, [map, coordinates]);

  return null;
};

const BoulderMap = ({
  boulders,
  isFullScreen = false,
  focusBoulder = null,
  focusLocation = null,
}: Props) => {
  const { isMobile } = useDeviceType();
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const groupedBoulders = groupNearbyBoulders(boulders);

  useEffect(() => {
    if (!selectedBoulder?._id) return;

    const updatedBoulder = boulders.find(
      (boulder) => boulder._id === selectedBoulder._id,
    );

    setSelectedBoulder(updatedBoulder ?? null);

    if (!updatedBoulder) {
      setIsDetailsPanelOpen(false);
    }
  }, [boulders, selectedBoulder?._id]);

  useEffect(() => {
    if (!focusBoulder?._id) return;

    setSelectedBoulder(focusBoulder);
    setIsDetailsPanelOpen(true);
  }, [focusBoulder?._id]);

  //Default coordinates to Gothenburg
  const defaultCenter: [number, number] = [57.7089, 11.9746];
  const center: [number, number] =
    boulders.length > 0
      ? [boulders[0].coordinates.lat, boulders[0].coordinates.lng]
      : defaultCenter;

  const mapHeight = isFullScreen ? "100%" : isMobile ? "340px" : "400px";
  const marginBottom = isFullScreen ? "0" : "2rem";
  const borderRadius = isFullScreen ? "0" : "14px";

  const handleMarkerClick = (boulder: IBoulder) => {
    setSelectedBoulder(boulder);
    setIsDetailsPanelOpen(true);
  };

  return (
    <Box
      className="boulder-map-wrapper"
      data-testid="map-wrapper"
      sx={{
        height: mapHeight,
        width: "100%",
        marginBottom: marginBottom,
        borderRadius: isFullScreen ? 0 : "14px",
        overflow: "hidden",
        boxShadow: isFullScreen ? "none" : "0 8px 20px rgba(24,58,55,0.14)",
        border: isFullScreen ? "none" : "1px solid rgba(24,58,55,0.14)",
      }}
    >
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: borderRadius }}
      >
        <FlyToBoulder boulder={focusBoulder} />
        <FlyToLocation coordinates={focusLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {groupedBoulders.map((group) => (
          <Marker
            key={group.key}
            position={group.coordinates}
            icon={createGroupedMarkerIcon(group.boulders.length)}
          >
            <Popup>
              <Box sx={{ width: isMobile ? 230 : 260, py: 0.5 }}>
                <Stack spacing={0.75} sx={{ mb: 1.25 }}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {group.boulders.length > 1
                      ? `${group.boulders.length} boulders here`
                      : group.boulders[0]?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {group.boulders[0]?.location}
                  </Typography>
                  {group.boulders.length > 1 ? (
                    <Chip
                      size="small"
                      label="Scroll through the problems"
                      sx={{ alignSelf: "flex-start" }}
                    />
                  ) : null}
                </Stack>

                <Stack
                  spacing={1}
                  sx={{
                    maxHeight: isMobile ? 220 : 260,
                    overflowY: "auto",
                    pr: 0.5,
                  }}
                >
                  {group.boulders.map((boulder) => (
                    <Box
                      key={boulder._id}
                      onClick={() => handleMarkerClick(boulder)}
                      sx={{
                        display: "flex",
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: 2,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {boulder.imagesUrl ? (
                        <Box
                          component="img"
                          src={getPreviewImageSrc(boulder.imagesUrl)}
                          alt={boulder.name}
                          sx={{
                            width: isMobile ? 54 : 62,
                            height: isMobile ? 54 : 62,
                            borderRadius: 1.5,
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: isMobile ? 54 : 62,
                            height: isMobile ? 54 : 62,
                            borderRadius: 1.5,
                            flexShrink: 0,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "grey.200",
                            color: "text.secondary",
                            fontSize: 12,
                            textAlign: "center",
                            px: 0.5,
                          }}
                        >
                          No image
                        </Box>
                      )}

                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {boulder.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {boulder.grade}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Open details
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <BoulderDetailsPanel
        boulder={selectedBoulder}
        isOpen={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
      />
    </Box>
  );
};

export default BoulderMap;
