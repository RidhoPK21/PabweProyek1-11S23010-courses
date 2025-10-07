// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CourseListPage from "./features/courses/pages/CourseListPage";
import CourseDetailPage from "./features/courses/pages/CourseDetailPage";
import AddCoursePage from "./features/courses/pages/AddCoursePage";
import UpdateCoursePage from "./features/courses/pages/UpdateCoursePage";
import ContentDetailPage from "./features/courses/pages/ContentDetailPage";
import ProfilePage from "./features/auth/pages/ProfilePage"; 


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Rute yang Dilindungi */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <CourseListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/:courseId/contents/:contentId"
          element={
            <PrivateRoute>
              <ContentDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <PrivateRoute>
              <CourseDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-course"
          element={
            <PrivateRoute>
              <AddCoursePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-course/:id"
          element={
            <PrivateRoute>
              <UpdateCoursePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
