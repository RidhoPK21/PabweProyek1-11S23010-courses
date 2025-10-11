// src/helpers/apiHelper.js
const apiHelper = (() => {
  async function fetchData(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const method = options.method || "GET";

    const config = {
      ...options,
      headers,
      method,
    };

    // PERBAIKAN KUNCI: Paksa GET request untuk selalu mengambil data baru dari server
    if (method === "GET") {
      config.cache = "no-store";
    }

    if (method === "GET" && config.body) {
      delete config.body;
    }

    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login?session_expired=true";
      }
    }

    if (!response.ok) {
      let errMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        errMessage = errorData.message || JSON.stringify(errorData);
      } catch (_) {}
      throw new Error(errMessage);
    }

    return response;
  }

  return { fetchData };
})();

export default apiHelper;
