import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      color: isActive ? "#4f46e5" : "", // Warna primer kita
    };
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-bold"
          style={{ color: "#4f46e5" }}
        >
          CoursesApp
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {token && (
              <>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" style={navLinkStyles}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/add-course"
                    className="nav-link"
                    style={navLinkStyles}
                  >
                    Tambah Course
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/users"
                    className="nav-link"
                    style={navLinkStyles}
                  >
                    Daftar Pengguna
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div>
            {token ? (
              <>
                <Link to="/profile" className="btn btn-outline-secondary me-2">
                  Profile
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_id");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
