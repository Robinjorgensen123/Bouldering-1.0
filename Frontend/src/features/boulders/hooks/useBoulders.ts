import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { fetchBoulders as fetchBoulderList } from "../services/boulderApi";
import { groupBouldersByLocation } from "../utils/boulderHelpers";
import type { IBoulder, LocationGroup } from "../types/boulder.types";

export const useBoulders = () => {
  const [allBoulders, setAllBoulders] = useState<IBoulder[]>([]);
  const [groups, setGroups] = useState<LocationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const loadBoulders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetchBoulderList();
      const data = response.data;
      if (Array.isArray(data)) {
        setAllBoulders(data);
        setGroups(groupBouldersByLocation(data));
      }
    } catch (err) {
      setError("Could not load boulders.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBoulders();
  }, [loadBoulders]);

  return { allBoulders, groups, loading, error, refresh: loadBoulders };
};
