import React, { useState, useEffect } from "react";
import authApi from "../../../api/authApi";
import { Table, Image, Form, InputGroup, Card } from "react-bootstrap"; // 1. Import Card
import { Search } from "react-bootstrap-icons";

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await authApi.getAllUsers();
        const userData = data.users || data || [];
        setUsers(userData);
        setFilteredUsers(userData); // Inisialisasi daftar yang ditampilkan
      } catch (err) {
        setError("Failed to load user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Effect untuk filtering
  useEffect(() => {
    const result = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchQuery, users]);

  if (loading)
    return <div className="container-fluid">Loading user data...</div>;
  if (error)
    return <div className="container-fluid alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <h1 className="fw-bold mb-4">User List</h1>

      <InputGroup className="mb-4">
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Search username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {/* 2. Bungkus Tabel dengan komponen Card */}
      <Card>
        <Card.Body>
          <Table striped hover responsive>
            {/* 3. Hapus 'bordered' dan 'className="card"' untuk tampilan lebih bersih */}
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  // 4. Tambahkan className="align-middle" agar konten sel sejajar di tengah
                  <tr key={user.id} className="align-middle">
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Image
                          src={
                            user.photo ||
                            `https://ui-avatars.com/api/?name=${user.name}&background=random`
                          }
                          alt={`Foto ${user.name}`}
                          roundedCircle
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                          }}
                        />
                        <strong className="ms-3">{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    {searchQuery
                      ? `Pengguna dengan nama "${searchQuery}" tidak ditemukan.`
                      : "Tidak ada data pengguna."}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserListPage;