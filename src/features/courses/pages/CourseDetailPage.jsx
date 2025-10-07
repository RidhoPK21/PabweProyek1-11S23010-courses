// src/features/courses/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";
import ContentManager from "../components/ContentManager";
import CourseActions from "../components/CourseActions";
import ChangeCover from "../components/ChangeCover";
import { jwtDecode } from "jwt-decode"; // Harus terinstal: npm install jwt-decode

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null); // Tambah state user ID

  const loadCourse = async () => {
    console.log("✅ FUNGSI loadCourse DI CourseDetailPage TERPANGGIL!");

    setLoading(true);
    setError("");
    try {
      const res = await CourseApi.getCourseById(id);
      console.log("📦 DATA MENTAH DARI API:", res);

      if (res.success) {
        const actualCourseData = res.data.course || res.data;

        // Mengubah ID numerik siswa menjadi objek { id, name }
        const students = (actualCourseData.students || [])
          .filter((item) => typeof item === "number" || (item && item.id))
          .map((item) => {
            const studentId = typeof item === "number" ? item : item.id;
            return {
              id: studentId,
              name: `Siswa ID: ${studentId}`,
            };
          });

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
    // FIXED: Logic to decode token and set currentUserId (HANYA BERJALAN SEKALI SAAT LOAD)
    const token = localStorage.getItem("token");
      console.log("Token dari LocalStorage:", token); 

    if (token && token.length > 0) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUserId(Number(decodedToken.sub)); // Set ID dan pastikan tipe Number
      } catch (e) {
        console.error("❌ Token tidak valid, gagal decode:", e);
        setCurrentUserId(null);
      }
    } else {
      setCurrentUserId(null);
    }

    // Panggil loadCourse untuk mengambil data kursus
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

  // FIXED: Defensive coding dengan optional chaining untuk mencegah crash 'reading cover'
  const coverUrl =
    course?.cover && course.cover.startsWith("http")
      ? course.cover
      : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${course?.cover}`;

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
                  <p className="mb-1">Rating: {"⭐".repeat(rating.ratings)}</p>
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
          {/* RENDER HANYA JIKA currentUserId SUDAH ADA */}
          {currentUserId !== null && (
            <CourseActions
              course={course}
              currentUserId={currentUserId} // Kirim ID pengguna ke CourseActions
              onDataChange={loadCourse}
            />
          )}
        </div>
      </div>
    </div>
  );
}
