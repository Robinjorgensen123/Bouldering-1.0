import { useState, useEffect } from "react";
import BoulderMap from "../../components/BoulderMap/BoulderMap";
import api from "../../services/api";
import { IBoulder } from "../../types/Boulder.types";
import "./Map.scss";

const Map = () => {
  const [boulders, setBoulders] = useState<IBoulder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoulders = async () => {
      try {
        const response = await api.get("/boulders");
        if (response.data.success) {
          setBoulders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching boulders for map", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoulders();
  }, []);

  if (loading) return <div>Loading map...</div>;

  return (
    <div className="map-page-wrapper">
      <BoulderMap boulders={boulders} isFullScreen={true} />
    </div>
  );
};

export default Map;
