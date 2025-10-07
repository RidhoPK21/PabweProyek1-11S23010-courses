import React, { useState } from "react";
import authApi from "../../../api/authApi";

export default function LoginPage() {
  // State untuk input form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk menampilkan pesan error/sukses
  const [message, setMessage] = useState("");

  // State untuk mengontrol tombol loading
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Panggil API
      const loginData = await authApi.postLogin(email, password);
      const token = loginData.token;

      // Ambil user_id dari respons
      const userId = loginData.user_id || loginData.id;

      if (token) {
        // Simpan token
        localStorage.setItem("token", token);

        // Menyimpan ID pengguna secara eksplisit
        if (userId) {
          localStorage.setItem("user_id", userId);
        }

        setMessage("✅ Login berhasil!");

        // Redirect ke halaman utama
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        throw new Error("Token tidak ditemukan dalam respons login.");
      }
    } catch (err) {
      setMessage("❌ " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      {/* 1. Form dibungkus dengan Card untuk tampilan yang lebih baik */}
      <div className="card p-4 p-md-5">
        <h2
          className="text-center fw-bold mb-4"
          style={{ color: "var(--primary-color)" }}
        >
          Selamat Datang
        </h2>

        {message && (
          <div
            className={`alert ${
              message.startsWith("❌") ? "alert-danger" : "alert-success"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              required
            />
          </div>

          {/* 2. Tombol dibuat full-width untuk tampilan mobile yang lebih baik */}
          <div className="d-grid mt-4">
            {loading ? (
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                &nbsp;Memuat...
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Masuk
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
