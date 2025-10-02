// src/api/CourseApi.js
import apiHelper from "../helpers/apiHelper";

const CourseApi = (() => {
  const BASE_URL = `${import.meta.env.VITE_DELCOM_BASEURL}/courses`;

  async function getCourses() {
    const res = await apiHelper.fetchData(BASE_URL);
    return res.json();
  }

  async function getCourseById(id) {
    const res = await apiHelper.fetchData(`${BASE_URL}/${id}`);
    return res.json();
  }

  async function addCourse(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.cover) {
      formData.append("cover", data.cover);
    }

    console.log("📤 Sending form data:", [...formData.entries()]);

    const res = await apiHelper.fetchData(BASE_URL, {
      method: "POST",
      body: formData,
      // jangan set Content-Type → biar browser set otomatis
    });

    return res.json();
  }

  async function updateCourse(id, data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.cover) {
      formData.append("cover", data.cover);
    }

    const res = await apiHelper.fetchData(`${BASE_URL}/${id}`, {
      method: "POST", // biasanya PATCH/PUT, cek API docs
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

  return { getCourses, getCourseById, addCourse, updateCourse, deleteCourse };
})();

export default CourseApi;
