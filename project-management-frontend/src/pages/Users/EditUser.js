import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const loadUser = async () => {
    const res = await api.get(`/Users/${id}`);
    const u = res.data;

    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(`/Users/${id}`, form);
    navigate("/users");
  };

  return (
    <div className="page">
    <h2>Edit User</h2>

    <form className="form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} />
        <input name="email" value={form.email} onChange={handleChange} />
        <input name="password" placeholder="New Password" onChange={handleChange} />
        <input name="role" value={form.role} onChange={handleChange} />

        <button className="btn-primary">Save Changes</button>
    </form>
    </div>
  );
}

export default EditUser;
