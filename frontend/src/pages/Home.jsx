// src/pages/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../components/Navbar";
import "./Home.css";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

function Home() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <>
      <Navbar />

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          fpsLimit: 60,
          particles: {
            number: { value: 0 },
            shape: { type: "circle" },
            color: { value: "#f5c219" },
            size: { value: { min: 2, max: 4 } },
            life: {
              duration: { sync: true, value: 1 },
              count: 1,
            },
            move: {
              enable: true,
              gravity: { enable: true, acceleration: 9.81 },
              speed: { min: 10, max: 20 },
              decay: 0.1,
              direction: "none",
              outModes: {
                default: "destroy",
              },
            },
          },
          emitters: {
            direction: "none",
            rate: {
              delay: 0.5,
              quantity: 10,
            },
            size: {
              width: 0,
              height: 0,
            },
            position: {
              x: 50,
              y: 50,
            },
          },
        }}
      />

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
              src="/support-hero.json" // Make sure this exists in `public/`
              style={{ height: "400px", width: "400px" }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Home;
