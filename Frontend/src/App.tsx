import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import MobileBottomNav from "./components/MobileBottomNav/MobileBottomNav";
import { Box, Container } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isMapRoute = location.pathname === "/map";

  return (
    <Box
      className="page-shell"
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />

      {isMapRoute ? (
        <Box component="main" sx={{ flex: 1, pb: { xs: 10, md: 0 } }}>
          <AppRoutes />
        </Box>
      ) : (
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            flex: 1,
            py: { xs: 2.5, md: 4 },
            px: { xs: 2, md: 3 },
            pb: { xs: 12, md: 4 },
          }}
        >
          <AppRoutes />
        </Container>
      )}

      {isMobile && <MobileBottomNav />}
    </Box>
  );
};

export default App;
