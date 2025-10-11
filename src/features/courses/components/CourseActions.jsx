import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  asyncEnrollCourse,
  asyncLeaveCourse,
  asyncChangeRating,
} from "../states/action";

function CourseActions({ course }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Memastikan rating dan komentar pengguna saat ini dimuat saat data kursus diperbarui
    setRating(course.my_ratings?.ratings || 0);
    setComment(course.my_ratings?.comment || "");
  }, [course]);

  // currentUserId adalah String dari localStorage
  const currentUserId = localStorage.getItem("user_id");

  // ✅ PERBAIKAN FINAL & PALING ROBUST:
  // Kita cek properti `user_id` atau `id` (sebagai fallback) dan pastikan konversi ke String.
  // Ini mengatasi ketidakpastian struktur data API (Array of Objects, bukan Array of IDs murni).
  const isEnrolled =
    course.students &&
    course.students.some((s) => String(s.user_id || s.id) === currentUserId);

  const handleJoin = () => {
    dispatch(asyncEnrollCourse(course.id));
  };

  const handleLeave = () => {
    dispatch(asyncLeaveCourse(course.id));
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    const submittedRating = Number(rating);
    dispatch(
      asyncChangeRating({
        courseId: course.id,
        ratings: submittedRating,
        comment,
      })
    );
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Membership Status</h5>
          {isEnrolled ? (
            <div>
              <p className="text-success">You are enrolled in this course.</p>
              <button className="btn btn-danger" onClick={handleLeave}>
                Leave Course
              </button>
            </div>
          ) : (
            <div>
              <p>You are not enrolled in this course.</p>
              <button className="btn btn-success" onClick={handleJoin}>
                Join Course
              </button>
            </div>
          )}
        </div>
      </div>
      {isEnrolled && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Give Rating</h5>
            <form onSubmit={handleRatingSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating: {rating}</label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="5"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comment (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Rating
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseActions;
