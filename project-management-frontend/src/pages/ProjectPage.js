import React, { useEffect, useState } from "react";
import { api } from "../api";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    managerName: ""
  });

  const loadProjects = async () => {
    const res = await api.get("/Projects");
    setProjects(res.data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/Projects", {
      ...form,
      createdAt: new Date().toISOString()
    });
    loadProjects();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Projects</h2>

      <form onSubmit={handleSubmit}>
        <input name="projectName" placeholder="Project Name" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input type="date" name="startDate" onChange={handleChange} />
        <input type="date" name="endDate" onChange={handleChange} />
        <input name="status" placeholder="Status" onChange={handleChange} />
        <input name="managerId" placeholder="ManagerId" onChange={handleChange} />

        <button type="submit">Add Project</button>
      </form>

      <h3>Project List</h3>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.projectName} — {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsPage;
