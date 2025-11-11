import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data.filter((u) => u._id !== user._id));
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Welcome, {user.username}</h2>
      <h3>Available Users:</h3>
      <ul>
        {users.map((u) => (
          <li
            key={u._id}
            style={{
              border: "1px solid gray",
              margin: "8px 0",
              padding: "8px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/chat/${u._id}`)}
          >
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
