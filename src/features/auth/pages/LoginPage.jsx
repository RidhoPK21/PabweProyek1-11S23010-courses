// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import authApi from "../../../api/authApi";

export default function LoginPage() {
  // State untuk input form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk menampilkan pesan error/sukses
  const [message, setMessage] = useState("");

  // State untuk mengontrol tombol loading (diambil dari versi Redux)
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 1. Mulai loading saat tombol diklik
    setMessage(""); // Hapus pesan lama

    try {
      // Panggil API
      const loginData = await authApi.postLogin(email, password);
      const token = loginData.token;

      if (token) {
        // Simpan token
        localStorage.setItem("token", token);
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
      setLoading(false); // 3. Hentikan loading jika terjadi error
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>
      {message && (
        <div
          className={`alert ${
            message.startsWith("❌") ? "alert-danger" : "alert-info"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleLogin} className="card p-4">
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

        <div className="text-end">
          {/* Tampilan tombol kondisional dari versi Redux */}
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
  );
}
