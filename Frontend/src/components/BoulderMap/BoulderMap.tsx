import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BoulderMap.scss";
import { IBoulder } from "../../types/Boulder.types";
import { Link } from "react-router-dom";
const markerIcon = new URL(
  "leaflet/dist/images/marker-icon.png",
  import.meta.url
).href;
const markerShadow = new URL(
  "leaflet/dist/images/marker-shadow.png",
  import.meta.url
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
}

const BoulderMap = ({ boulders }: Props) => {
  //Default coordinates to Gothenburg
  const defaultCenter: [number, number] = [57.7089, 11.9746];

  const center: [number, number] =
    boulders.length > 0
      ? [boulders[0].coordinates.lat, boulders[0].coordinates.lng]
      : defaultCenter;

  return (
    <div
      className="boulder-map-wrapper"
      style={{ height: "400px", width: "100%", marginBottom: "2rem" }}
      data-testid="map-wrapper"
    >
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {boulders.map((boulder) => (
          <Marker
            key={boulder._id}
            position={[boulder.coordinates.lat, boulder.coordinates.lng]}
          >
            <Popup>
              <div className="map-popup">
                <h3>{boulder.name}</h3>
                <p>
                  {boulder.location} - {boulder.grade}
                </p>
                <Link to={`/boulder/${boulder._id}`}>Visa detaljer</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BoulderMap;
