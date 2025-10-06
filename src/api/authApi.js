// src/api/authApi.js
import apiHelper from "../helpers/apiHelper";

const authApi = (() => {
  // PERBAIKAN UTAMA: Gunakan proxy '/api', bukan URL dari internet
  const BASE_URL = `/api/auth`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postLogin(email, password) {
    const response = await apiHelper.fetchData(_url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const resJson = await response.json();
    if (!resJson.success) {
      throw new Error(resJson.message);
    }
    return resJson.data; // Ini akan mengembalikan objek { token: "..." }
  }

  async function postRegister(name, email, password) {
    const response = await apiHelper.fetchData(_url("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }
    return message;
  }

  return {
    postRegister,
    postLogin,
  };
})();

export default authApi;
