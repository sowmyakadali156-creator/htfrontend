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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const signupUser = async () => {
    setMessage("");

    try {
      const response = await axios.post(
        "https://habittracker-of6r.onrender.com/api/auth/signup",
        form
      );

      setMessage(response.data.message);
      alert(response.data.message);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.log("SIGNUP FRONTEND ERROR:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Signup failed";

      setMessage(errorMessage);
      alert(errorMessage);
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

        <button onClick={signupUser}>Signup</button>

        {message && <p>{message}</p>}

        <p>Already have an account?</p>
        <Link to="/">Login</Link>
      </div>
    </div>
  );
}

export default Signup;