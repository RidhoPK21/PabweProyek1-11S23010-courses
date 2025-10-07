// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          CoursesApp
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {token && (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/add-course" className="nav-link">
                    Tambah Course
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div>
            {token ? (
              <>
                {/* ✅ TOMBOL BARU: Profile */}
                <Link to="/profile" className="btn btn-outline-info me-2">
                  Profile
                </Link>
                <button
                  className="btn btn-outline-light"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_id"); // Hapus user_id untuk keamanan
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-warning">
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
