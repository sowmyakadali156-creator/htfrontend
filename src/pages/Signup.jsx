import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  const signupUser = async () => {
    setMessage("");
    setMessageType("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage("Please fill all fields.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://habittracker-of6r.onrender.com/api/auth/signup",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }
      );

      setMessage("Signup successful!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";

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
        <h2>Signup</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

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

        <button onClick={signupUser} disabled={loading}>
          {loading ? "Creating Account..." : "Signup"}
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

        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Signup;