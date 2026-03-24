import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Map,
  PlusSquare,
  Home,
  Settings,
  History,
  Menu,
  X,
} from "lucide-react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Chip,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const MOBILE_NAV_ENABLED = true;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
          alignItems: "center",
          flexDirection: "row",
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
              label="Version 1.6"
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
            width: "auto",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "flex-end",
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

          {MOBILE_NAV_ENABLED && !isDesktop && (
            <>
              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setIsMobileMenuOpen(true)}
                sx={{
                  border: "1px solid rgba(91, 69, 52, 0.15)",
                  bgcolor: "rgba(255,255,255,0.55)",
                }}
              >
                <Menu size={20} />
              </IconButton>

              <Drawer
                anchor="right"
                open={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                slotProps={{
                  paper: {
                    sx: {
                      width: "min(88vw, 320px)",
                      p: 1.5,
                      borderTopLeftRadius: 16,
                      borderBottomLeftRadius: 16,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Menu
                  </Typography>
                  <IconButton
                    aria-label="Close navigation menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X size={18} />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <List disablePadding>
                  {navItems.map(({ to, label, icon, end }) => (
                    <ListItem key={to} disablePadding sx={{ mb: 0.75 }}>
                      <ListItemButton
                        component={NavLink}
                        to={to}
                        end={end}
                        onClick={() => setIsMobileMenuOpen(false)}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid rgba(91, 69, 52, 0.1)",
                          "&.active": {
                            bgcolor: "rgba(201,107,50,0.14)",
                            borderColor: "rgba(201,107,50,0.24)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
