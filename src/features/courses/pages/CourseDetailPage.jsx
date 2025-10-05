// src/features/courses/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";
import ContentManager from "../components/ContentManager";
import StudentManager from "../components/StudentManager";
import ChangeCover from "../components/ChangeCover";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hanya satu fungsi ini yang akan kita gunakan untuk memuat dan me-refresh semua data.
  const loadCourse = async () => {
    try {
      const res = await CourseApi.getCourseById(id);
      if (res.success) {
        setCourse(res.data);
      } else {
        throw new Error(res.message || "Gagal memuat data kursus.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      // Pastikan loading di-set false hanya pada load awal
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadCourse();
  }, [id]);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!course)
    return (
      <div className="container mt-5 alert alert-warning">
        Course tidak ditemukan.
      </div>
    );

  const coverUrl =
    course.cover && course.cover.startsWith("http")
      ? course.cover
      : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${course.cover}`;

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">
        &larr; Kembali ke Daftar
      </Link>

      <div className="card mb-4">
        <img
          src={coverUrl}
          className="card-img-top"
          alt={course.title}
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h1 className="card-title">{course.title}</h1>
          <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
            {course.description}
          </p>
        </div>
      </div>

      <ChangeCover courseId={id} onUploadSuccess={loadCourse} />

      <div className="row">
        <div className="col-md-8">
          <ContentManager
            contents={course.contents || []}
            courseId={id}
            onDataChange={loadCourse}
          />
        </div>
        <div className="col-md-4">
          <StudentManager
            students={course.students || []}
            courseId={id}
            onDataChange={loadCourse}
          />
        </div>
      </div>
    </div>
  );
}
