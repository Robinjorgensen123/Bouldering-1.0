import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const AddBoulder = lazy(() => import("../pages/AddBoulder/AddBoulder"));
const Home = lazy(() => import("../pages/Home/Home"));
const Map = lazy(() => import("../pages/Map/Map"));
const UserSettings = lazy(() => import("../pages/UserSettings/UserSettings"));
const History = lazy(() => import("../pages/History/History"));

const RouteFallback = () => (
  <Box
    sx={{
      minHeight: "50vh",
      display: "grid",
      placeItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/**Open routes */}
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/**Protected Routes*/}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddBoulder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
