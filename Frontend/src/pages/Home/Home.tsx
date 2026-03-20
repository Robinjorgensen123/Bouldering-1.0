import React from "react";
import { Box } from "@mui/material";
import BoulderMap from "../../components/BoulderMap/BoulderMap";
import { HomeHero } from "../../features/home/HomeHero";
import { LocationGrid } from "../../features/home/LocationGrid";
import { SpotModal } from "../../features/home/SpotModal";
import { BoulderDetailModal } from "../../features/home/BoulderDetailModal";
import { useDeviceType } from "../../hooks/useDeviceType";
import { useBoulderGroups } from "../../features/home/hooks/useBoulderGroups";
import { useBoulderHistory } from "../../features/home/hooks/useBoulderHistory";
import { useHomeSelection } from "../../features/home/hooks/useHomeSelection";
import { useHomeView } from "../../features/home/hooks/useHomeView";
import { useHomeStats } from "../../features/home/hooks/useHomeStats";

const Home: React.FC = () => {
  const { isMobile } = useDeviceType();
  const { allBoulders, groups } = useBoulderGroups();
  const { view, setView, isMapView } = useHomeView();
  const {
    selectedGroup,
    selectedBoulder,
    openGroup,
    closeSpot,
    openBoulder,
    closeBoulder,
  } = useHomeSelection(groups);
  const { historyLogs, loadingLogs } = useBoulderHistory(selectedBoulder?._id);
  const { totalAreas, totalBoulders } = useHomeStats(allBoulders, groups);

  return (
    <Box
      sx={{
        px: isMobile ? 1.25 : { xs: 2, md: 4 },
        py: isMobile ? 2 : 3,
        background:
          "radial-gradient(circle at 0% 0%, rgba(255,183,77,0.16), transparent 40%), radial-gradient(circle at 100% 100%, rgba(20,90,70,0.14), transparent 35%)",
      }}
    >
      <HomeHero
        totalAreas={totalAreas}
        totalBoulders={totalBoulders}
        view={view}
        onViewChange={setView}
      />

      {isMapView ? (
        <BoulderMap boulders={allBoulders} />
      ) : (
        <LocationGrid groups={groups} onSelectGroup={openGroup} />
      )}

      {selectedGroup && (
        <SpotModal
          group={selectedGroup}
          onClose={closeSpot}
          onSelectBoulder={openBoulder}
        />
      )}

      {selectedBoulder && (
        <BoulderDetailModal
          boulder={selectedBoulder}
          historyLogs={historyLogs}
          loadingLogs={loadingLogs}
          onClose={closeBoulder}
        />
      )}
    </Box>
  );
};

export default Home;
