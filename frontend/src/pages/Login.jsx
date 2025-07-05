// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Login.css";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Login successful");

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "agent") navigate("/agent");
      else navigate("/customer");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

 return (
  <>
    <Navbar /> {/* Added navbar at the top */}

    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Side - Image/Branding */}
      <div className="login-left">
        <div className="branding-content">
          <h1>Welcome to HelpDesk</h1>
          <p>Manage tickets, talk in real-time, and deliver great support.</p>
          <img src="/assets/support-illustration.svg" alt="Support Illustration" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p className="switch-auth">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </motion.div>
  </>
);

}

export default Login;
