// import react from 'react';
// import "./App.css";
// import UsersPage from './pages/UsersPage';
// import ProjectPage from './pages/ProjectPage';

// function App(){
//     return (
//       <div>
//         <h1>Project Management System</h1>
//         <UsersPage/>
//         <ProjectPage/>
//       </div>
//     )
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import ProjectsList from "./pages/Projects/ProjectsList";
import AddProject from "./pages/Projects/AddProject";
import EditProject from "./pages/Projects/EditProject";

import UsersList from "./pages/Users/UsersList";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <div className="container">
        <Routes>

          {/* Projects */}
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/add" element={<AddProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />

          {/* Users */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
