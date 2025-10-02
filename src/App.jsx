import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CourseListPage from "./features/courses/pages/CourseListPage";
import CourseDetailPage from "./features/courses/pages/CourseDetailPage";
import AddCoursePage from "./features/courses/pages/AddCoursePage";
import UpdateCoursePage from "./features/courses/pages/UpdateCoursePage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<CourseListPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/add-course" element={<AddCoursePage />} />
        <Route path="/update-course/:id" element={<UpdateCoursePage />} />
      </Routes>
    </>
  );
}

export default App;
