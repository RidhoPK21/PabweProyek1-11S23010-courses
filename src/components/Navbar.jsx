import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  // const token = localStorage.getItem("token"); // Dihapus

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          CoursesApp
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {/* Semua link dianggap ada (seperti saat token ada) */}
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
          </ul>
          {/* Bagian Login/Logout dihapus */}
        </div>
      </div>
    </nav>
  );
}
