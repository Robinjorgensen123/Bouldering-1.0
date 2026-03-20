import { useEffect, useState } from "react";
import { type LocationGroup } from "./useBoulderGroups";
import { type IBoulder } from "../../../types/Boulder.types";

export const useHomeSelection = (groups: LocationGroup[]) => {
  const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(
    null,
  );
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);

  useEffect(() => {
    if (!selectedGroup) return;

    const updatedGroup = groups.find(
      (group) => group.locationKey === selectedGroup.locationKey,
    );

    setSelectedGroup(updatedGroup ?? null);
  }, [groups, selectedGroup?.locationKey]);

  const openGroup = (group: LocationGroup) => {
    setSelectedBoulder(null);
    setSelectedGroup(group);
  };

  const closeSpot = () => {
    setSelectedBoulder(null);
    setSelectedGroup(null);
  };

  const openBoulder = (boulder: IBoulder) => {
    setSelectedBoulder(boulder);
  };

  const closeBoulder = () => {
    setSelectedBoulder(null);
  };

  return {
    selectedGroup,
    selectedBoulder,
    openGroup,
    closeSpot,
    openBoulder,
    closeBoulder,
  };
};
