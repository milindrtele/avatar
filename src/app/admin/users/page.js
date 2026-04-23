"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUser, role: "device" }),
    });

    if (res.ok) {
      setNewUser({ username: "", password: "", location: "" });
      fetchUsers();
    } else {
      alert("Error creating user");
    }

    setLoading(false);
  };

  const handleEditPassword = async (userId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    if (res.ok) {
      alert("Password updated successfully");
    } else {
      alert("Error updating password");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("User deleted successfully");
      fetchUsers();
    } else {
      alert("Error deleting user");
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      router.push("/admin/login");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Manage Users</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ff4444",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <h2>Existing Users</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Username
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Location
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Created At
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.username}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.username}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.role}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.location || "N/A"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button onClick={() => handleEditPassword(user._id)}>
                  Edit Password
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id, user.username)}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: "#ff4444",
                    color: "white",
                  }}
                >
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Device User</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={newUser.location}
          onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
