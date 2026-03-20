import { NavLink } from "react-router-dom";
import { Map, PlusSquare, Home, Settings, History } from "lucide-react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { useDeviceType } from "../../hooks/useDeviceType";

const Navbar = () => {
  const { isMobile } = useDeviceType();

  const navItems = [
    { to: "/", label: "Home", icon: <Home size={20} />, end: true },
    { to: "/map", label: "Map", icon: <Map size={20} /> },
    { to: "/history", label: "History", icon: <History size={20} /> },
    {
      to: "/add",
      label: isMobile ? "Add" : "Add New Boulder",
      icon: <PlusSquare size={20} />,
    },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          py: isMobile ? 0.9 : { xs: 1.1, md: 0.8 },
          gap: 1.25,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Typography
          component={NavLink}
          to="/"
          variant="h6"
          fontWeight={800}
          sx={{
            textDecoration: "none",
            color: "inherit",
            letterSpacing: -0.2,
          }}
        >
          Bouldering App{" "}
          <Typography component="span" variant="caption" color="text.secondary">
            Version 1.0
          </Typography>
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            width: { xs: "100%", md: "auto" },
          }}
        >
          {navItems.map(({ to, label, icon, end }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              end={end}
              startIcon={icon}
              color="inherit"
              disableRipple
              disableFocusRipple
              sx={{
                borderRadius: 99,
                px: isMobile ? 1.1 : 1.4,
                py: 0.6,
                bgcolor: "rgba(36,90,75,0.04)",
                "&.active": {
                  color: "primary.contrastText",
                  backgroundColor: "primary.main",
                  fontWeight: 800,
                },
                "&:hover": {
                  bgcolor: "rgba(36,90,75,0.12)",
                },
                "&.active:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
