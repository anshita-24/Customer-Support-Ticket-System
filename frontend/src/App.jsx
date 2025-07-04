import TestChat from "./pages/TestChat"; // ✅ Add this line
import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardAgent from "./pages/DashboardAgent";
import DashboardAdmin from "./pages/DashboardAdmin";
import socket from "./socket"; // ✅ import socket instance

function App() {
  console.log("🧠 App.jsx loaded");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    
  }, []);

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer" element={<DashboardCustomer />} />
        <Route path="/agent" element={<DashboardAgent />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/test-chat" element={<TestChat />} />
      </Routes>
    </div>
  );
}

export default App;
