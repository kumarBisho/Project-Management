
import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);     // for details
  const [loadingDetails, setLoadingDetails] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await api.get("/Users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  // Load user full details
  const loadUserDetails = async (userId) => {
    setLoadingDetails(true);

    try {
      const res = await api.get(`/Users/${userId}`);
      setExpandedUser(res.data);
    } catch (err) {
      console.error("Error loading user details:", err);
    }

    setLoadingDetails(false);
  };

  const toggleDetails = (id) => {
    if (expandedUser && expandedUser.id === id) {
      setExpandedUser(null); // collapse
    } else {
      loadUserDetails(id);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/Users/${id}`);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="page">
      <h2>Users List</h2>
      <Link className="btn-primary" to="/users/add">+ Add User</Link>

      <div className="list">
        {users.map((u) => (
          <div key={u.id} className="card">
            <h3>{u.name}</h3>
            <p>Email: {u.email}</p>
            <p>Role: {u.role}</p>

            <div style={{ marginTop: "10px" }}>
              <button className="btn-small" onClick={() => toggleDetails(u.id)}>
                {expandedUser?.id === u.id ? "Hide Details" : "View Projects"}
              </button>

              <Link className="btn-small" to={`/users/edit/${u.id}`}>
                Edit
              </Link>

              <button
                className="btn-danger-small"
                onClick={() => handleDelete(u.id)}
              >
                Delete
              </button>
            </div>

            {/* EXPANDED PROJECT DETAILS */}
            {expandedUser?.id === u.id && (
              <div className="project-details">
                <h4>Project Details</h4>

                {loadingDetails ? (
                  <p>Loading...</p>
                ) : expandedUser.teamProjects?.length > 0 ? (
                  expandedUser.teamProjects.map((p) => (
                    <div key={p.id} className="card" style={{ marginTop: "10px" }}>
                      <h4>{p.projectName}</h4>
                      <p>Status: {p.status}</p>
                      
                      <button
                        className="btn-small"
                        onClick={() => (window.location = `/projects/edit/${p.id}`)}
                      >
                        Open Project
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No detailed project data available</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersList;
