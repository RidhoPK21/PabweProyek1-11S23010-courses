// src/api/CourseApi.js
import apiHelper from "../helpers/apiHelper";

const CourseApi = (() => {
  // PERBAIKAN UTAMA: Gunakan proxy '/api' dari vite.config.js
  const BASE_URL = `/api/courses`;
  // --- Course Management ---
  async function getCourses() {
    // PERBAIKAN: Parsing JSON dan kembalikan isinya, bukan objek Response mentah
    const response = await apiHelper.fetchData(BASE_URL);
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson; // Kembalikan seluruh objek JSON { success, message, data }
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
      `${BASE_URL}/${courseId}/contents`,
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
      `${BASE_URL}/${courseId}/contents/${contentId}`
    );
    return res.json();
  }

  async function updateContent(courseId, contentId, contentData) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents/${contentId}`,
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
      `${BASE_URL}/${courseId}/contents/${contentId}`,
      { method: "DELETE" }
    );
    return res.json();
  }

  async function changeContentStatus(courseId, contentId, statusData) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents/${contentId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusData),
      }
    );
    return res.json();
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
  };
})();

export default CourseApi;
