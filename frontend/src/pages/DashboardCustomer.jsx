// src/pages/DashboardCustomer.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import "./DashboardCustomer.css";
import Navbar from "../components/Navbar";

function DashboardCustomer() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
    tags: "",
    attachment: null,
  });
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("subject", formData.subject);
    form.append("message", formData.message);
    form.append("priority", formData.priority);
    form.append("tags", formData.tags);
    if (formData.attachment) {
      form.append("attachment", formData.attachment);
    }

    try {
      const res = await axios.post("http://localhost:5050/api/tickets", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Ticket created!");
      setFormData({ subject: "", message: "", priority: "medium", tags: "", attachment: null });
      setTickets((prev) => [...prev, res.data]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load your tickets", err);
    }
  };

  const handleRateTicket = async (ticketId, rating) => {
    try {
      await axios.put(
        `http://localhost:5050/api/tickets/rate/${ticketId}`,
        { rating: Number(rating) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted!");
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to rate ticket");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <Navbar />
   <div className="dashboard-scroll-container">
    <div className="customer-dashboard-timeline">
      <h2 className="dashboard-heading">Welcome, Customer 👋</h2>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <h3>Create a Ticket</h3>
        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <textarea name="message" placeholder="Describe your issue" value={formData.message} onChange={handleChange} required />
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="text" name="tags" placeholder="Comma-separated tags (e.g. payment,login)" value={formData.tags} onChange={handleChange} />
        <input type="file" name="attachment" onChange={handleFileChange} />
        <button type="submit">Submit Ticket</button>
      </form>

      <div className="timeline-container">
        <h3>My Tickets</h3>
        <div className="timeline">
          {tickets.map((ticket, index) => (
            <div key={ticket._id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>{ticket.subject}</h4>
                <p>{ticket.message}</p>
                <p><strong>Priority:</strong> {ticket.priority}</p>
                <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                {ticket.attachment && (
                  <a href={`http://localhost:5050/uploads/${ticket.attachment}`} target="_blank" rel="noreferrer">📎 View Attachment</a>
                )}
                <ChatBox ticketId={ticket._id} />
                {ticket.status === "resolved" && (
                  <div className="rating-box">
                    <label>Rate this ticket: </label>
                    <select defaultValue={ticket.rating || ""} onChange={(e) => handleRateTicket(ticket._id, e.target.value)}>
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
    </div>
  );
}

export default DashboardCustomer;
