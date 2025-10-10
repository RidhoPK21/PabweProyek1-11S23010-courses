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
    const url = `${BASE_URL}/${id}`;

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


  async function changeContentStatus(contentId, statusData) {
    const cleanContentId = String(contentId).split(":")[0];
    const urlEncodedBody = new URLSearchParams(statusData); // statusData akan menjadi { status: 1 } atau { status: 0 }

    const res = await apiHelper.fetchData(
      `${BASE_URL}/-/contents/${cleanContentId}/learns`, // URL Sesuai dokumentasi
      {
        method: "POST", // Method POST
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Header Sesuai dokumentasi
        body: urlEncodedBody,
      }
    );
    return res.json();
  }

  // --- Student Management ---
  async function getStudentsByCourseId(courseId) {
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

  // ✅ REVERTED: Hanya courseId, mengandalkan token di header
async function addStudent(courseId) {
  const res = await apiHelper.fetchData(`${BASE_URL}/${courseId}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // Body tidak diperlukan karena API menggunakan token
  });
  const resJson = await res.json();
  if (!resJson.success) {
    // KRITIS: Cek sukses dari JSON response
    throw new Error(resJson.message || "Gagal mendaftar ke kursus.");
  }
  return resJson;
}

  async function leaveCourse(courseId) {
    const res = await apiHelper.fetchData(`${BASE_URL}/${courseId}/students`, {
      method: "DELETE",
    });
    return res.json();
  }

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

  // --- Content Management (dibiarkan tetap) ---
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
    const cleanContentId = String(contentId).split(":")[0];
    const res = await apiHelper.fetchData(
      `${BASE_URL}/-/contents/${cleanContentId}`
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
      `${BASE_URL}/-/contents/${contentId}`,
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
      `${BASE_URL}/-/contents/${cleanContentId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return res.json();
  }

  // async function changeContentStatus(courseId, contentId, statusData) {
  //   const res = await apiHelper.fetchData(
  //     `${BASE_URL}/${courseId}/contents/${contentId}/status`,
  //     {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(statusData),
  //     }
  //   );
  //   return res.json();
  // }

  async function getContentsByCourseId(courseId) {
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
    getStudentsByCourseId,
    addContent,
    getContentById,
    updateContent,
    deleteContent,
    changeContentStatus,
    getContentsByCourseId,
    changeContentStatus,
  };
})();

export default CourseApi;
