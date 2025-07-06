// src/pages/DashboardAgent.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";
import "./DashboardAgent.css";

function DashboardAgent() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAssignedTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/tickets/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (ticketId, field, value) => {
    try {
      await axios.put(
        `http://localhost:5050/api/tickets/${ticketId}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssignedTickets();
    } catch (err) {
      alert("Failed to update ticket");
    }
  };

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  return (
    <div>
      <Navbar />
    <div className="agent-dashboard" style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <h2 className="dashboard-heading">Welcome, Agent 🧑‍💻</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="no-ticket-msg">No tickets assigned to you.</p>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h3 className="ticket-subject">{ticket.subject}</h3>

              <p className="ticket-message">{ticket.message}</p>

              <div className="ticket-meta">
                <div className="meta-row">
                  <label>Status:</label>
                  <span className={`status-badge ${ticket.status.replace("_", "-")}`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="meta-row">
                  <label>Priority:</label>
                  <span className={`priority-badge ${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>

              {ticket.attachment && (
                <a
                  href={`http://localhost:5050/uploads/${ticket.attachment}`}
                  target="_blank"
                  rel="noreferrer"
                  className="attachment-link"
                >
                  📎 View Attachment
                </a>
              )}

              <div className="divider" />

              <div className="rating-info">
                Customer Rating:{" "}
                <strong>
                  {ticket.rating ? `${ticket.rating} ⭐` : "Not rated yet"}
                </strong>
              </div>

              <div className="divider" />

              <div className="controls">
                <div className="meta-row">
                  <label>Status:</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleUpdate(ticket._id, "status", e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="meta-row">
                  <label>Priority:</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handleUpdate(ticket._id, "priority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="divider" />

              <ChatBox ticketId={ticket._id} />
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default DashboardAgent;
