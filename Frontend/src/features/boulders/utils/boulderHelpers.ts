import type { IBoulder, LocationGroup } from "../types/boulder.types";

export const groupBouldersByLocation = (
  boulders: IBoulder[],
): LocationGroup[] => {
  const map: Record<string, IBoulder[]> = {};

  boulders.forEach((boulder) => {
    const key = boulder.location || "Unknown Location";
    if (!map[key]) map[key] = [];
    map[key].push(boulder);
  });

  return Object.keys(map).map((key) => ({
    locationKey: key,
    boulders: map[key],
  }));
};
