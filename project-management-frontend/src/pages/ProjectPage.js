import React, { useEffect, useState } from "react";
import { api } from "../api";
import "../App.css"; // make sure this is here

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create + Update form
  const [form, setForm] = useState({
    id: null,
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    managerId: "",
    teamMemberIds: []
  });

  // For adding a team member via PATCH
  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Projects");
      setProjects(res.data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/Users");
      setUsers(res.data);
    } catch {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "teamMemberIds") {
      const selected = Array.from(e.target.selectedOptions, (o) => Number(o.value));
      setForm({ ...form, teamMemberIds: selected });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      projectName: form.projectName,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      managerId: Number(form.managerId),
      teamMemberIds: form.teamMemberIds,
      createdAt: new Date().toISOString()
    };

    try {
      if (form.id) {
        await api.put(`/Projects/${form.id}`, payload);
      } else {
        await api.post("/Projects", payload);
      }

      resetForm();
      loadProjects();
    } catch {
      setError("Failed to save project");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "",
      managerId: "",
      teamMemberIds: []
    });
  };

  const editProject = (p) => {
    setForm({
      id: p.id,
      projectName: p.projectName,
      description: p.description,
      startDate: p.startDate.split("T")[0],
      endDate: p.endDate.split("T")[0],
      status: p.status,
      managerId: users.find((u) => u.name === p.managerName)?.id || "",
      teamMemberIds: p.teamMembers.map((tm) => tm.id)
    });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    await api.delete(`/Projects/${id}`);
    loadProjects();
  };

  // PATCH — Add Member
  const addTeamMember = async (projectId) => {
    if (!selectedUserToAdd) {
      alert("Select a user");
      return;
    }

    await api.patch(`/Projects/${projectId}/add-member/${selectedUserToAdd}`);
    loadProjects();
  };

  // PATCH — Remove Member
  const removeTeamMember = async (projectId, userId) => {
    await api.patch(`/Projects/${projectId}/remove-member/${userId}`);
    loadProjects();
  };

  return (
    <div className="container">
      <h2 className="page-title">Manage Projects</h2>

      <form className="card form-card" onSubmit={handleSubmit}>
        <h3>{form.id ? "Update Project" : "Create Project"}</h3>

        <input name="projectName" value={form.projectName} placeholder="Project Name" onChange={handleChange} />

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={handleChange}
        />

        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

        <input name="status" value={form.status} placeholder="Status" onChange={handleChange} />

        <label>Manager</label>
        <select name="managerId" value={form.managerId} onChange={handleChange}>
          <option value="">-- Select Manager --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <label>Team Members (multi-select)</label>
        <select
          multiple
          name="teamMemberIds"
          value={form.teamMemberIds}
          onChange={handleChange}
          className="multiselect"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" type="submit">
          {form.id ? "Update Project" : "Add Project"}
        </button>

        {form.id && (
          <button className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Project List</h3>

      {projects.map((p) => (
        <div key={p.id} className="card project-card">
          <h4>{p.projectName}</h4>
          <p>Status: {p.status}</p>
          <p>Manager: {p.managerName}</p>

          <h5>Team Members</h5>
          <ul>
            {p.teamMembers.map((tm) => (
              <li key={tm.id}>
                {tm.name}
                <button
                  className="btn btn-danger small-btn"
                  onClick={() => removeTeamMember(p.id, tm.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Add Team Member Section */}
          <div className="add-member-section">
            <select onChange={(e) => setSelectedUserToAdd(e.target.value)}>
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>

            <button className="btn btn-success" onClick={() => addTeamMember(p.id)}>
              Add Member
            </button>
          </div>

          <button className="btn btn-edit" onClick={() => editProject(p)}>
            Edit
          </button>

          <button className="btn btn-danger" onClick={() => deleteProject(p.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProjectsPage;
