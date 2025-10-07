// src/features/courses/pages/UpdateCoursePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Tambah useNavigate
import CourseApi from "../../../api/CourseApi"; // ✅ Ganti ke CourseApi
import CourseForm from "../components/CourseForm";

export default function UpdateCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Inisialisasi navigate
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ✅ Gunakan CourseApi untuk mengambil data awal
    CourseApi.getCourseById(id).then((res) => setCourse(res.data));
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      // ✅ Panggil CourseApi.updateCourse
      await CourseApi.updateCourse(id, formData);
      setMessage("✅ Course berhasil diupdate!");
      setTimeout(() => navigate("/"), 1500); // Redirect setelah update
    } catch (err) {
      setMessage("❌ Gagal update course: " + err.message);
      console.error(err);
    }
  };

  if (!course) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="mb-4">
        <Link to={`/courses/${id}`} className="btn btn-outline-secondary">
          &larr; Batal
        </Link>
      </div>
      <div className="card p-4">
        <h2 className="mb-4 fw-bold">Update Course</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <CourseForm
          initialData={course}
          onSubmit={handleUpdate}
          submitText="Update Course"
        />
      </div>
    </div>
  );
}