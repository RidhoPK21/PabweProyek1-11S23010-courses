import { useState, useEffect } from "react";

/**
 * Custom Hook untuk menangani siklus pengambilan data API (loading, data, error).
 * @param {Function} apiFunc - Fungsi API yang akan dipanggil.
 * @returns {{data: any, loading: boolean, error: string}}
 */
function useApi(apiFunc) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await apiFunc();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunc]);

  return { data, loading, error };
}

export default useApi;
