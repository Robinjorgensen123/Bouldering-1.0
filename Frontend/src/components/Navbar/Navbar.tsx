import { NavLink } from "react-router-dom";
import { Map, PlusSquare, Home, Settings, History } from "lucide-react";
import { AppBar, Toolbar, Box, Button, Chip, Typography } from "@mui/material";

const Navbar = () => {
  const navItems = [
    { to: "/", label: "Home", icon: <Home size={20} />, end: true },
    { to: "/map", label: "Map", icon: <Map size={20} /> },
    { to: "/history", label: "History", icon: <History size={20} /> },
    { to: "/add", label: "Add New Boulder", icon: <PlusSquare size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 2, md: 3 },
          py: 1.5,
        }}
      >
        <Box
          component={NavLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(201,107,50,0.18), rgba(53,92,77,0.22))",
              border: "1px solid rgba(91, 69, 52, 0.12)",
              display: "grid",
              placeItems: "center",
              fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
              fontWeight: 700,
            }}
          >
            B
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1}>
              Bouldering App
            </Typography>
            <Chip
              label="Version 1.0"
              size="small"
              variant="outlined"
              sx={{ mt: 0.75, height: 24 }}
            />
          </Box>
        </Box>

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
                textTransform: "none",
                justifyContent: "flex-start",
                px: 1.8,
                bgcolor: "rgba(255,255,255,0.46)",
                border: "1px solid rgba(91, 69, 52, 0.1)",
                width: { xs: "calc(50% - 4px)", sm: "auto" },
                "&.active": {
                  color: "primary.dark",
                  fontWeight: "bold",
                  bgcolor: "rgba(201,107,50,0.14)",
                  borderColor: "rgba(201,107,50,0.24)",
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
