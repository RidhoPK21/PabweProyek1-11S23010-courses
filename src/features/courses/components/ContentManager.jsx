// src/features/courses/components/ContentManager.jsx
import React, { useState } from "react";
import CourseApi from "../../../api/CourseApi";
import { Modal, Button, Form } from "react-bootstrap";

export default function ContentManager({ contents, courseId, onDataChange }) {
  // State untuk form tambah materi baru
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState(""); // Tetap ada untuk form, meski tidak dikirim ke 'add' API
  const [newVideoUrl, setNewVideoUrl] = useState("");

  // State untuk modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");

  // --- FUNGSI UNTUK MODAL EDIT ---
  const handleShowEditModal = (content) => {
    setEditingContent(content);
    setEditTitle(content.title);
    setEditDescription(content.description);
    setEditVideoUrl(content.video || ""); // Sesuaikan dengan field dari API get course
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingContent(null);
  };

  // --- FUNGSI CRUD (Create, Read, Update, Delete) ---

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      // PERBAIKAN: Payload disesuaikan dengan dokumentasi API Anda
      // Body hanya membutuhkan 'title' dan 'youtube'
      const payload = {
        title: newTitle,
        youtube: newVideoUrl,
      };

      const res = await CourseApi.addContent(courseId, payload);

      if (res.success) {
        alert("Materi berhasil ditambahkan!");
        // Bersihkan form
        setNewTitle("");
        setNewDescription("");
        setNewVideoUrl("");
        onDataChange(); // Panggil fungsi refresh dari parent untuk memuat ulang data
      } else {
        // Menampilkan pesan error dari API jika ada
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
    e.preventDefault();
    if (!editingContent) return;

    try {
      // Payload untuk update, sesuaikan field jika berbeda
      const payload = {
        title: editTitle,
        description: editDescription,
        video: editVideoUrl,
      };

      const res = await CourseApi.updateContent(
        courseId,
        editingContent.id,
        payload
      );

      if (res.success) {
        alert("Materi berhasil diperbarui!");
        handleCloseEditModal();
        onDataChange(); // Refresh data
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
        const res = await CourseApi.deleteContent(courseId, contentId);
        if (res.success) {
          alert("Materi berhasil dihapus!");
          onDataChange(); // Refresh data
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
      <h3>Materi Pembelajaran</h3>
      {/* FORM TAMBAH MATERI BARU */}
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
            {/* Deskripsi tetap di form untuk UX, tapi tidak dikirim */}
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

      {/* MODAL UNTUK EDIT MATERI */}
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
