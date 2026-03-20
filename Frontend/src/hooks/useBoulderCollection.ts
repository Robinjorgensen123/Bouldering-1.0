import { useEffect, useState } from "react";
import api from "../services/api";
import { type IBoulder } from "../types/Boulder.types";
import { useAuth } from "./useAuth";

interface ApiResponse {
  success: boolean;
  data: IBoulder[];
}

export const useBoulderCollection = () => {
  const { token, user } = useAuth();
  const [allBoulders, setAllBoulders] = useState<IBoulder[]>([]);

  useEffect(() => {
    const fetchBoulders = async () => {
      if (!token) return;

      try {
        const response = await api.get<ApiResponse>("/boulders");
        const boulderData = response.data.data;

        if (Array.isArray(boulderData)) {
          setAllBoulders(boulderData);
        }
      } catch (err) {
        console.error("Kunde inte hämta data:", err);
      }
    };

    fetchBoulders();
  }, [token, user?.gradingSystem]);

  return { allBoulders };
};
