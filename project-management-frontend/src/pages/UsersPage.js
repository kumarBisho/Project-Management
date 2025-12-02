import React, { useEffect, useState } from "react";
import { api } from "../api";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const loadUsers = async () => {
    const res = await api.get("/Users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await api.put(`/Users/${editId}`, form);
    } else {
      await api.post("/Users", form);
    }

    resetForm();
    loadUsers();
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "" });
    setEditId(null);
  };

  const editUser = (u) => {
    setEditId(u.id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await api.delete(`/Users/${id}`);
    loadUsers();
  };

  return (
    <div className="container">
      <h2>Manage Users</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <input name="name" value={form.name} placeholder="Name" onChange={handleChange} required />
        <input name="email" value={form.email} placeholder="Email" onChange={handleChange} required />
        <input name="password" value={form.password} placeholder="Password" onChange={handleChange} />
        <input name="role" value={form.role} placeholder="Role" onChange={handleChange} required />

        <button className="btn-primary" type="submit">
          {editId ? "Update User" : "Add User"}
        </button>

        {editId && <button className="btn-secondary" onClick={resetForm}>Cancel</button>}
      </form>

      <h3>User List</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id} className="user-card">
            {u.name} — {u.email} — {u.role}
            <button onClick={() => editUser(u)}>Edit</button>
            <button onClick={() => deleteUser(u.id)} className="danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
