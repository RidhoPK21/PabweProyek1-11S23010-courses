// src/features/auth/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import authApi from "../../../api/authApi";
import { Tabs, Tab, Button, Form, Card } from "react-bootstrap"; 

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  // State untuk form update
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // State untuk form password
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = async () => {
    setMessage("");
    setLoading(true);
    try {
      const data = await authApi.getProfile();
      const userData = data.user || data;
      
      setProfile(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
    } catch (err) {
      setMessage("❌ Gagal memuat profil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);
  
  // --- Handler Update Profile ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ name, email });
      setMessage("✅ Profil berhasil diperbarui!");
      loadProfile(); // Muat ulang data setelah sukses
    } catch (err) {
      setMessage("❌ Gagal memperbarui profil: " + err.message);
    }
  };

  // --- Handler Change Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Konfirmasi password tidak cocok!");
      return;
    }
    try {
      const payload = { password, new_password: newPassword };
      const res = await authApi.changePassword(payload);
      setMessage("✅ Password berhasil diubah!");
      
      // Bersihkan form
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("❌ Gagal mengubah password: " + err.message);
    }
  };
  
  // --- Handler Change Photo ---
  const handleChangePhoto = async (e) => {
    e.preventDefault();
    const photoFile = e.target.photo.files[0];
    if (!photoFile) return;

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const res = await authApi.changePhoto(formData);
      setMessage("✅ Foto profil berhasil diubah!");
      loadProfile(); // Muat ulang profil untuk menampilkan foto baru
    } catch (err) {
      setMessage("❌ Gagal mengubah foto: " + err.message);
    }
  };

  if (loading) return <div className="container mt-5">Loading Profile...</div>;
  if (!profile)
    return (
      <div className="container mt-5 alert alert-warning">
        Data profil tidak ditemukan.
      </div>
    );

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-3">Pengaturan Akun</h2>
      {message && (
        <div className={`alert ${message.startsWith("❌") ? "alert-danger" : "alert-info"}`}>
          {message}
        </div>
      )}

      <Tabs defaultActiveKey="view" className="mb-3" fill>
        
        {/* TAB 1: VIEW PROFILE (Informasi Dasar) */}
        <Tab eventKey="view" title="Lihat Profil">
          <Card className="shadow-sm">
            <Card.Body>
               <h5 className="card-title fw-bold">Informasi Dasar</h5>
               <p className="mt-3">Nama: {profile.name}</p>
               <p>Email: {profile.email}</p>
               <p>ID: {profile.id}</p>
               {profile.photo && (
                 <img src={profile.photo} alt="Foto Profil" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
               )}
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB 2: UPDATE PROFILE */}
        <Tab eventKey="update" title="Perbarui Informasi">
          <Card className="shadow-sm p-4">
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Simpan Perubahan
              </Button>
            </Form>
          </Card>
        </Tab>

        {/* TAB 3: CHANGE PHOTO */}
        <Tab eventKey="photo" title="Ubah Foto">
          <Card className="shadow-sm p-4">
             <Form onSubmit={handleChangePhoto}>
               <Form.Group className="mb-3">
                 <Form.Label>Pilih Foto Baru</Form.Label>
                 <Form.Control type="file" name="photo" accept="image/*" required />
               </Form.Group>
               <Button variant="primary" type="submit">
                 Upload Foto
               </Button>
             </Form>
          </Card>
        </Tab>
        
        {/* TAB 4: CHANGE PASSWORD */}
        <Tab eventKey="password" title="Ubah Password">
          <Card className="shadow-sm p-4">
            <Form onSubmit={handleChangePassword}>
              <Form.Group className="mb-3">
                <Form.Label>Password Lama</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password Baru</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Konfirmasi Password Baru</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="danger" type="submit">
                Ubah Password
              </Button>
            </Form>
          </Card>
        </Tab>
        
      </Tabs>
    </div>
  );
}