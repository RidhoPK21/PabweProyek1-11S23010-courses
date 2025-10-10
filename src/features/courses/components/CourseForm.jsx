import React, { useState, useEffect } from "react";

export default function CourseForm({ initialData, onSubmit, submitText }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [cover, setCover] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (cover) formData.append("cover", cover);

    onSubmit(formData); // kirim formData langsung
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Cover</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setCover(e.target.files[0])}
          accept="image/*"
        />
      </div>

      <button className="btn btn-primary">{submitText}</button>
    </form>
  );
}
