import React, { useState } from "react";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/Users", form);

      // IMPORTANT → refresh UI
      navigate("/users");
    } catch (err) {
      console.error("Add user failed:", err);
    }
  };

  return (
    <div className="page">
      <h2>Add User</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" placeholder="Password" onChange={handleChange} required />
        <input name="role" placeholder="Role" onChange={handleChange} required />

        <button className="btn-primary">Create User</button>
      </form>
    </div>
  );
}

export default AddUser;
