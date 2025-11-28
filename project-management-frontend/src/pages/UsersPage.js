import React, { useEffect, useState } from "react"; 
import { api } from "../api";

function UsersPage(){
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    // load all users
    const loadUsers = async ()=>{
        const res = await api.get("/Users")
        setUsers(res.data);
    };

    useEffect(()=>{
        loadUsers();
    }, []);

    // handle form input change
    const handleChange = (e)=>{
        setForm({
            ...form, 
            [e.target.name]: e.target.value
        });
    };

    // create new user
    const handleSubmit = async (e)=>{
        e.preventDefault();
        await api.post("/Users", form);
        loadUsers();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manage Users</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange}/>
                <input name="email" placeholder="Email" onChange={handleChange}/>
                <input name="password" placeholder="Password" onChange={handleChange}/>
                <input name="role" placeholder="Role" onChange={handleChange}/>

                <button type="submit">Add User</button>
            </form>

            <h3>Users List</h3>
            <ul>
                {users.map((user)=>(
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.role}
                    </li>
                ))}
            </ul>

        </div>
    );
    
}

export default UsersPage;