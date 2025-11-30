import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";

function ProjectsList() {
  const [projects, setProjects] = useState([]);

  const loadProjects = async () => {
    const res = await api.get("/Projects");
    setProjects(res.data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;
    await api.delete(`/Projects/${id}`);
    loadProjects();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Projects</h2>
        <Link className="btn-primary" to="/projects/add">+ Add Project</Link>
      </div>

      <div className="list">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.projectName}</h3>
            <p>Status: {p.status}</p>
            <p>Manager: {p.managerName}</p>
            <p>
            Team Members:{" "}
            {p.teamMembers?.length > 0
                ? p.teamMembers.map(tm => tm.name).join(", ")
                : "No Members Assigned"}
            </p>

            <Link className="btn-small" to={`/projects/edit/${p.id}`}>
              Edit
            </Link>

            <button
              className="btn-danger-small"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ProjectsList;
