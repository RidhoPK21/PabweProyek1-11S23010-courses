// src/features/courses/components/ContentManager.jsx
import React, { useState } from "react";
import CourseApi from "../../../api/CourseApi";

export default function ContentManager({ contents, courseId, onDataChange }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      await CourseApi.addContent(courseId, {
        title,
        description,
        video_url: videoUrl,
      });
      alert("Materi berhasil ditambahkan!");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      onDataChange(); // Refresh data di halaman detail
    } catch (error) {
      alert("Gagal menambahkan materi: " + error.message);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm("Yakin ingin menghapus materi ini?")) {
      try {
        await CourseApi.deleteContent(courseId, contentId);
        alert("Materi berhasil dihapus.");
        onDataChange(); // Refresh data
      } catch (error) {
        alert("Gagal menghapus materi: " + error.message);
      }
    }
  };

  return (
    <div>
      <h3>Materi Pembelajaran</h3>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Tambah Materi Baru</h5>
          <form onSubmit={handleAddContent}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Judul Materi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-2">
              <input
                type="url"
                className="form-control"
                placeholder="URL Video (opsional)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Tambah
            </button>
          </form>
        </div>
      </div>

      {contents.length > 0 ? (
        <ul className="list-group">
          {contents.map((content) => (
            <li
              key={content.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{content.title}</strong>
                <p className="mb-0">{content.description}</p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteContent(content.id)}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada materi untuk kursus ini.</p>
      )}
    </div>
  );
}
