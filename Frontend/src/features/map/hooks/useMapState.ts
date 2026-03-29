import { useEffect, useState } from "react";
import { type IBoulder } from "../../boulders/types/boulder.types";
import { type MarkerCluster } from "../utils/mapUtils";

interface UseMapStateProps {
  boulders: IBoulder[];
  focusBoulder?: IBoulder | null;
}

export function useMapState({
  boulders,
  focusBoulder = null,
}: UseMapStateProps) {
  const [selectedBoulder, setSelectedBoulder] = useState<IBoulder | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  useEffect(() => {
    if (!selectedBoulder?._id) return;
    const updatedBoulder = boulders.find((b) => b._id === selectedBoulder._id);
    setSelectedBoulder(updatedBoulder ?? null);
    if (!updatedBoulder) setIsDetailsPanelOpen(false);
  }, [boulders, selectedBoulder?._id]);

  useEffect(() => {
    if (!focusBoulder?._id) return;
    setSelectedBoulder(focusBoulder);
    setIsDetailsPanelOpen(true);
  }, [focusBoulder?._id]);

  const handleMarkerClick = (cluster: MarkerCluster) => {
    setSelectedBoulder(cluster.boulders[0] ?? null);
    setIsDetailsPanelOpen(true);
  };

  const handleOpenBoulderDetails = (boulder: IBoulder) => {
    setSelectedBoulder(boulder);
    setIsDetailsPanelOpen(true);
  };

  const handleCloseDetailsPanel = () => {
    setIsDetailsPanelOpen(false);
  };

  return {
    selectedBoulder,
    isDetailsPanelOpen,
    handleMarkerClick,
    handleOpenBoulderDetails,
    handleCloseDetailsPanel,
    setSelectedBoulder,
  };
}
