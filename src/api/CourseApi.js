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
  async function getStudentsByCourseId(courseId) {
    // ✅ FUNGSI PENGAMBIL DAFTAR SISWA
    const response = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/students`,
      { method: "GET" }
    );
    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson;
  }

  async function addStudent(courseId) {
    const res = await apiHelper.fetchData(`${BASE_URL}/${courseId}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // Body tidak diperlukan karena API menggunakan token
    });
    return res.json();
  }

  async function leaveCourse(courseId) {
    const res = await apiHelper.fetchData(`${BASE_URL}/${courseId}/students`, {
      method: "DELETE",
    });
    return res.json();
  }

  // ✅ Fungsi ini untuk mengubah rating PENGGUNA SAAT INI
  async function changeMyRating(courseId, ratingData) {
    const urlEncodedBody = new URLSearchParams(ratingData);
    const res = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/students/ratings`, // URL sesuai dokumentasi
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
    // ✅ PERBAIKAN: Gunakan format URL /-/ sesuai dokumentasi
    const cleanContentId = String(contentId).split(":")[0];
    const res = await apiHelper.fetchData(
      `${BASE_URL}/-/contents/${cleanContentId}`
    );
    return res.json();
  }

  async function updateContent(courseId, contentId, contentData) {
    // ✅ PERBAIKAN: Sesuaikan payload dengan dokumentasi (hanya title & youtube)
    const payload = {
      title: contentData.title,
      youtube: contentData.video, // Asumsikan contentData.video berisi URL youtube
    };
    const urlEncodedBody = new URLSearchParams(payload);

    const res = await apiHelper.fetchData(
      // ✅ PERBAIKAN: Gunakan format URL yang benar
      `${BASE_URL}/-/contents/${contentId}`,
      {
        method: "PUT",
        // ✅ PERBAIKAN: Gunakan header yang benar
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlEncodedBody,
      }
    );
    return res.json();
  }

  async function deleteContent(courseId, contentId) {
    const cleanContentId = String(contentId).split(":")[0];

    const res = await apiHelper.fetchData(
      // ✅ PERBAIKAN URL
      `${BASE_URL}/-/contents/${cleanContentId}`,
      {
        method: "DELETE",
        // ✅ PERBAIKAN HEADER (meskipun tidak logis, kita ikuti dokumentasi)
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
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

  async function getContentsByCourseId(courseId) {
    // ✅ FUNGSI PENGAMBIL DAFTAR MATERI
    const response = await apiHelper.fetchData(
      `${BASE_URL}/${courseId}/contents`,
      { method: "GET" }
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
    leaveCourse,
    changeMyRating,
    getStudentsByCourseId, // ✅ EXPORT
    addContent,
    getContentById,
    updateContent,
    deleteContent,
    changeContentStatus,
    getContentsByCourseId, // ✅ EXPORT
  };
})();

export default CourseApi;
