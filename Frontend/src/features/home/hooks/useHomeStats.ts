import { useMemo } from "react";
import { type LocationGroup } from "./useBoulderGroups";
import { type IBoulder } from "../../../types/Boulder.types";

export const useHomeStats = (
  allBoulders: IBoulder[],
  groups: LocationGroup[],
) => {
  return useMemo(
    () => ({
      totalAreas: groups.length,
      totalBoulders: allBoulders.length,
    }),
    [groups.length, allBoulders.length],
  );
};
