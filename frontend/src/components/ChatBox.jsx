import { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import "./ChatBox.css"; // Add this import

function ChatBox({ ticketId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    socket.emit("joinRoom", ticketId);

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

    const handleIncoming = (msg) => {
      if (msg.ticketId === ticketId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleIncoming);

    return () => {
      socket.emit("leaveRoom", ticketId);
      socket.off("newMessage", handleIncoming);
    };
  }, [ticketId, token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        "http://localhost:5050/api/messages",
        { ticketId, message: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      socket.emit("sendMessage", { ticketId });

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="chat-box-bubble-style">
      <h4 className="chat-title">Chat</h4>
      <div className="chat-messages-bubble">
        {messages.map((msg, idx) => {
          const isOwn = msg.sender?.role === "agent" || msg.sender?.name === "You";
          return (
            <div key={idx} className={`chat-bubble ${isOwn ? "own" : "other"}`}>
              <div className="sender-name">{msg.sender?.name || "You"}</div>
              <div className="bubble-content">{msg.message}</div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
