import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetCourseDetail } from "../states/action";
import ContentManager from "../components/ContentManager";
import CourseActions from "../components/CourseActions";
import ChangeCover from "../components/ChangeCover";

export default function CourseDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Ambil data dari Redux store, bukan lagi dari state lokal
  const course = useSelector((state) => state.courseDetail);
  const isLoading = useSelector((state) => state.isLoadingCourseDetail);

  useEffect(() => {
    // Cukup dispatch action untuk mengambil data
    dispatch(asyncGetCourseDetail(id));
  }, [id, dispatch]);

  // Semua fungsi `handle...` sekarang akan ditangani di dalam CourseActions

  if (isLoading || !course) {
    return <div className="container-fluid">Loading course details...</div>;
  }

  const coverUrl =
    course.cover && course.cover.startsWith("http")
      ? course.cover
      : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${course.cover}`;

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <Link to="/courses" className="btn btn-outline-secondary">
          &larr; Back to List
        </Link>
      </div>

      <div className="card mb-4 overflow-hidden">
        <img
          src={coverUrl}
          className="card-img-top"
          alt={course.title}
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
        <div className="card-body p-4">
          <h1 className="card-title fw-bolder">{course.title}</h1>
          <p
            className="card-text text-muted"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {course.description}
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Komponen-komponen ini sekarang tidak perlu banyak prop */}
          <ContentManager contents={course.contents || []} courseId={id} />
          {/* ... Ulasan Kursus ... */}
        </div>
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "100px" }}>
            <CourseActions course={course} />
            <div className="mt-4">
              <ChangeCover courseId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
