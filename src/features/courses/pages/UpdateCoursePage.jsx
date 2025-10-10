import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";
import CourseForm from "../components/CourseForm";

export default function UpdateCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    CourseApi.getCourseById(id)
      // ======================================================
      // == PERBAIKAN UTAMA ADA DI BARIS INI ==
      //    Kita pastikan untuk mengambil objek kursus yang benar
      // ======================================================
      .then((res) => setCourse(res.data.course || res.data))
      .catch((err) => {
        console.error("Gagal memuat kursus:", err);
        setMessage("❌ Gagal memuat data kursus untuk diedit.");
      });
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await CourseApi.updateCourse(id, formData);
      setMessage("✅ Course berhasil diperbarui!");
      setTimeout(() => navigate(`/courses/${id}`), 1500);
    } catch (err) {
      setMessage("❌ Gagal update course: " + err.message);
    }
  };

  // Tampilkan loading saat 'course' masih null
  if (!course) {
    return <div className="container-fluid">Loading course data...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="card p-4" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 className="fw-bold mb-4">Update Course</h1>
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
