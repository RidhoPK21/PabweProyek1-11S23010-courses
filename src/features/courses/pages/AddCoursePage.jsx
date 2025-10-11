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
      setMessage("❌ Cover is required!");
      return;
    }

    try {
      const res = await CourseApi.addCourse(form);
      setMessage("✅ " + res.message);

      // PERBAIKAN: Redirect ke halaman daftar kursus
      setTimeout(() => navigate("/courses"), 1500);
    } catch (err) {
      setMessage("❌ Failed to add course: " + err.message);
      console.error("❌ ERROR detail:", err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card p-4" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 className="fw-bold mb-4">Add New Course</h1>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
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
            <label className="form-label">Description</label>
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
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}
