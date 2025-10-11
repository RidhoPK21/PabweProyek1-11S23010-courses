import React, { useState, useEffect } from "react";
import CourseApi from "../../../api/CourseApi";

function CourseActions({ course, onDataChange }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setRating(course.my_ratings?.ratings || 0);
    setComment(course.my_ratings?.comment || "");
  }, [course]);

  const currentUserId = localStorage.getItem("user_id");
  const isEnrolled =
    course.students &&
    course.students.some((s) => s.id === Number(currentUserId));

  const handleJoin = async () => {
    try {
      await CourseApi.addStudent(course.id);
      alert("You have successfully joined this course!");
      onDataChange(); // Memanggil fungsi refresh data
    } catch (error) {
      alert("Failed to join course: " + error.message);
    }
  };

  const handleLeave = async () => {
    if (window.confirm("Are you sure you want to leave this course?")) {
      try {
        await CourseApi.leaveCourse(course.id);
        alert("You have successfully left the course.");
        onDataChange();
      } catch (error) {
        alert("Failed to leave course: " + error.message);
      }
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await CourseApi.changeMyRating(course.id, { ratings: rating, comment });
      alert("Rating submitted successfully!");
      onDataChange();
    } catch (error) {
      alert("Failed to submit rating: " + error.message);
    }
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
