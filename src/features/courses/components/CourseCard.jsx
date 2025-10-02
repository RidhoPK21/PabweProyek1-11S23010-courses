import React from "react";
import { Link } from "react-router-dom";
import api from "../../../api/authApi";

export default function CourseCard({ course }) {
  const handleDelete = async () => {
    if (window.confirm("Yakin hapus course ini?")) {
      try {
        await api.delete(`/courses/${course.id}`);
        alert("✅ Course dihapus!");
        window.location.reload(); // refresh list
      } catch (err) {
        console.error("❌ Gagal hapus:", err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        {course.cover && (
          <img
            src={
              course.cover.startsWith("http")
                ? course.cover
                : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${
                    course.cover
                  }`
            }
            className="card-img-top"
            alt={course.title}
            style={{ height: 180, objectFit: "cover" }}
          />
        )}
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
