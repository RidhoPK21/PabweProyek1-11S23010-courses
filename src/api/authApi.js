// src/api/authApi.js
import apiHelper from "../helpers/apiHelper";

const authApi = (() => {
  // --- PERBAIKAN UTAMA ADA DI SINI ---
  // Base URL diambil dari environment variable untuk production
  const AUTH_BASE_URL = `${import.meta.env.VITE_DELCOM_BASEURL}/auth`;
  const USER_BASE_URL = `${import.meta.env.VITE_DELCOM_BASEURL}/users`;

  // --- FUNGSI OTENTIKASI ---
  async function postLogin(email, password) {
    const response = await apiHelper.fetchData(`${AUTH_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson.data;
  }

  async function postRegister(name, email, password) {
    const response = await apiHelper.fetchData(`${AUTH_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const { success, message } = await response.json();
    if (!success) throw new Error(message);
    return message;
  }

  // --- FUNGSI PROFIL PENGGUNA ---
  async function getProfile() {
    const response = await apiHelper.fetchData(`${USER_BASE_URL}/me`);
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson.data;
  }

  async function updateProfile(profileData) {
    const urlEncodedBody = new URLSearchParams(profileData);
    const response = await apiHelper.fetchData(`${USER_BASE_URL}/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlEncodedBody,
    });
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson;
  }

  async function changePhoto(formData) {
    const response = await apiHelper.fetchData(`${USER_BASE_URL}/photo`, {
      method: "POST",
      body: formData,
    });
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson;
  }

  async function changePassword(passwordData) {
    const urlEncodedBody = new URLSearchParams(passwordData);
    const response = await apiHelper.fetchData(`${USER_BASE_URL}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlEncodedBody,
    });
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson;
  }

  async function getAllUsers() {
    const response = await apiHelper.fetchData(USER_BASE_URL);
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson.data;
  }

  return {
    postRegister,
    postLogin,
    getProfile,
    updateProfile,
    changePhoto,
    changePassword,
    getAllUsers,
  };
})();

export default authApi;
