import React, { useEffect, useState } from "react";
import { type IBoulder } from "../../types/Boulder.types";
import "./Home.scss";
import { Link } from "react-router-dom";
import BoulderMap from "../../components/BoulderMap/BoulderMap";

interface ApiResponse {
  success: boolean;
  data: IBoulder[];
}

interface LocationGroup {
  locationKey: string;
  boulders: IBoulder[];
}

const Home: React.FC = () => {
  const [allBoulders, setAllBoulders] = useState<IBoulder[]>([]);
  const [groups, setGroups] = useState<LocationGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null
  );
  const [view, setView] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const fetchBoulders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/boulders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Not logged in, or token expired");
          return;
        }

        const jsonResponse: ApiResponse = await response.json();
        const boulderData = jsonResponse.data;

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
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Boulder Areas</h1>
        <div className="view-toggle">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            List
          </button>
          <button
            className={view === "map" ? "active" : ""}
            onClick={() => setView("map")}
          >
            Map
          </button>
        </div>
      </header>

      {view === "map" ? (
        <BoulderMap boulders={allBoulders} />
      ) : (
        <div className="location-grid">
          {groups.map((group) => (
            <div
              key={group.locationKey}
              className="location-card"
              onClick={() => setSelectedGroup(group)}
            >
              <img
                src={
                  group.boulders[0]?.imagesUrl
                    ? `http://localhost:5000${group.boulders[0].imagesUrl}`
                    : ""
                }
                alt="Area preview"
              />
              <div className="info">
                <p>{group.boulders.length} boulders at this location</p>
                <h3>Spot: {group.locationKey}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGroup && (
        <div className="modal-overlay" onClick={() => setSelectedGroup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Boulders at this spot</h2>
            <div className="boulder-list">
              {selectedGroup.boulders.map((b) => (
                <Link
                  key={b._id}
                  to={`/boulder/${b._id}`}
                  className="boulder-item"
                >
                  <h4>
                    {b.name} ({b.grade})
                  </h4>
                </Link>
              ))}
            </div>
            <button onClick={() => setSelectedGroup(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
