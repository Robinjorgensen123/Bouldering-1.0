import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IBoulder } from "../../types/Boulder.types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BoulderDetailsPanel from "../BoulderDetailsPanel/BoulderDetailsPanel";
import { Box, Typography } from "@mui/material";
const markerIcon = new URL(
  "leaflet/dist/images/marker-icon.png",
  import.meta.url,
).href;
const markerShadow = new URL(
  "leaflet/dist/images/marker-shadow.png",
  import.meta.url,
).href;

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

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

  //Default coordinates to Gothenburg
  const defaultCenter: [number, number] = [57.7089, 11.9746];
  const center: [number, number] =
    boulders.length > 0
      ? [boulders[0].coordinates.lat, boulders[0].coordinates.lng]
      : defaultCenter;

  const mapHeight = isFullScreen ? "100%" : "400px";
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
        {boulders.map((boulder) => (
          <Marker
            key={boulder._id}
            position={[boulder.coordinates.lat, boulder.coordinates.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(boulder),
            }}
          >
            <Popup>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {boulder.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {boulder.location} - {boulder.grade}
                </Typography>
                <Link to={`/boulder/${boulder._id}`}>Show Details</Link>
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
