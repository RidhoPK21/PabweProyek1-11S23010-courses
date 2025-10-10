import React from "react";
import { Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";
import { PencilSquare, Trash, EyeFill } from "react-bootstrap-icons"; // Impor ikon

export default function CourseCard({ course }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course??")) {
      try {
        const cleanId = String(course.id).split(":")[0];
        await CourseApi.deleteCourse(cleanId);
        alert("✅ Course berhasil dihapus!");
        window.location.reload();
      } catch (err) {
        // ... (error handling)
      }
    }
  };

  const coverUrl =
    course.cover && course.cover.startsWith("http")
      ? course.cover
      : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${course.cover}`;

  return (
    <div className="col-lg-3 col-md-4 mb-4">
      <div className="card h-100">
        <img
          src={coverUrl}
          className="card-img-top"
          alt={course.title}
          style={{
            height: "180px",
            objectFit: "cover",
            borderTopLeftRadius: "var(--card-border-radius)",
            borderTopRightRadius: "var(--card-border-radius)",
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold">{course.title}</h5>
          <p className="card-text text-muted small flex-grow-1">
            {course.description}
          </p>
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <Link
              to={`/courses/${course.id}`}
              className="btn btn-primary btn-sm"
            >
              <EyeFill className="me-1" /> Detail
            </Link>
            <div className="d-flex">
              <Link
                to={`/update-course/${course.id}`}
                className="btn btn-link text-secondary p-1"
              >
                <PencilSquare size={20} />
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-link text-danger p-1"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}