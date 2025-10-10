// src/features/auth/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import authApi from "../../../api/authApi";
import { Tabs, Tab, Button, Form, Card, Image } from "react-bootstrap";

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
      setMessage("❌ Failed to load profile: " + err.message);
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
      setMessage("✅ Profile updated successfully!");
      loadProfile(); // Muat ulang data setelah sukses
    } catch (err) {
      setMessage("❌ Failed to update profile: " + err.message);
    }
  };


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
    }
  };

  
  // --- Handler Change Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Confirm password does not match!");
      return;
    }
    try {
      const payload = { password, new_password: newPassword };
      const res = await authApi.changePassword(payload);
      setMessage("✅ Password changed successfully!");
      
      // Bersihkan form
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage("❌ Failed to change password: " + err.message);
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
      setMessage("✅ Profile photo changed successfully!");
      loadProfile(); // Muat ulang profil untuk menampilkan foto baru
    } catch (err) {
      setMessage("❌ Failed to change photo: " + err.message);
    }
  };

  if (loading) return <div className="container mt-5">Loading Profile...</div>;
  if (!profile)
    return (
      <div className="container mt-5 alert alert-warning">
        Profile data not found.
      </div>
    );

 return (
   <div className="container-fluid">
     {/* Header dengan Judul dan Tombol Logout */}
     <div className="d-flex justify-content-between align-items-center mb-4">
       <h1 className="fw-bold">Account Settings</h1>
       <Button variant="danger" onClick={handleLogout}>
         Logout
       </Button>
     </div>

     {message && (
       <div
         className={`alert ${
           message.startsWith("❌") ? "alert-danger" : "alert-info"
         }`}
       >
         {message}
       </div>
     )}

     {/* Menampilkan gambar profil di atas Tabs */}
     <div className="text-center mb-5">
       <Image
         src={profile.photo || "https://via.placeholder.com/150"}
         alt="Foto Profil"
         roundedCircle
         style={{
           width: "150px",
           height: "150px",
           objectFit: "cover",
           border: "4px solid white",
           boxShadow: "var(--card-shadow)",
         }}
       />
     </div>

     <Tabs defaultActiveKey="update" className="mb-3" fill>
       {/* TAB: UPDATE PROFILE */}
       <Tab eventKey="update" title="Update Information">
         <Card className="shadow-sm p-4">
           <Form onSubmit={handleUpdate}>
             <Form.Group className="mb-3">
               <Form.Label>Full name</Form.Label>
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
               Save Changes
             </Button>
           </Form>
         </Card>
       </Tab>

       {/* TAB: CHANGE PHOTO */}
       <Tab eventKey="photo" title="Change Photo">
         <Card className="shadow-sm p-4">
           <Form onSubmit={handleChangePhoto}>
             <Form.Group className="mb-3">
               <Form.Label>Select New Photo</Form.Label>
               <Form.Control
                 type="file"
                 name="photo"
                 accept="image/*"
                 required
               />
             </Form.Group>
             <Button variant="primary" type="submit">
               Upload Photo
             </Button>
           </Form>
         </Card>
       </Tab>

       {/* TAB: CHANGE PASSWORD */}
       <Tab eventKey="password" title="Change Password">
         <Card className="shadow-sm p-4">
           <Form onSubmit={handleChangePassword}>
             <Form.Group className="mb-3">
               <Form.Label>Old Password</Form.Label>
               <Form.Control
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>New Password</Form.Label>
               <Form.Control
                 type="password"
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 required
               />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>Confirm New Password</Form.Label>
               <Form.Control
                 type="password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
               />
             </Form.Group>
             <Button variant="primary" type="submit">
               Change Password
             </Button>
           </Form>
         </Card>
       </Tab>
     </Tabs>
   </div>
 );
}