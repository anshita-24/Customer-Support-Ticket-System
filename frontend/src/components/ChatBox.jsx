import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

function ChatBox({ ticketId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Join room for the ticket
    socket.emit("joinRoom", ticketId);

    // Load old messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/messages/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();

    // Listen for real-time messages
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [ticketId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
      ticketId,
      message: newMessage,
    };

    try {
      // Send to backend (will also be broadcast via socket)
      const res = await axios.post("http://localhost:5050/api/messages", msgData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit("sendMessage", {
        ticketId,
        message: res.data, // emit the saved message
      });

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <div className="border p-2 mt-2 rounded bg-gray-100">
      <h4 className="font-semibold">Chat</h4>
      <div className="max-h-40 overflow-y-auto text-sm mb-2">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender?.name || "You"}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-1 flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-2 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
