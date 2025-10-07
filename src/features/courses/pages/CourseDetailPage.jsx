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

  const loadCourse = async () => {
    console.log("✅ FUNGSI loadCourse DI CourseDetailPage TERPANGGIL!");

    setLoading(true);
    setError("");
    try {
      const res = await CourseApi.getCourseById(id);
      console.log("📦 DATA MENTAH DARI API:", res);

      if (res.success) {
        const actualCourseData = res.data.course || res.data;

        // ✅ PERBAIKAN: Mengubah ID numerik menjadi objek { id, name }
        const students = (actualCourseData.students || [])
          // Filter untuk memastikan hanya ID numerik yang diproses
          .filter((item) => typeof item === "number" || (item && item.id))
          .map((item) => {
            const studentId = typeof item === "number" ? item : item.id;

            // ✅ Menggunakan ID Siswa sebagai Nama Tampilan
            // Jika Anda tahu nama siswa ini, Anda bisa membuatnya permanen di sini
            // Namun, cara paling aman adalah menggunakan User ID sebagai nama sementara.
            return {
              id: studentId,
              name: `Siswa ID: ${studentId}` // Tampilkan ID sebagai nama
            };
          });

        const courseData = {
          ...actualCourseData,
          contents: actualCourseData.contents || [],
          students: students, // Gunakan array objek yang sudah diperbaiki
        };
        setCourse(courseData);
      } else {
        throw new Error(res.message || "Gagal memuat data kursus.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        {/* ... sisa JSX ... */}
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
