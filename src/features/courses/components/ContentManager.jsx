// src/features/courses/components/ContentManager.jsx
import React, { useState } from "react";
import CourseApi from "../../../api/CourseApi";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom"; 


const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function ContentManager({ contents, courseId, onDataChange }) {
  // State untuk form tambah materi baru
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  // State untuk modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");

  // --- FUNGSI UNTUK MODAL EDIT ---
  const handleShowEditModal = (content) => {
    setEditingContent(content); // Menyimpan seluruh objek content
    setEditTitle(content.title);
    setEditDescription(content.description);
    setEditVideoUrl(content.video || "");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingContent(null);
  };

  // ✅ --- State baru untuk modal DETAIL ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  // --- FUNGSI UNTUK MODAL DETAIL ---
  const handleShowDetailModal = (content) => {
    setSelectedContent(content);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedContent(null);
  };

  // --- FUNGSI CRUD (Create, Read, Update, Delete) ---

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle,
        youtube: newVideoUrl,
      };
      const res = await CourseApi.addContent(courseId, payload);
      if (res.success) {
        alert("Materi berhasil ditambahkan!");
        setNewTitle("");
        setNewDescription("");
        setNewVideoUrl("");
        onDataChange();
      } else {
        throw new Error(res.message || "Gagal menambahkan materi.");
      }
    } catch (error) {
      alert("Gagal menambahkan materi:\n" + error.message);
    }
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    if (!editingContent) return;

    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        video: editVideoUrl,
      };
      // ✅ PASTIKAN MENGGUNAKAN ID DARI editingContent
      const res = await CourseApi.updateContent(
        courseId,
        editingContent.id, // Menggunakan ID dari state
        payload
      );

      if (res.success) {
        alert("Materi berhasil diperbarui!");
        handleCloseEditModal();
        onDataChange();
      } else {
        throw new Error(res.message || "Gagal memperbarui materi.");
      }
    } catch (error) {
      alert("Gagal memperbarui materi:\n" + error.message);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
      try {
        // ✅ PERBAIKAN: Bersihkan ID materi sebelum dikirim ke API
        const cleanContentId = String(contentId).split(":")[0];

        const res = await CourseApi.deleteContent(courseId, cleanContentId);
        if (res.success) {
          alert("Materi berhasil dihapus!");
          onDataChange();
        } else {
          throw new Error(res.message || "Gagal menghapus materi.");
        }
      } catch (error) {
        alert("Gagal menghapus materi: " + error.message);
      }
    }
  };

  return (
    <div>
      {/* ... (bagian form tambah materi) ... */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Tambah Materi Baru</h5>
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
                placeholder="Deskripsi (Opsional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
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

      {/* DAFTAR MATERI */}
      {contents && contents.length > 0 ? (
        <ul className="list-group">
          {contents.map((content) => (
            <li
              key={content.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{content.title}</strong>
                <p className="mb-0 text-muted">{content.description}</p>
              </div>
              <div>
                {/* ✅ Tombol "Detail" menggunakan Link untuk navigasi */}
                <Link
                  to={`/courses/${courseId}/contents/${content.id}`}
                  className="btn btn-info btn-sm me-2"
                >
                  Detail
                </Link>

                {/* ✅ Tombol "Edit" menggunakan button untuk membuka modal */}
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

      {/* ... (modal edit) ... */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Materi</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateContent}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Judul</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL Youtube</Form.Label>
              <Form.Control
                type="url"
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan Perubahan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}