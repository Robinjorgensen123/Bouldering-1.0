import { NavLink } from "react-router-dom";
import { Map, PlusSquare, Home, Settings } from "lucide-react";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Bouldering App<span> Version 1.0</span>
        </NavLink>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Map size={20} />
            <span>Map</span>
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <PlusSquare size={20} />
            <span>Add New Boulder</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
