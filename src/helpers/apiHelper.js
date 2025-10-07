// src/helpers/apiHelper.js
const apiHelper = (() => {
  async function fetchData(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // Tentukan method, default ke GET
    const method = options.method || "GET";

    const config = {
      ...options,
      headers,
      method,
    };

    // PERBAIKAN: Hapus 'body' dari konfigurasi jika metodenya adalah GET
    if (method === "GET" && config.body) {
      delete config.body;
    }

    const response = await fetch(url, config);

    // ✅ PERBAIKAN UTAMA: Tangani error 401 secara global
    if (response.status === 401) {
      localStorage.removeItem("token");
      // Cek apakah bukan halaman login, agar tidak terjadi loop tak terbatas
      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login?session_expired=true";
      }
    }

    // Kalau status bukan 200-299 → lempar error dengan detail body
    if (!response.ok) {
      let errMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        // Gunakan pesan error dari server jika tersedia
        errMessage = errorData.message || JSON.stringify(errorData);
      } catch (_) {}
      throw new Error(errMessage);
    }

    return response;
  }

  return { fetchData };
})();

export default apiHelper;
