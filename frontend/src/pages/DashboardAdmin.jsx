// src/pages/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./DashboardAdmin.css";

function DashboardAdmin() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/tickets/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/users/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  const handleAssign = async (ticketId) => {
    const agentId = assignments[ticketId];
    if (!agentId) return alert("Please select an agent");

    try {
      await axios.post(
        "http://localhost:5050/api/tickets/assign",
        { ticketId, agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Ticket assigned!");
      fetchTickets();
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign ticket");
    }
  };

  return (
    <div>
       <Navbar />
    <div className="admin-dashboard"style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <h2 className="dashboard-heading">Admin Dashboard 🧩</h2>

      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="ticket-card">
            <h4 className="ticket-subject">{ticket.subject}</h4>
            <p className="ticket-message">{ticket.message}</p>

            <div className="ticket-meta">
              <span className={`status-badge ${ticket.status.replace("_", "-")}`}>
                {ticket.status}
              </span>
              <span className={`priority-badge ${ticket.priority}`}>
                {ticket.priority}
              </span>
            </div>

            <p className="assigned-to">
              Assigned To: {ticket.assignedTo?.name || "❌ Not Assigned"}
            </p>

            <p className="rating-info">
              Customer Rating:{" "}
              <strong>{ticket.rating ? `${ticket.rating} ⭐` : "Not rated yet"}</strong>
            </p>

            <div className="assign-controls">
              <label>Assign to Agent:</label>
              <select
                value={assignments[ticket._id] || ""}
                onChange={(e) =>
                  setAssignments({ ...assignments, [ticket._id]: e.target.value })
                }
              >
                <option value="">-- Select Agent --</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
              <button onClick={() => handleAssign(ticket._id)}>Assign</button>
            </div>
          </div>
        ))}
      </div>
    </div>
     </div>
  );
}

export default DashboardAdmin;
