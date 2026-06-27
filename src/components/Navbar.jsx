import { Link, useNavigate } from "react-router-dom";
import logoIcon from "../assets/habit-tracker-icon.png";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logoIcon} alt="Habit Tracker logo" className="navbar-logo" />
        <h2>Habit Tracker</h2>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">
          <span className="material-symbols-outlined nav-icon">dashboard</span>
          Dashboard
        </Link>

        <Link to="/profile">
          <span className="material-symbols-outlined nav-icon">person</span>
          Profile
        </Link>

        <Link to="/community">
          <span className="material-symbols-outlined nav-icon">groups</span>
          Community
        </Link>

        <Link to="/calendar">
          <span className="material-symbols-outlined nav-icon">
            calendar_month
          </span>
          Calendar
        </Link>

        <button onClick={logout}>
          <span className="material-symbols-outlined nav-icon">logout</span>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;