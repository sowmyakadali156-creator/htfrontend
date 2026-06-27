import { Link } from "react-router-dom";
import logo from "../assets/habit-logo.png";

function Home() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-brand">
          <img src={logo} alt="Habit Tracker Logo" />
          <span>Habit Tracker</span>
        </div>

        <div className="home-auth-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="home-main">
        <section className="home-hero">
          <div className="hero-content">
            <p className="hero-tag">BUILD BETTER ROUTINES</p>

            <h1>
              Track Today.
              <br />
              Grow Tomorrow.
            </h1>

            <p className="hero-text">
              Habit Tracker helps you build positive routines, stay
              consistent, monitor your progress, and achieve your daily goals.
            </p>

            <div className="hero-buttons">
              <Link to="/signup" className="primary-home-btn">
                Get Started
              </Link>

              <Link to="/login" className="secondary-home-btn">
  Login
</Link>
            </div>
          </div>

          <div className="hero-logo-box">
            <img src={logo} alt="Habit Tracker" />
          </div>
        </section>

        <section className="features-section">
          <h2>Everything You Need to Stay Consistent</h2>

          <div className="home-features">
            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                checklist
              </span>
              <h3>Manage Habits</h3>
              <p>Create daily habits, choose categories, and track completion.</p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                local_fire_department
              </span>
              <h3>Build Streaks</h3>
              <p>Stay motivated by tracking your current consistency streak.</p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                calendar_month
              </span>
              <h3>View Progress</h3>
              <p>Use the calendar and dashboard to understand your progress.</p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                groups
              </span>
              <h3>Join Community</h3>
              <p>Share motivation, like posts, and support other users.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;