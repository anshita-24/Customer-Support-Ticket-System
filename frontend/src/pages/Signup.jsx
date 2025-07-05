import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import "./Signup.css"; // use matching styling

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // default role
  });

  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scroll on this page
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", formData);
      alert("Registration successful");
      navigate("/login"); // Redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <Navbar />

      <motion.div
        className="signup-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Branding Section */}
        <div className="signup-left">
          <div className="branding-content">
            <h1>Create your HelpDesk account</h1>
            <p>Track issues, talk to support agents, and resolve queries faster.</p>
            <img src="/assets/Security-cuate.svg" alt="Support Illustration" />
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="signup-right">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
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

            <select name="role" onChange={handleChange} required>
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit">Signup</button>

            <p className="switch-auth">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export default Signup;
