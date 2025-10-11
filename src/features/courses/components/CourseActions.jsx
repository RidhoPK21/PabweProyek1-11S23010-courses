import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  asyncEnrollCourse,
  asyncLeaveCourse,
  asyncChangeRating,
} from "../states/action"; // Impor thunks

function CourseActions({ course }) {
  const dispatch = useDispatch();
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

  const handleJoin = () => {
    dispatch(asyncEnrollCourse(course.id));
  };

  const handleLeave = () => {
    dispatch(asyncLeaveCourse(course.id));
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    dispatch(
      asyncChangeRating({ courseId: course.id, ratings: rating, comment })
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
              {/* ... Isi form tidak berubah ... */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseActions;
