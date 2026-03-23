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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { IBoulder } from "../types/boulder.types";
import BoulderDetailsPanel from "./BoulderDetailsPanel";

const BoulderMarkerIcon = L.divIcon({
  className: "boulder-marker-shell",
  html: '<span class="boulder-marker-core"><span class="boulder-marker-ridge"></span><span class="boulder-marker-chip boulder-marker-chip-one"></span><span class="boulder-marker-chip boulder-marker-chip-two"></span><span class="boulder-marker-crack"></span></span>',
  iconSize: [40, 36],
  iconAnchor: [20, 22],
  popupAnchor: [0, -18],
});

interface Props {
  boulders: IBoulder[];
  isFullScreen?: boolean;
  focusBoulder?: IBoulder | null;
  focusLocation?: [number, number] | null;
}

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
        borderRadius: isFullScreen ? 0 : "12px",
        overflow: "hidden",
        boxShadow: isFullScreen ? "none" : "0 4px 12px rgba(0,0,0,0.15)",
        border: isFullScreen ? "none" : "2px solid #e0e0e0",
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
        {boulders.map((boulder) => (
          <Marker
            key={boulder._id}
            icon={BoulderMarkerIcon}
            position={[boulder.coordinates.lat, boulder.coordinates.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(boulder),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              {boulder.name}
            </Tooltip>
            <Popup>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {boulder.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {boulder.location} - {boulder.grade}
                </Typography>
                <Link to={`/boulder/${boulder._id}`}>Visa detaljer</Link>
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
