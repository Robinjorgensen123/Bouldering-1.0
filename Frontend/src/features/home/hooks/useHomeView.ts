import { useState } from "react";

export type HomeView = "grid" | "map";

export const useHomeView = (initialView: HomeView = "grid") => {
  const [view, setView] = useState<HomeView>(initialView);

  return {
    view,
    setView,
    isMapView: view === "map",
  };
};
