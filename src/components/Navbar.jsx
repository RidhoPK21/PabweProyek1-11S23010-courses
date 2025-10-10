import React from "react";

export default function Navbar() {
  // Navbar ini sekarang bisa lebih sederhana, atau bisa untuk search bar global
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light rounded-3 mb-4 shadow-sm p-3">
      <div className="container-fluid">
        {/* Kosongkan atau bisa diisi judul halaman dinamis nanti */}
        <div className="navbar-brand"></div>

        {/* Semua tombol di sini sudah dipindahkan */}
        <div className="ms-auto d-flex align-items-center">{/* KOSONG */}</div>
      </div>
    </nav>
  );
}
