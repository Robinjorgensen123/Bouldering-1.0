import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const app = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <div className="min-h-screen bg-grey-50">
      <Routes>
        {/**Login Page */}
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
};
