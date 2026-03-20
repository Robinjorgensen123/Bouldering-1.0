import { useMemo } from "react";
import { type IBoulder } from "../types/Boulder.types";

export interface LocationGroup {
  locationKey: string;
  boulders: IBoulder[];
}

export const useLocationGroups = (boulders: IBoulder[]) => {
  const groups = useMemo(() => {
    const groupedByLocation: { [key: string]: IBoulder[] } = {};

    boulders.forEach((boulder) => {
      const key = boulder.location || "Unknown Location";
      if (!groupedByLocation[key]) groupedByLocation[key] = [];
      groupedByLocation[key].push(boulder);
    });

    return Object.keys(groupedByLocation).map((key) => ({
      locationKey: key,
      boulders: groupedByLocation[key],
    }));
  }, [boulders]);

  return { groups };
};
