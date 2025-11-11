// Task 2,  3 , 4 and 5
import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";

const Chat = ({ userId, username, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // Register user on socket
    socket.emit("register", { userId, username });

    // Join private room
    socket.emit("joinRoom", { userId, receiverId });

    // Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [userId, receiverId, username]);

  const sendMessage = () => {
    if (!text) return;
    socket.emit("sendMessage", { senderId: userId, receiverId, text });
    setText("");
  };

  return (
    <div>
      <div>
        {messages.map((m) => (
          <p key={m._id || m.id}>
            <b>{m.senderId === userId ? "You" : "Them"}:</b> {m.text}
          </p>
        ))}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
