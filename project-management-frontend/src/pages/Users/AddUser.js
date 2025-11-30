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
    await api.post("/Users", form);
    navigate("/users");
  };

  return (
    <div className="page">
    <h2>Add User</h2>

    <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Enter full name" onChange={handleChange} />
        <input name="email" placeholder="Email address" onChange={handleChange} />
        <input name="password" placeholder="Password" onChange={handleChange} />
        <input name="role" placeholder="Role (Admin, Developer, Manager)" onChange={handleChange} />

        <button className="btn-primary">Create User</button>
    </form>
    </div>
  );
}

export default AddUser;
