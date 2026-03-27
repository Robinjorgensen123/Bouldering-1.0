import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "../navigation/navItems";

const HIDDEN_PATHS = new Set(["/login", "/register", "/forgot-password"]);

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bottomNavItems = navItems.filter((item) => item.showInBottomNav);
  const value =
    bottomNavItems.find((item) => location.pathname.startsWith(item.to))?.to ||
    false;

  if (
    HIDDEN_PATHS.has(location.pathname) ||
    location.pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        borderTop: "1px solid rgba(91, 69, 52, 0.16)",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, nextValue: string) => navigate(nextValue)}
        sx={{
          minHeight: 64,
          pb: "max(env(safe-area-inset-bottom), 8px)",
          bgcolor: "rgba(255, 252, 247, 0.97)",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            maxWidth: "none",
            color: "text.secondary",
          },
          "& .Mui-selected": {
            color: "primary.main",
            fontWeight: 700,
          },
        }}
      >
        {bottomNavItems.map((item) => (
          <BottomNavigationAction
            key={item.to}
            label={item.label}
            value={item.to}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
