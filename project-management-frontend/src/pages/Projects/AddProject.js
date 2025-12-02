import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

function AddProject() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    managerId: "",
    teamMemberIds: []
  });

  const loadUsers = async () => {
    const res = await api.get("/Users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "teamMemberIds") {
      const values = Array.from(e.target.selectedOptions, o => Number(o.value));
      setForm({ ...form, teamMemberIds: values });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/Projects", {
      ...form,
      createdAt: new Date().toISOString()
    });

    navigate("/projects");
  };

  return (
    <div className="page">
    <h2>Add Project</h2>

    <form className="form" onSubmit={handleSubmit}>
        
        <input name="projectName" placeholder="Project Name" onChange={handleChange} />

        <textarea name="description" placeholder="Project Description" onChange={handleChange} />

        <input type="date" name="startDate" onChange={handleChange} />
        <input type="date" name="endDate" onChange={handleChange} />

        <input name="status" placeholder="Status (Active, Pending...)" onChange={handleChange} />

        <label>Project Manager</label>
        <select name="managerId" onChange={handleChange}>
        <option value="">Select Manager</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        <label>Team Members</label>
        <select multiple name="teamMemberIds" onChange={handleChange} className="multiselect">
        {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
        ))}
        </select>

        <button className="btn-primary">Create Project</button>

    </form>
    </div>
  );
}

export default AddProject;
