import { useEffect, useState } from "react";
import axios from "axios";

function DashboardAdmin() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState({}); // ticketId → agentId

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();

    // ✅ Hardcoded agents to continue working
    const dummyAgents = [
      {
        _id: "664b27f8a3f5bb2578888a01",
        name: "Agent A",
        email: "agent1@example.com",
      },
      {
        _id: "664b27f8a3f5bb2578888a02",
        name: "Agent B",
        email: "agent2@example.com",
      },
    ];
    setAgents(dummyAgents);

    // ❌ Temporarily skip API call causing issue
    // fetchAgents();
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

  // 🔒 Skipping this call for now
  // const fetchAgents = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/users/agents", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setAgents(res.data);
  //   } catch (err) {
  //     console.error("Failed to fetch agents", err);
  //   }
  // };

  const handleAssign = async (ticketId) => {
    const agentId = assignments[ticketId];
    if (!agentId) return alert("Please select an agent");

    try {
      await axios.post(
        "http://localhost:5000/api/tickets/assign",
        { ticketId, agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Ticket assigned!");
      fetchTickets(); // Refresh the list
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign ticket");
    }
  };

  return (
    <div className="p-6">
      <h2>Admin Dashboard - All Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <strong>{ticket.subject}</strong> - {ticket.status}
            <br />
            <label>Assign to:</label>
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
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardAdmin;
