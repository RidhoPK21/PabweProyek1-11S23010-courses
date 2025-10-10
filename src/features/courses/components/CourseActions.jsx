// src/features/courses/components/CourseActions.jsx
import React, { useState, useEffect } from "react";
import CourseApi from "../../../api/CourseApi";

function CourseActions({ course, onDataChange }) {
  const [rating, setRating] = useState(course.my_ratings?.ratings || 0);
  const [comment, setComment] = useState(course.my_ratings?.comment || "");

  useEffect(() => {
    if (course.my_ratings) {
      setRating(course.my_ratings.ratings || 0);
      setComment(course.my_ratings.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
  }, [course]);

  // ✅ ID Pengguna Anda
  const currentUserId = 162;

  // ✅ FIXED: Menggunakan Number() untuk perbandingan type-safe (mengatasi string vs number)
  const isEnrolled =
    course.students &&
    course.students.some((s) => s.id === Number(currentUserId));

  const handleJoin = async () => {
    try {
      // ✅ Panggilan API yang sesuai dengan dokumentasi (tanpa payload)
      await CourseApi.addStudent(course.id);

      alert("Anda berhasil bergabung ke kursus ini!");
      // Tambahkan timeout untuk mengatasi race condition
      setTimeout(() => {
        onDataChange();
      }, 500);
    } catch (error) {
      alert("Failed to join: " + error.message);
    }
  };

  const handleLeave = async () => {
    if (window.confirm("Are you sure you want to leave this course??")) {
      try {
        await CourseApi.leaveCourse(course.id);
        alert("You have successfully dropped out of the course.");
        setTimeout(() => {
          onDataChange();
        }, 500);
      } catch (error) {
        alert("Failed to exit: " + error.message);
      }
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await CourseApi.changeMyRating(course.id, {
        ratings: rating,
        comment,
      });
      alert("Rating successfully submitted!");
      onDataChange();
    } catch (error) {
      alert("Failed to send rating: " + error.message);
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Membership Status</h5>
          {isEnrolled ? (
            <div>
              <p className="text-success">
                You are already enrolled in this course.
              </p>
              <button className="btn btn-danger" onClick={handleLeave}>
                Exit Course
              </button>
            </div>
          ) : (
            <div>
              <p>You are not yet enrolled in this course.</p>
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
            <h5 className="card-title">Rate it</h5>
            <form onSubmit={handleRatingSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating (1-5)</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
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
