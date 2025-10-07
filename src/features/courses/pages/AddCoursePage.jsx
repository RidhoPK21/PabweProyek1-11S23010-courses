import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseApi from "../../../api/CourseApi";

export default function AddCoursePage() {
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    cover: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cover) {
      setMessage("❌ Cover wajib dipilih!");
      return;
    }

    try {
      console.log("📤 DEBUG form:", form);
      console.log("📤 cover instanceof File:", form.cover instanceof File);

      const res = await CourseApi.addCourse(form);
      setMessage("✅ " + res.message);

      // redirect setelah 1 detik
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage("❌ Gagal menambahkan course: " + err.message);
      console.error("❌ ERROR detail:", err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card p-4">
        <h2 className="mb-4 fw-bold">Tambah Course Baru</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Judul</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Cover</label>
            <input
              type="file"
              name="cover"
              onChange={handleChange}
              className="form-control"
              accept="image/*"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
}