// src/features/courses/pages/CourseListPage.jsx
import React, { useEffect, useState } from "react";
import CourseApi from "../../../api/CourseApi";
import CourseCard from "../components/CourseCard";
import { Link } from "react-router-dom";

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await CourseApi.getCourses();
        console.log("📦 Get Courses Response:", res);

        // Sesuaikan dengan struktur data dari API Delcom
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.courses)) {
          data = res.data.courses;
        }

        setCourses(data);
      } catch (err) {
        console.error("❌ Error fetch courses:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Courses</h2>
        {/* <Link to="/add-course" className="btn btn-success">
          + Tambah Course
        </Link> */}
      </div>

      {courses.length === 0 && (
        <div className="alert alert-info">Tidak ada courses tersedia</div>
      )}

      <div className="row">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
