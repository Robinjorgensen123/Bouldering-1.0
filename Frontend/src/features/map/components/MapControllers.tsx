import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { type IBoulder } from "../../boulders/types/boulder.types";

export const FlyToBoulder = ({
	boulder,
}: {
	boulder: IBoulder | null | undefined;
}) => {
	const map = useMap();

	useEffect(() => {
		if (!boulder) return;

		map.flyTo([boulder.coordinates.lat, boulder.coordinates.lng], 14, {
			duration: 0.8,
		});
	}, [map, boulder?._id]);

	return null;
};

export const FlyToLocation = ({
	coordinates,
}: {
	coordinates: [number, number] | null | undefined;
}) => {
	const map = useMap();

	useEffect(() => {
		if (!coordinates) return;

		map.flyTo(coordinates, 12, {
			duration: 0.8,
		});
	}, [map, coordinates]);

	return null;
};
