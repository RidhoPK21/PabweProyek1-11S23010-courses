// src/features/courses/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";
import ContentManager from "../components/ContentManager";
import CourseActions from "../components/CourseActions";
import ChangeCover from "../components/ChangeCover";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourse = async () => {
    console.log("FUNGSI loadCourse DI CourseDetailPage TERPANGGIL!");

    setLoading(true);
    setError("");
    try {
      const res = await CourseApi.getCourseById(id);
      console.log("DATA MENTAH DARI API:", res);

      if (res.success) {
        const actualCourseData = res.data.course || res.data;

        // ✅ PERBAIKAN PENTING: Penanganan daftar siswa yang lebih sederhana
        // Agar ID selalu terdeteksi sebagai angka.
        const students = (actualCourseData.students || [])
          .map((item) => {
            const studentId =
              typeof item === "number"
                ? item // Jika item adalah angka (misal: [3, 105])
                : item.id; // Jika item adalah objek (misal: [{id: 3}, ...])
            return {
              id: Number(studentId), // Pastikan selalu number
              name: `Siswa ID: ${studentId}`, // Hanya untuk display
            };
          })
          .filter((student) => student.id); // Filter out null/undefined IDs

        const courseData = {
          ...actualCourseData,
          contents: actualCourseData.contents || [],
          students: students,
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

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Ulasan Kursus</h2>
          {course.ratings && course.ratings.length > 0 ? (
            <ul className="list-group list-group-flush">
              {course.ratings.map((rating, index) => (
                <li key={index} className="list-group-item">
                  <strong>{rating.name}</strong>
                  <p className="mb-1">Rating: {"‚≠ê".repeat(rating.ratings)}</p>
                  <p className="mb-0 fst-italic">"{rating.comment}"</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada ulasan untuk kursus ini.</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <ContentManager
            contents={course.contents || []}
            courseId={id}
            onDataChange={loadCourse}
          />
        </div>
        <div className="col-md-4">
          <CourseActions course={course} onDataChange={loadCourse} />
        </div>
      </div>
    </div>
  );
}
