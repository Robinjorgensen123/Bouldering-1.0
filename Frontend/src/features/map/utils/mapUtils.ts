import { type IBoulder } from "../../boulders/types/boulder.types";

export interface MarkerCluster {
  boulders: IBoulder[];
  center: [number, number];
}

const MARKER_GROUP_DISTANCE_METERS = 20;

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceInMeters = (a: [number, number], b: [number, number]) => {
  const earthRadius = 6371000;
  const dLat = toRadians(b[0] - a[0]);
  const dLng = toRadians(b[1] - a[1]);
  const lat1 = toRadians(a[0]);
  const lat2 = toRadians(b[0]);

  const haversineTerm =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return (
    2 *
    earthRadius *
    Math.atan2(Math.sqrt(haversineTerm), Math.sqrt(1 - haversineTerm))
  );
};

export const groupNearbyBoulders = (input: IBoulder[]) => {
  return input.reduce<MarkerCluster[]>((clusters, boulder) => {
    const current: [number, number] = [
      boulder.coordinates.lat,
      boulder.coordinates.lng,
    ];

    const existingCluster = clusters.find(
      (cluster) =>
        distanceInMeters(cluster.center, current) <=
        MARKER_GROUP_DISTANCE_METERS,
    );

    if (!existingCluster) {
      clusters.push({
        boulders: [boulder],
        center: current,
      });
      return clusters;
    }

    existingCluster.boulders.push(boulder);

    const count = existingCluster.boulders.length;
    const previousCount = count - 1;

    existingCluster.center = [
      (existingCluster.center[0] * previousCount + current[0]) / count,
      (existingCluster.center[1] * previousCount + current[1]) / count,
    ];

    return clusters;
  }, []);
};
