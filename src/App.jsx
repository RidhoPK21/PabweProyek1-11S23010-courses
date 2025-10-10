import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";


// Import Halaman
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProfilePage from "./features/auth/pages/ProfilePage";
import CourseListPage from "./features/courses/pages/CourseListPage";
import CourseDetailPage from "./features/courses/pages/CourseDetailPage";
import AddCoursePage from "./features/courses/pages/AddCoursePage";
import UpdateCoursePage from "./features/courses/pages/UpdateCoursePage";
import ContentDetailPage from "./features/courses/pages/ContentDetailPage";
import UserListPage from "./features/users/pages/UserListPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// Komponen Layout Utama
const MainLayout = () => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      <Navbar /> {/* Topbar di dalam konten utama */}
      <Outlet /> {/* Halaman akan dirender di sini */}
    </main>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Rute tanpa Sidebar (Login & Register) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rute yang menggunakan MainLayout (dengan Sidebar) */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/add-course" element={<AddCoursePage />} />
        <Route path="/update-course/:id" element={<UpdateCoursePage />} />
        <Route path="/courses/:courseId/contents/:contentId" element={<ContentDetailPage />} />
        
        {/* Redirect halaman utama ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;