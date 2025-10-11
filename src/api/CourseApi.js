// src/api/CourseApi.js
import apiHelper from "../helpers/apiHelper";

const CourseApi = (() => {
  // BASE_URL sudah benar mengambil dari environment variable
  const BASE_URL = import.meta.env.VITE_DELCOM_BASEURL;

  // --- Course Management ---
  async function getCourses() {
    // PERBAIKAN: Tambahkan path '/courses'
    const response = await apiHelper.fetchData(`${BASE_URL}/courses`);
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  async function getCourseById(id) {
    // PERBAIKAN: Tambahkan path '/courses/'
    const url = `${BASE_URL}/courses/${id}`;
    const response = await apiHelper.fetchData(url);
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

    // PERBAIKAN: Tambahkan path '/courses'
    const res = await apiHelper.fetchData(`${BASE_URL}/courses`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }

  async function updateCourse(id, formData) {
    formData.append("_method", "PUT");
    // PERBAIKAN: Tambahkan path '/courses/'
    const res = await apiHelper.fetchData(`${BASE_URL}/courses/${id}`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }

  async function changeCover(id, coverFile) {
    const formData = new FormData();
    formData.append("cover", coverFile);
    formData.append("_method", "PATCH");
    // PERBAIKAN: Tambahkan path '/courses/.../cover'
    const res = await apiHelper.fetchData(`${BASE_URL}/courses/${id}/cover`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  }

  async function deleteCourse(id) {
    // PERBAIKAN: Tambahkan path '/courses/'
    const res = await apiHelper.fetchData(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
    });
    return res.json();
  }

  async function changeContentStatus(contentId, statusData) {
    const cleanContentId = String(contentId).split(":")[0];
    const urlEncodedBody = new URLSearchParams(statusData);

    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/-/contents/${cleanContentId}/learns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlEncodedBody,
      }
    );
    return res.json();
  }

  // --- Student Management ---
  async function addStudent(courseId) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/${courseId}/students`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const resJson = await res.json();
    if (!resJson.success) {
      throw new Error(resJson.message || "Gagal mendaftar ke kursus.");
    }
    return resJson;
  }

  async function leaveCourse(courseId) {
    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/${courseId}/students`,
      {
        method: "DELETE",
      }
    );
    return res.json();
  }

  async function changeMyRating(courseId, ratingData) {
    const urlEncodedBody = new URLSearchParams(ratingData);
    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/${courseId}/students/ratings`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlEncodedBody,
      }
    );
    return res.json();
  }

  // --- Content Management ---
  async function addContent(courseId, contentData) {
    const response = await apiHelper.fetchData(
      `${BASE_URL}/courses/${courseId}/contents`,
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
    const cleanContentId = String(contentId).split(":")[0];
    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/-/contents/${cleanContentId}`
    );
    return res.json();
  }

  async function updateContent(courseId, contentId, contentData) {
    const payload = {
      title: contentData.title,
      youtube: contentData.video,
    };
    const urlEncodedBody = new URLSearchParams(payload);

    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/-/contents/${contentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlEncodedBody,
      }
    );
    return res.json();
  }

  async function deleteContent(courseId, contentId) {
    const cleanContentId = String(contentId).split(":")[0];
    const res = await apiHelper.fetchData(
      `${BASE_URL}/courses/-/contents/${cleanContentId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return res.json();
  }

  async function getContentsByCourseId(courseId) {
    const response = await apiHelper.fetchData(
      `${BASE_URL}/courses/${courseId}/contents`,
      { method: "GET" }
    );
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  // getStudentsByCourseId juga perlu URL lengkap
  async function getStudentsByCourseId(courseId) {
    const response = await apiHelper.fetchData(
      `${BASE_URL}/courses/${courseId}/students`,
      { method: "GET" }
    );
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
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
    leaveCourse,
    changeMyRating,
    getStudentsByCourseId,
    addContent,
    getContentById,
    updateContent,
    deleteContent,
    changeContentStatus,
    getContentsByCourseId,
  };
})();

export default CourseApi;
