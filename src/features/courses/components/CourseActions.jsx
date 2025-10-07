// src/features/courses/components/CourseActions.jsx
import React, { useState, useEffect } from "react";
import CourseApi from "../../../api/CourseApi";

function CourseActions({ course, currentUserId, onDataChange }) {
  const [rating, setRating] = useState(course.my_ratings?.ratings || 0);
  const [comment, setComment] = useState(course.my_ratings?.comment || "");

   useEffect(() => {
     if (course.my_ratings) {
       setRating(course.my_ratings.ratings || 0);
       setComment(course.my_ratings.comment || "");
     } else {
       // Jika belum ada rating, pastikan form kosong
       setRating(0);
       setComment("");
     }
   }, [course]);

  // Asumsikan ID 86 adalah ID pengguna yang sedang login
  const isEnrolled =
    course.students &&
    course.students.some((s) => s.id === Number(currentUserId));

  const handleJoin = async () => {
    try {
      await CourseApi.addStudent(course.id, { user_id: currentUserId });

      alert("Anda berhasil bergabung ke kursus ini!");
      onDataChange();
    } catch (error) {
      alert("Gagal bergabung: " + error.message);
    }
  };

  const handleLeave = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari kursus ini?")) {
      try {
        await CourseApi.leaveCourse(course.id);
        alert("Anda berhasil keluar dari kursus.");
        onDataChange();
      } catch (error) {
        alert("Gagal keluar: " + error.message);
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
      alert("Rating berhasil dikirim!");
      onDataChange();
    } catch (error) {
      alert("Gagal mengirim rating: " + error.message);
    }
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Status Keanggotaan</h5>
          {isEnrolled ? (
            <div>
              <p className="text-success">
                Anda sudah terdaftar di kursus ini.
              </p>
              <button className="btn btn-danger" onClick={handleLeave}>
                Keluar dari Kursus
              </button>
            </div>
          ) : (
            <div>
              <p>Anda belum terdaftar di kursus ini.</p>
              <button className="btn btn-success" onClick={handleJoin}>
                Gabung Kursus
              </button>
            </div>
          )}
        </div>
      </div>

      {isEnrolled && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Beri Rating</h5>
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
                <label className="form-label">Komentar</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Kirim Rating
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ PASTIKAN BARIS INI ADA DI AKHIR FILE
export default CourseActions;
