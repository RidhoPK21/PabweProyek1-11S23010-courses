// src/api/CourseApi.js
import apiHelper from "../helpers/apiHelper";

const CourseApi = (() => {
  const BASE_URL = `/api/courses`;

  // --- Course Management ---
  async function getCourses() {
    const response = await apiHelper.fetchData(BASE_URL);
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  async function getCourseById(id) {
    const response = await apiHelper.fetchData(`${BASE_URL}/${id}`);
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  async function addCourse(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.cover) formData.append("cover", data.cover);

    const res = await apiHelper.fetchData(BASE_URL, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }

  async function updateCourse(id, formData) {
    formData.append("_method", "PUT");
    const res = await apiHelper.fetchData(`${BASE_URL}/${id}`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }

  async function changeCover(id, coverFile) {
    const formData = new FormData();
    formData.append("cover", coverFile);
    formData.append("_method", "PATCH");
    const res = await apiHelper.fetchData(`${BASE_URL}/${id}/cover`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }

  async function deleteCourse(id) {
    const res = await apiHelper.fetchData(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  }

  // --- Student Management ---
  async function addStudent(courseId, studentData) {
    const res = await apiHelper.fetchData(`${BASE_URL}/${courseId}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    return res.json();
  }

  async function deleteStudent(courseId, studentId) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/students/${studentId}`,
      { method: "DELETE" }
    );
    return res.json();
  }

  async function changeStudentRating(courseId, studentId, ratingData) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/students/${studentId}/rating`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingData),
      }
    );
    return res.json();
  }

  // --- Content Management ---
  async function addContent(courseId, contentData) {
    const response = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents`, // ✅ FIX: Endpoint harus plural
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData),
      }
    );
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  async function getContentById(courseId, contentId) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents/${contentId}` // ✅ FIX: Endpoint harus plural
    );
    return res.json();
  }

  async function updateContent(courseId, contentId, contentData) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents/${contentId}`, // ✅ FIX: Endpoint harus plural
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData),
      }
    );
    return res.json();
  }

  async function deleteContent(courseId, contentId) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents/${contentId}`, // ✅ FIX: Endpoint harus plural
      { method: "DELETE" }
    );
    return res.json();
  }

  async function changeContentStatus(courseId, contentId, statusData) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents/${contentId}/status`, // ✅ FIX: Endpoint harus plural
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusData),
      }
    );
    return res.json();
  }

  async function getContentsByCourseId(courseId) {
    const response = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents`,
      { method: "GET" } // ✅ Tambahkan metode GET secara eksplisit
    );
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  return {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    changeCover,
    deleteCourse,
    addStudent,
    deleteStudent,
    changeStudentRating,
    addContent,
    getContentById,
    updateContent,
    deleteContent,
    changeContentStatus,
    getContentsByCourseId,
  };
})();

export default CourseApi;
