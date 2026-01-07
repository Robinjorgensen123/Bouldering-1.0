import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AddBoulder from "../pages/AddBoulder/AddBoulder";
import Home from "../pages/Home/Home";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/**Open routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/**Protected Routes*/}
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddBoulder />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
