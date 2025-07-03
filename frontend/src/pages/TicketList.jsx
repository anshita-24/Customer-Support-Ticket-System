import React, { useEffect, useState } from "react";
import axios from "axios";

const TicketList = ({ role }) => {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let url = "";

        if (role === "customer") url = "/api/tickets";
        else if (role === "agent") url = "/api/tickets/assigned";
        else if (role === "admin") url = "/api/tickets/admin/all";

        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err.message);
      }
    };

    fetchTickets();
  }, [role]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="border p-4 rounded shadow">
              <h3 className="font-semibold">{ticket.subject}</h3>
              <p>{ticket.message}</p>
              <p>Status: <strong>{ticket.status}</strong></p>
              <p>Priority: <strong>{ticket.priority}</strong></p>
              {role === "admin" && ticket.user && (
                <p>Submitted by: {ticket.user.name} ({ticket.user.email})</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList;
