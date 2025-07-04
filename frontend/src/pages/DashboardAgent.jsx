import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";

function DashboardAgent() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAssignedTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/tickets/assigned", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAssignedTickets(); // Refresh tickets after update
    } catch (err) {
      alert("Failed to update ticket");
    }
  };

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  return (
    <div className="p-6">
      <h2>Agent Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets assigned to you.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id} style={{ marginBottom: "2rem", listStyle: "none" }}>
              <div>
                <strong>{ticket.subject}</strong> - {ticket.status} ({ticket.priority})
                <br />
                <small>{ticket.message}</small>
                <br />

                {/* ✅ Show attachment link */}
                {ticket.attachment && (
                  <a
                    href={`http://localhost:5050/uploads/${ticket.attachment}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View Attachment
                  </a>
                )}

                <br />
                ✅ Customer Rating: {ticket.rating ? `${ticket.rating} ⭐` : "Not rated yet"}

                {/* ✅ Status & Priority Controls */}
                <div style={{ marginTop: "0.5rem" }}>
                  <label>Status: </label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleUpdate(ticket._id, "status", e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>

                  <label style={{ marginLeft: "1rem" }}>Priority: </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handleUpdate(ticket._id, "priority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* ✅ Real-time Chat */}
                <ChatBox ticketId={ticket._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardAgent;
