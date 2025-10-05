// src/features/courses/components/ContentManager.jsx
import React, { useState } from "react"; // Hapus useEffect
import CourseApi from "../../../api/CourseApi";
import { Modal, Button, Form } from "react-bootstrap";

export default function ContentManager({ contents, courseId, onDataChange }) {
  // TIDAK ADA LAGI STATE LOKAL UNTUK CONTENTS

  // State untuk form tambah
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  // State untuk modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");

  const handleShowEditModal = (content) => {
    setEditingContent(content);
    setEditTitle(content.title);
    setEditDescription(content.description);
    setEditVideoUrl(content.youtube || "");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingContent(null);
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle,
        description: newDescription,
        youtube: newVideoUrl,
      };
      const res = await CourseApi.addContent(courseId, payload);

      if (res.success) {
        alert("Materi berhasil ditambahkan!");
        setNewTitle("");
        setNewDescription("");
        setNewVideoUrl("");
        onDataChange(); // Panggil fungsi refresh dari parent
      } else {
        const errorMessages = Object.values(res.data || {})
          .flat()
          .join("\n");
        throw new Error(
          res.message + (errorMessages ? `\n- ${errorMessages}` : "")
        );
      }
    } catch (error) {
      alert("Gagal menambahkan materi:\n" + error.message);
    }
  };

  const handleUpdateContent = async (e) => {
    // ... logika update tidak berubah
  };

  const handleDeleteContent = async (contentId) => {
    // ... logika delete tidak berubah
  };

  return (
    <div>
      <h3>Materi Pembelajaran</h3>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Tambah Materi Baru</h5>
          {/* Form tambah materi tidak berubah */}
          <form onSubmit={handleAddContent}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Judul Materi"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Deskripsi"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-2">
              <input
                type="url"
                className="form-control"
                placeholder="URL Youtube"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Tambah
            </button>
          </form>
        </div>
      </div>

      {/* Daftar ini sekarang langsung me-render dari prop 'contents' */}
      {contents && contents.length > 0 ? (
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
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleShowEditModal(content)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteContent(content.id)}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada materi untuk kursus ini.</p>
      )}

      {/* Modal edit tidak berubah */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        {/* ... */}
      </Modal>
    </div>
  );
}
