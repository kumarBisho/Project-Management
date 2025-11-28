import react from 'react';
import UsersPage from './pages/UsersPage';
import ProjectPage from './pages/ProjectPage';

function App(){
    return (
      <div>
        <h1>Project Management System</h1>
        <UsersPage/>
        <ProjectPage/>
      </div>
    )
}

export default App;