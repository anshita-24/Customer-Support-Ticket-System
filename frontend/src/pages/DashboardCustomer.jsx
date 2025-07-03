import { useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";


function DashboardCustomer() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
    tags: "",
  });

  const [tickets, setTickets] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5050/api/tickets",
        {
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Ticket created!");
      setFormData({ subject: "", message: "", priority: "medium", tags: "" });
      setTickets((prev) => [...prev, res.data]); // append new ticket to list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    }
  };

  return (
    <div>
      <h2>Welcome, Customer</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Describe your issue"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          name="tags"
          placeholder="Comma-separated tags (e.g. payment,login)"
          value={formData.tags}
          onChange={handleChange}
        />
        <button type="submit">Create Ticket</button>
      </form>

      {/* Optional: Show created tickets */}
      <h3>My Tickets:</h3>
     <ul>
  {tickets.map((ticket) => (
    <li key={ticket._id} style={{ marginBottom: "2rem" }}>
      <strong>{ticket.subject}</strong> - {ticket.status} ({ticket.priority})

      {/* ✅ Add Chat UI here */}
      <ChatBox ticketId={ticket._id} />
    </li>
  ))}
</ul>


    </div>
  );
}

export default DashboardCustomer;
