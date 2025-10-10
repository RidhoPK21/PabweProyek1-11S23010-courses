import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, InputGroup } from "react-bootstrap"; // Import Form
import CourseApi from "../../../api/CourseApi";
import CourseCard from "../components/CourseCard";
import { PlusCircleFill, Search } from "react-bootstrap-icons";

export default function CourseListPage() {
  const [courses, setCourses] = useState([]); // Master list
  const [filteredCourses, setFilteredCourses] = useState([]); // List to display
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await CourseApi.getCourses();
        const data = res.data.courses || res.data || [];
        setCourses(data);
        setFilteredCourses(data); // Inisialisasi daftar yang ditampilkan
      } catch (err) {
        console.error("❌ Error fetch courses:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Effect untuk filtering
  useEffect(() => {
    const result = courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(result);
  }, [searchQuery, courses]);

  if (loading) return <div className="container-fluid">Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Courses</h1>
        <Link
          to="/add-course"
          className="btn btn-primary d-flex align-items-center"
        >
          <PlusCircleFill className="me-2" />
          Add Course
        </Link>
      </div>

      {/* Search Bar dengan Ikon */}
      <InputGroup className="mb-4">
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Search for course name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {filteredCourses.length === 0 && !loading && (
        <div className="alert alert-info">
          {searchQuery
            ? `Kursus dengan nama "${searchQuery}" tidak ditemukan.`
            : "Tidak ada kursus yang tersedia."}
        </div>
      )}

      <div className="row">
        {filteredCourses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}