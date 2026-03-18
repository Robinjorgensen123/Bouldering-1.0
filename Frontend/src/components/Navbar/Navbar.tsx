import { NavLink } from "react-router-dom";
import { Map, PlusSquare, Home, Settings } from "lucide-react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";

const Navbar = () => {
  const navItems = [
    { to: "/", label: "Home", icon: <Home size={20} />, end: true },
    { to: "/map", label: "Map", icon: <Map size={20} /> },
    { to: "/add", label: "Add New Boulder", icon: <PlusSquare size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          component={NavLink}
          to="/"
          variant="h6"
          fontWeight="bold"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          Bouldering App{" "}
          <Typography component="span" variant="caption" color="text.secondary">
            Version 1.0
          </Typography>
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
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
                textTransform: "none",
                "&.active": {
                  color: "primary.main",
                  fontWeight: "bold",
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
