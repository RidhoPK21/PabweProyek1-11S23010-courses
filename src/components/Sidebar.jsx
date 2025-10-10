import React from "react";
import { NavLink } from "react-router-dom";
// 1. Impor ikon baru untuk profil
import {
  HouseDoorFill,
  BookFill,
  PeopleFill,
  PersonCircle,
} from "react-bootstrap-icons";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <BookFill className="me-2" />
        CoursesApp
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <HouseDoorFill className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/courses" className="nav-item">
          <BookFill className="nav-icon" />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/users" className="nav-item">
          <PeopleFill className="nav-icon" />
          <span>Users</span>
        </NavLink>

        {/* 2. Tambahkan NavLink baru untuk Profile di sini */}
        <NavLink to="/profile" className="nav-item">
          <PersonCircle className="nav-icon" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
