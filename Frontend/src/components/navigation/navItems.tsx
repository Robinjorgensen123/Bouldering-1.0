import { Home, Map, History, PlusSquare, Settings } from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  showInBottomNav?: boolean;
}

export const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: <Home size={20} />, end: true },
  { to: "/map", label: "Map", icon: <Map size={20} />, showInBottomNav: true },
  {
    to: "/history",
    label: "History",
    icon: <History size={20} />,
    showInBottomNav: true,
  },
  {
    to: "/add",
    label: "Add New Boulder",
    icon: <PlusSquare size={20} />,
    showInBottomNav: true,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: <Settings size={20} />,
    showInBottomNav: true,
  },
];
