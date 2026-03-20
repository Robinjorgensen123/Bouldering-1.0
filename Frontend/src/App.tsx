import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import { Box, Container } from "@mui/material";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  const isMapRoute = location.pathname === "/map";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {isMapRoute ? (
        <Box component="main" sx={{ flex: 1 }}>
          <AppRoutes />
        </Box>
      ) : (
        <Container
          component="main"
          maxWidth="lg"
          sx={{
            flex: 1,
            py: { xs: 2.5, md: 3.5 },
            px: { xs: 2, md: 3 },
          }}
        >
          <AppRoutes />
        </Container>
      )}
    </Box>
  );
};

export default App;
