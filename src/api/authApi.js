// src/api/authApi.js
import apiHelper from "../helpers/apiHelper";

const authApi = (() => {
  // Base URL untuk endpoint otentikasi
  const AUTH_BASE_URL = `/api/auth`;
  // Base URL untuk endpoint data pengguna (profil)
  const USER_BASE_URL = `/api/users`;

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

  /**
   * Mengambil data profil pengguna yang sedang login.
   * Method: GET
   * URL: /users/me
   */
  async function getProfile() {
    const response = await apiHelper.fetchData(`${USER_BASE_URL}/me`);
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson.data; // Mengembalikan data pengguna
  }

  /**
   * Memperbarui informasi profil (nama, email).
   * Method: PUT
   * URL: /users/me
   * Body: x-www-form-urlencoded
   */
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

  /**
   * Mengubah foto profil.
   * Method: POST
   * URL: /users/photo
   * Body: multipart/form-data
   */
  async function changePhoto(formData) {
    const response = await apiHelper.fetchData(`${USER_BASE_URL}/photo`, {
      method: "POST",
      body: formData, // FormData sudah otomatis set header multipart/form-data
    });
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.message);
    return resJson;
  }

  /**
   * Mengubah password pengguna.
   * Method: PUT
   * URL: /users/password
   * Body: x-www-form-urlencoded
   */
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
    getAllUsers, // Ekspor fungsi baru
  };
})();

export default authApi;
