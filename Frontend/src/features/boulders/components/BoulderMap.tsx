import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type IBoulder } from "../types/boulder.types";
import BoulderDetailsPanel from "./BoulderDetailsPanel";

const BoulderMarkerIcon = L.divIcon({
  className: "boulder-marker-shell",
  html: `
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      
      <!-- Glow filter -->
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Rock shape -->
      <path 
        d="M22 4 
           L34 10 
           L40 22 
           L36 34 
           L24 40 
           L10 38 
           L4 26 
           L8 14 Z"
        fill="url(#rockGradient)"
        stroke="#0f1216"
        stroke-width="2"
      />

      <!-- Gradient -->
      <defs>
        <linearGradient id="rockGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4b5563"/>
          <stop offset="40%" stop-color="#2f3742"/>
          <stop offset="100%" stop-color="#11161c"/>
        </linearGradient>
      </defs>

      <!-- Cracks -->
      <path d="M22 20 L32 10" stroke="#ff3b2f" stroke-width="2.5" filter="url(#glow)" />
      <path d="M22 20 L12 26" stroke="#ff3b2f" stroke-width="2.5" filter="url(#glow)" />
      <path d="M22 20 L20 34" stroke="#ff3b2f" stroke-width="2.5" filter="url(#glow)" />

      <!-- Highlight -->
      <ellipse cx="18" cy="16" rx="4" ry="2.5" fill="white" opacity="0.15"/>

    </svg>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 30],
  popupAnchor: [0, -24],
});

interface Props {
  boulders: IBoulder[];
  isFullScreen?: boolean;
  focusBoulder?: IBoulder | null;
  focusLocation?: [number, number] | null;
}

interface MarkerCluster {
  boulders: IBoulder[];
  center: [number, number];
}

const MARKER_GROUP_DISTANCE_METERS = 20;

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceInMeters = (a: [number, number], b: [number, number]) => {
  const earthRadius = 6371000;
  const dLat = toRadians(b[0] - a[0]);
  const dLng = toRadians(b[1] - a[1]);
  const lat1 = toRadians(a[0]);
  const lat2 = toRadians(b[0]);

  const haversineTerm =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return (
    2 *
    earthRadius *
    Math.atan2(Math.sqrt(haversineTerm), Math.sqrt(1 - haversineTerm))
  );
};

const groupNearbyBoulders = (input: IBoulder[]) => {
  return input.reduce<MarkerCluster[]>((clusters, boulder) => {
    const current: [number, number] = [
      boulder.coordinates.lat,
      boulder.coordinates.lng,
    ];

    const existingCluster = clusters.find(
      (cluster) =>
        distanceInMeters(cluster.center, current) <=
        MARKER_GROUP_DISTANCE_METERS,
    );

    if (!existingCluster) {
      clusters.push({
        boulders: [boulder],
        center: current,
      });
      return clusters;
    }

    existingCluster.boulders.push(boulder);

    const count = existingCluster.boulders.length;
    const previousCount = count - 1;

    existingCluster.center = [
      (existingCluster.center[0] * previousCount + current[0]) / count,
      (existingCluster.center[1] * previousCount + current[1]) / count,
    ];

    return clusters;
  }, []);
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

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

  const defaultCenter: [number, number] = [57.7089, 11.9746];
  const center: [number, number] =
    boulders.length > 0
      ? [boulders[0].coordinates.lat, boulders[0].coordinates.lng]
      : defaultCenter;

  const mapHeight = isFullScreen ? "100%" : "400px";
  const marginBottom = isFullScreen ? "0" : "2rem";
  const borderRadius = isFullScreen ? "0" : "10px";
  const markerClusters = groupNearbyBoulders(boulders);

  const handleMarkerClick = (cluster: MarkerCluster) => {
    setSelectedBoulder(cluster.boulders[0] ?? null);
    setIsDetailsPanelOpen(true);
  };

  const handleOpenBoulderDetails = (boulder: IBoulder) => {
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
        borderRadius: isFullScreen ? 0 : "12px",
        overflow: "hidden",
        boxShadow: isFullScreen ? "none" : "0 4px 12px rgba(0,0,0,0.15)",
        border: isFullScreen ? "none" : "2px solid #e0e0e0",
      }}
    >
      <MapContainer
        center={center}
        zoom={11}
        zoomControl={!isMobile}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: borderRadius }}
      >
        <FlyToBoulder boulder={focusBoulder} />
        <FlyToLocation coordinates={focusLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerClusters.map((cluster) => (
          <Marker
            key={cluster.boulders.map((item) => item._id).join("-")}
            icon={BoulderMarkerIcon}
            position={cluster.center}
            eventHandlers={{
              click: () => handleMarkerClick(cluster),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              {cluster.boulders.length > 1
                ? `${cluster.boulders.length} boulders`
                : cluster.boulders[0].name}
            </Tooltip>
            <Popup>
              <Box
                sx={{
                  width: cluster.boulders.length > 1 ? 300 : 220,
                  maxWidth: "min(72vw, 320px)",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {cluster.boulders.length > 1
                    ? `${cluster.boulders.length} nearby boulders`
                    : cluster.boulders[0].name}
                </Typography>
                {cluster.boulders.length > 1 ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Klicka på en boulder för detaljer
                    </Typography>
                    {cluster.boulders.map((item) => (
                      <Box
                        key={item._id}
                        component="button"
                        type="button"
                        onClick={() => handleOpenBoulderDetails(item)}
                        sx={{
                          width: "100%",
                          textAlign: "left",
                          display: "block",
                          background: "rgba(255,255,255,0.74)",
                          py: 0.8,
                          px: 1,
                          borderRadius: 1.5,
                          cursor: "pointer",
                          color: "text.secondary",
                          mb: 0.75,
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.06)",
                            color: "text.primary",
                          },
                        }}
                      >
                        <Typography variant="body2">
                          {item.name} - {item.grade}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {cluster.boulders[0].location} -{" "}
                      {cluster.boulders[0].grade}
                    </Typography>
                    <Box
                      component="button"
                      type="button"
                      onClick={() =>
                        handleOpenBoulderDetails(cluster.boulders[0])
                      }
                      sx={{
                        mt: 1,
                        border: "none",
                        p: 0,
                        background: "transparent",
                        color: "primary.main",
                        cursor: "pointer",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      Visa detaljer
                    </Box>
                  </>
                )}
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
