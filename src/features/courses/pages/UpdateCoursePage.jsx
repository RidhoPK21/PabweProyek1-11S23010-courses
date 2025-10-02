import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/authApi";
import CourseForm from "../components/CourseForm";

export default function UpdateCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data.data));
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await api.put(`/courses/${id}`, data);
      setMessage("✅ Course berhasil diupdate!");
    } catch (err) {
      setMessage("❌ Gagal update course");
      console.error(err.response?.data || err.message);
    }
  };

  if (!course) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2>Update Course</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <CourseForm
        initialData={course}
        onSubmit={handleUpdate}
        submitText="Update"
      />
    </div>
  );
}
