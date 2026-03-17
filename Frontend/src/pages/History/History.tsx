import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trophy, MessageSquare, Hash, Calendar } from "lucide-react";

const History = () => {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history");
        if (response.data.success) {
          setHistoryRecords(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="history-container">
      <h1>Climbing History</h1>
      {historyRecords.length === 0 ? (
        <p>No history records found.</p>
      ) : (
        <ul className="history-list">
          {historyRecords.map((record: any) => (
            <li key={record._id} className="history-item">
              <div className="history-header">
                <h2>
                  {record.boulder.name} ({record.boulder.grade})
                </h2>
                <span className="history-date">
                  <Calendar size={16} />{" "}
                  {new Date(record.completedAt).toLocaleDateString()}
                </span>
              </div>
              {record.style && (
                <div className="history-style">
                  <Hash size={16} /> {record.style}
                </div>
              )}
              {record.attempts !== undefined && (
                <div className="history-attempts">
                  <Trophy size={16} /> {record.attempts} attempts
                </div>
              )}
              {record.comment && (
                <div className="history-comment">
                  <MessageSquare size={16} /> {record.comment}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
