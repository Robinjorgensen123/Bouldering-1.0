import { useEffect, useState } from "react";
import api from "../../../services/api";

export interface HistoryLog {
  _id: string;
  ascentType?: string;
  attempts?: number;
  comment?: string;
  completedAt?: string;
  user?: {
    username?: string;
    email?: string;
  };
}

export const useBoulderHistory = (boulderId?: string) => {
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchBoulderHistory = async () => {
      if (!boulderId) {
        setHistoryLogs([]);
        return;
      }

      setLoadingLogs(true);
      try {
        const response = await api.get<{
          success: boolean;
          data: HistoryLog[];
        }>(`/history/boulder/${boulderId}`);
        if (response.data.success) {
          setHistoryLogs(response.data.data || []);
        }
      } catch (error) {
        console.error("Could not fetch boulder history", error);
        setHistoryLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchBoulderHistory();
  }, [boulderId]);

  return { historyLogs, loadingLogs };
};
