import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../../../api/authApi";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const msg = await authApi.postRegister(name, email, password);
      setMessage("✅ " + msg + " Silakan login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card p-4 p-md-5">
        <h2
          className="text-center fw-bold mb-4"
          style={{ color: "var(--primary-color)" }}
        >
          Buat Akun Baru
        </h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Nama</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
        <p className="text-center mt-3 text-muted small">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
