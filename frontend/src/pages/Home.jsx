// src/pages/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../components/Navbar";
import "./Home.css";
import Particles from "react-tsparticles";

function Home() {
  return (
    <>
      <Navbar />
      <motion.div
        className="home-hero-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1>Smarter Support Starts Here</h1>
            <p>HelpDesk gives you real-time ticketing, agent chat, and automated service.</p>
            <div className="home-hero-buttons">
              <Link to="/login" className="hero-btn primary">Login</Link>
              <Link to="/signup" className="hero-btn secondary">Sign Up</Link>
            </div>
          </div>

          <div className="home-hero-animation">
            <Player
              autoplay
              loop
              src="/support-hero.json" // ✅ Public path
              style={{ height: "400px", width: "400px" }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
