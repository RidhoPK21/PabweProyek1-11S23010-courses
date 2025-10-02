// src/helpers/apiHelper.js
const apiHelper = (() => {
  async function fetchData(url, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    // Kalau status bukan 200-299 → lempar error dengan detail body
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
