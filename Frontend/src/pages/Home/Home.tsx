import React, { useEffect, useState } from "react";
import { Boulder } from "../../types/Boulder.types";
import "./Home.scss";

interface LocationGroup {
  locationKey: string;
  boulders: Boulder[];
}

const Home: React.FC = () => {
  const [groups, setGroups] = useState<LocationGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null
  );

  useEffect(() => {
    const fetchBoulders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/boulders");
        const data: Boulder[] = await response.json();

        const map: { [key: string]: Boulder[] } = {};

        data.forEach((boulder) => {
          const key = `${boulder.coordinates.lat},${boulder.coordinates.lng}`;

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
      } catch (err) {
        console.error("Kunde inte hämta data:", err);
      }
    };

    fetchBoulders();
  }, []);

  return (
    <div className="home-page">
      <h1>Boulder Areas</h1>
      <div className="location-grid">
        {groups.map((group) => (
          <div
            key={group.locationKey}
            className="location-card"
            onClick={() => setSelectedGroup(group)}
          >
            <img
              src={`http://localhost:5000${group.boulders[0].imageUrl}`}
              alt="Area preview"
            />
            <div className="info">
              <p>{group.boulders.length} boulders at this location</p>
              <h3>Spot: {group.locationKey}</h3>
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className="modal-overlay" onClick={() => setSelectedGroup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Boulders at this spot</h2>
            <div className="boulder-list">
              {selectedGroup.boulders.map((b) => (
                <div key={b._id} className="boulder-item">
                  <h4>
                    {b.name} ({b.grade})
                  </h4>
                </div>
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
