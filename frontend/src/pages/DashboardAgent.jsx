import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";


function DashboardAgent() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedTickets = async () => {
    const token = localStorage.getItem("token");

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
    <li key={ticket._id} style={{ marginBottom: "2rem" }}>
      <strong>{ticket.subject}</strong> - {ticket.status} ({ticket.priority})
      <br />
      <small>{ticket.message}</small>

      {/* ChatBox below each ticket */}
      <ChatBox ticketId={ticket._id} />
    </li>
  ))}
</ul>

      )}
    </div>
  );
}

export default DashboardAgent;
