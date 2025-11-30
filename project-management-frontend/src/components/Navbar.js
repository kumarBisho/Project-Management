import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="nav">
      <h2>Project Manager</h2>
      <div className="links">
        <Link to="/projects">Projects</Link>
        <Link to="/users">Users</Link>
      </div>
    </nav>
  );
}

export default Navbar;
