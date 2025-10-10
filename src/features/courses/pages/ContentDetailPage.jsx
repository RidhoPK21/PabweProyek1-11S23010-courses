// src/features/courses/pages/ContentDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

function ContentDetailPage() {
  const { courseId, contentId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const res = await CourseApi.getContentById(courseId, contentId);
        if (res.success && res.data.course_content) {
          setContent(res.data.course_content);
        } else {
          throw new Error(res.message || "Content not found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [courseId, contentId]);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error)
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!content)
    return (
      <div className="container mt-5 alert alert-warning">
        Content not found.
      </div>
    );

  const videoId = getYouTubeId(content.youtube);

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <Link to={`/courses/${courseId}`} className="btn btn-outline-secondary">
          &larr; Back to Course Details
        </Link>
      </div>

      <div className="card">
        <div className="card-body p-4">
          <h2 className="card-title fw-bold mb-4">{content.title}</h2>
          {videoId ? (
            <div
              className="ratio ratio-16x9"
              style={{ borderRadius: "var(--card-border-radius)" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={content.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p className="alert alert-warning">
              YouTube URL is invalid or unavailable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentDetailPage;