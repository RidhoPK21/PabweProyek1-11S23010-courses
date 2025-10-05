// src/features/courses/components/ChangeCover.jsx
import React, { useState } from "react";
import CourseApi from "../../../api/CourseApi";

export default function ChangeCover({ courseId, onUploadSuccess }) {
  const [cover, setCover] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cover) {
      setMessage("Silakan pilih file gambar terlebih dahulu.");
      return;
    }

    try {
      await CourseApi.changeCover(courseId, cover);
      setMessage("Cover berhasil diubah!");
      // Reset state dan refresh data di halaman detail
      setCover(null);
      e.target.reset(); // Reset form input file
      onUploadSuccess();
    } catch (error) {
      setMessage("Gagal mengubah cover: " + error.message);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Ganti Cover Course</h5>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            <button className="btn btn-outline-secondary" type="submit">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
