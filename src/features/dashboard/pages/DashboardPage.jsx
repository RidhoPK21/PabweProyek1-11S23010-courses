import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Book, People } from "react-bootstrap-icons";
import useApi from "../../../hooks/useApi"; // Impor custom hook
import authApi from "../../../api/authApi";
import courseApi from "../../../api/CourseApi";
import CourseCard from "../../courses/components/CourseCard";

function DashboardPage() {
  // Gunakan custom hook untuk mengambil data kursus dan pengguna
  const { data: coursesData, loading: coursesLoading } = useApi(
    courseApi.getCourses
  );
  const { data: usersData, loading: usersLoading } = useApi(
    authApi.getAllUsers
  );

  const loading = coursesLoading || usersLoading;

  const allCourses = coursesData?.data?.courses || coursesData?.data || [];
  const totalUsers = usersData?.users?.length || usersData?.length || 0;

  // Logika untuk mengurutkan kursus berdasarkan rating
  const topCourses = allCourses
    .map((course) => {
      const ratings = course.ratings || [];
      const totalRating = ratings.reduce((sum, r) => sum + r.ratings, 0);
      const averageRating =
        ratings.length > 0 ? totalRating / ratings.length : 0;
      return { ...course, averageRating };
    })
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1 className="fw-bold">Dashboard</h1>
        <p className="text-muted">
          Welcome back! Here's your learning summary.
        </p>
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-primary bg-opacity-10 rounded-3 me-3 text-primary">
                <Book size={30} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">
                  {loading ? "..." : allCourses.length}
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
                <h4 className="fw-bold mb-0">{loading ? "..." : totalUsers}</h4>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <h3 className="fw-bold mb-3">Top Rated Courses</h3>
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
