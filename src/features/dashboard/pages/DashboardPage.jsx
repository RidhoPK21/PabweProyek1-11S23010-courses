import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Book, People } from "react-bootstrap-icons";
import authApi from "../../../api/authApi";
import courseApi from "../../../api/CourseApi";
import CourseCard from "../../courses/components/CourseCard"; // Import CourseCard

function DashboardPage() {
  const [stats, setStats] = useState({ courses: 0, users: 0 });
  const [topCourses, setTopCourses] = useState([]); // State untuk kursus rating tertinggi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes] = await Promise.all([
          courseApi.getCourses(),
          authApi.getAllUsers(),
        ]);

        const allCourses = coursesRes.data.courses || coursesRes.data || [];
        const totalUsers = usersRes.users?.length || usersRes?.length || 0;

        // Logika untuk menghitung rating, mengurutkan, dan mengambil 4 teratas
        const sortedCourses = allCourses
          .map((course) => {
            const ratings = course.ratings || [];
            const totalRating = ratings.reduce((sum, r) => sum + r.ratings, 0);
            const averageRating =
              ratings.length > 0 ? totalRating / ratings.length : 0;
            return { ...course, averageRating };
          })
          .sort((a, b) => b.averageRating - a.averageRating);

        setTopCourses(sortedCourses.slice(0, 4));

        setStats({
          courses: allCourses.length,
          users: totalUsers,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1 className="fw-bold">Dashboard</h1>
        <p className="text-muted">
          Welcome back! Here's your learning summary.
        </p>
      </div>

      {/* Hanya tampilkan 2 kartu statistik */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-primary bg-opacity-10 rounded-3 me-3 text-primary">
                <Book size={30} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">
                  {loading ? "..." : stats.courses}
                </h4>
                <p className="text-muted mb-0">Total Courses</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-success bg-opacity-10 rounded-3 me-3 text-success">
                <People size={30} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">
                  {loading ? "..." : stats.users}
                </h4>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bagian Rekomendasi Kursus */}
      <div className="mt-4">
        <h3 className="fw-bold mb-3">Recently Added</h3>
        {loading ? (
          <p>Loading recommendations...</p>
        ) : (
          <Row>
            {topCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
