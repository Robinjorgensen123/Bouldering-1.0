import { useBoulderCollection } from "../../../hooks/useBoulderCollection";
import {
  useLocationGroups,
  type LocationGroup,
} from "../../../hooks/useLocationGroups";

export type { LocationGroup };

export const useBoulderGroups = () => {
  const { allBoulders } = useBoulderCollection();
  const { groups } = useLocationGroups(allBoulders);

  return { allBoulders, groups };
};
