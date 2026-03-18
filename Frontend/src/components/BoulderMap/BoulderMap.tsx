import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IBoulder } from "../../types/Boulder.types";
import { Link } from "react-router-dom";
import { useState } from "react";
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
}

const BoulderMap = ({ boulders, isFullScreen = false }: Props) => {
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  //Default coordinates to Gothenburg
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
