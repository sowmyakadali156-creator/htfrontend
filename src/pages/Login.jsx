import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async () => {
    setMessage("");
    setMessageType("");

    if (!form.email.trim() || !form.password.trim()) {
      setMessage("Please enter email and password.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://habittracker-of6r.onrender.com/api/auth/login",
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful! Opening dashboard...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Daily Habit Tracker</h1>
        <h2>Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={loginUser} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p
            className={
              messageType === "success"
                ? "form-message success-message"
                : "form-message error-message"
            }
          >
            {message}
          </p>
        )}

        <p>Don't have an account?</p>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Login;