import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material/styles";
import { useMapState } from "../hooks/useMapState";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { type IBoulder } from "../../boulders/types/boulder.types";
import BoulderDetailsPanel from "../../boulders/components/BoulderDetails/BoulderDetailsPanel";
import { BoulderMarkerIcon } from "./BoulderMarker";
import { groupNearbyBoulders } from "../utils/mapUtils";
import { FlyToBoulder, FlyToLocation } from "./MapControllers";

interface Props {
  boulders: IBoulder[];
  isFullScreen?: boolean;
  focusBoulder?: IBoulder | null;
  focusLocation?: [number, number] | null;
  onDeleted?: () => void;
}

const BoulderMap = ({
  boulders,
  isFullScreen = false,
  focusBoulder = null,
  focusLocation = null,
  onDeleted,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    selectedBoulder,
    isDetailsPanelOpen,
    handleMarkerClick,
    handleOpenBoulderDetails,
    handleCloseDetailsPanel,
  } = useMapState({ boulders, focusBoulder });

  const defaultCenter: [number, number] = [57.7089, 11.9746];
  const center: [number, number] =
    boulders.length > 0
      ? [boulders[0].coordinates.lat, boulders[0].coordinates.lng]
      : defaultCenter;

  const mapHeight = isFullScreen ? "100%" : "400px";
  const marginBottom = isFullScreen ? "0" : "2rem";
  const borderRadius = isFullScreen ? "0" : "10px";
  const markerClusters = groupNearbyBoulders(boulders);

  // Hanteras nu av useMapState

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
        onClose={handleCloseDetailsPanel}
        onDeleted={onDeleted}
      />
    </Box>
  );
};

export default BoulderMap;
