import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    managerId: "",
    teamMemberIds: []
  });

  const loadProject = async () => {
    const res = await api.get(`/Projects/${id}`);
    const p = res.data;

    setProject(p);

    setForm({
      projectName: p.projectName,
      description: p.description,
      startDate: p.startDate.split("T")[0],
      endDate: p.endDate.split("T")[0],
      status: p.status,
      managerId: "",
      teamMemberIds: p.teamMembers.map((tm) => tm.id)
    });

    const managerUser = users.find((u) => u.name === p.managerName);
    if (managerUser) {
      setForm((prev) => ({ ...prev, managerId: managerUser.id }));
    }
  };

  const loadUsers = async () => {
    const res = await api.get("/Users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      loadProject();
    }
  }, [users]);

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

    await api.put(`/Projects/${id}`, {
      ...form,
      managerId: Number(form.managerId),
      teamMemberIds: form.teamMemberIds,
      createdAt: project.createdAt
    });

    navigate("/projects");
  };

  const addMember = async () => {
    if (!selectedUserToAdd) return alert("Select a user");
    await api.patch(`/Projects/${id}/add-member/${selectedUserToAdd}`);
    loadProject();
  };

  const removeMember = async (userId) => {
    await api.patch(`/Projects/${id}/remove-member/${userId}`);
    loadProject();
  };

  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");

  if (!project) return <p>Loading...</p>;

  return (
    <div className="page">
    <h2>Edit Project</h2>

    <form className="form" onSubmit={handleSubmit}>
        
        <input name="projectName" value={form.projectName} onChange={handleChange} />

        <textarea name="description" value={form.description} onChange={handleChange} />

        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

        <input name="status" value={form.status} onChange={handleChange} />

        <label>Manager</label>
        <select name="managerId" value={form.managerId} onChange={handleChange}>
        <option value="">Select Manager</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        <label>Team Members</label>
        <select multiple name="teamMemberIds" value={form.teamMemberIds} onChange={handleChange} className="multiselect">
        {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
        ))}
        </select>

        <button className="btn-primary">Save Changes</button>
    </form>

    <hr />

    <h3>Modify Team Members</h3>

    <div className="add-member-section">
        <select onChange={(e) => setSelectedUserToAdd(e.target.value)}>
        <option value="">Select user</option>
        {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
        ))}
        </select>

        <button className="btn-success" onClick={addMember}>Add Member</button>
    </div>

    <h4>Current Team Members</h4>
    <ul>
        {project.teamMembers.map((tm) => (
        <li key={tm.id}>
            {tm.name}
            <button className="btn-danger-small" onClick={() => removeMember(tm.id)}>Remove</button>
        </li>
        ))}
    </ul>
    </div>
  );
}

export default EditProject;
