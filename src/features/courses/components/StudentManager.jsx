// src/features/courses/components/StudentManager.jsx
import React, { useState } from "react";
import CourseApi from "../../../api/CourseApi";

export default function StudentManager({ students, courseId, onDataChange }) {
  const [studentId, setStudentId] = useState("");

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    try {
      await CourseApi.addStudent(courseId, {
        user_id: parseInt(studentId, 10),
      });
      alert("Siswa berhasil ditambahkan!");
      setStudentId("");
      onDataChange(); // Refresh data
    } catch (error) {
      alert("Gagal menambahkan siswa: " + error.message);
    }
  };

  const handleDeleteStudent = async (studentUserId) => {
    if (window.confirm("Yakin ingin mengeluarkan siswa ini?")) {
      try {
        // studentUserId di sini adalah ID siswa yang diterima dari onClick
        await CourseApi.deleteStudent(courseId, studentUserId);
        alert("Siswa berhasil dikeluarkan.");
        onDataChange(); // Refresh data
      } catch (error) {
        alert("Gagal mengeluarkan siswa: " + error.message);
      }
    }
  };

  return (
    <div>
      <h3>Siswa Terdaftar</h3>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Tambah Siswa</h5>
          <form onSubmit={handleAddStudent}>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                placeholder="ID User Siswa"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit">
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>

      {students.length > 0 ? (
        <ul className="list-group">
          {students
            // ✅ PERBAIKAN: Filter untuk menghapus objek siswa yang tidak memiliki ID
            .filter((student) => student && student.id)
            .map((student) => (
              <li
                key={student.id} // ✅ key prop yang unik
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {student.name} (ID: {student.id})
                <button
                  className="btn btn-outline-danger btn-sm"
                  // student.id dipastikan ada karena sudah difilter
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Keluarkan
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <p>Belum ada siswa yang terdaftar.</p>
      )}
    </div>
  );
}
