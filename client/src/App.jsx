// Task 2
import React, { useState, useEffect } from "react";
import { socket } from "./socket/socket";

function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on("connect", () => console.log("Connected:", socket.id));

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userList", (users) => setUsers(users));

    socket.on("typing", (user) => setTypingUser(user));

    socket.on("notification", (text) => {
      if (Notification.permission === "granted") {
        new Notification("Chat Notification", { body: text });
      }
    });

    return () => socket.off();
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setLoggedIn(true);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const msgData = { username, message, timestamp: new Date().toLocaleTimeString() };
      socket.emit("chatMessage", msgData);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", username);
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter your username</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleLogin}>Join Chat</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {username}</h2>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: 20 }}>
          <h3>Chat</h3>
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "scroll",
              padding: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div key={i}>
                <strong>{msg.username}</strong> [{msg.timestamp}]: {msg.message}
              </div>
            ))}
            {typingUser && <i>{typingUser} is typing...</i>}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
        <div style={{ width: 200 }}>
          <h3>Online Users</h3>
          <ul>
            {users.map((user, i) => (
              <li key={i}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
