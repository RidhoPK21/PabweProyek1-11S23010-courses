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

        const students = (actualCourseData.students || [])
          .map((item) => {
            const studentId = typeof item === "number" ? item : item.id;
            return {
              id: Number(studentId), // Pastikan selalu number untuk perbandingan
              name: `Siswa ID: ${studentId}`,
            };
          })
          .filter((student) => student.id);

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

const handleContentStatusUpdate = (updatedContentId) => {
  setCourse((currentCourse) => {
    if (!currentCourse) return null;
    const newContents = currentCourse.contents.map((content) => {
      if (content.id === updatedContentId) {
        return { ...content, is_learned: !content.is_learned };
      }
      return content;
    });
    return { ...currentCourse, contents: newContents };
  });
};

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!course)
    return <div className="container mt-5">Loading course details...</div>;

  const coverUrl =
    course.cover && course.cover.startsWith("http")
      ? course.cover
      : `${import.meta.env.VITE_DELCOM_BASEURL}/storage/${course.cover}`;

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <Link to="/courses" className="btn btn-outline-secondary">
          &larr; Back To List
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
          <ContentManager
            contents={course.contents || []}
            courseId={id}
            onDataChange={loadCourse}
            onStatusUpdate={handleContentStatusUpdate} // Prop BARU
          />

          <div className="card mt-4">
            <div className="card-body">
              <h3 className="card-title fw-bold mb-3">Course Review</h3>
              {course.ratings && course.ratings.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {course.ratings.map((rating) => (
                    <li key={rating.id} className="list-group-item px-0">
                      <strong>{rating.name}</strong>
                      <p className="mb-1">
                        Rating: {"⭐".repeat(rating.ratings)}
                      </p>
                      <p className="mb-0 fst-italic">"{rating.comment}"</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>There are no reviews for this course yet..</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "100px" }}>
            <CourseActions course={course} onDataChange={loadCourse} />
            <div className="mt-4">
              <ChangeCover courseId={id} onUploadSuccess={loadCourse} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}