// src/features/courses/components/CourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";

export default function CourseCard({ course }) {
  const handleDelete = async () => {
    if (window.confirm("Yakin hapus course ini?")) {
      try {
        // ✅ PERBAIKAN: Pastikan ID yang dikirim bersih (hanya angka)
        const cleanId = String(course.id).split(":")[0];

        await CourseApi.deleteCourse(cleanId);
        alert("✅ Course berhasil dihapus!");
        window.location.reload();
      } catch (err) {
        const errorMessage = err.message.includes("404")
          ? "Data kursus tidak tersedia"
          : err.message;
        alert(`❌ Gagal hapus: ${errorMessage}`);
        console.error("❌ Gagal hapus:", err.message);
      }
    }
  };

  const coverUrl =
    course.cover && course.cover.startsWith("http")
      ? course.cover
      : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${course.cover}`;

  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <img
          src={coverUrl}
          className="card-img-top"
          alt={course.title}
          style={{ height: 180, objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{course.title}</h5>
          <p className="card-text text-truncate">{course.description}</p>
          <div className="mt-auto d-flex justify-content-between">
            <Link
              to={`/courses/${course.id}`}
              className="btn btn-primary btn-sm"
            >
              Detail
            </Link>
            <Link
              to={`/update-course/${course.id}`}
              className="btn btn-warning btn-sm"
            >
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
