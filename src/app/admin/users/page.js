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
    <div
      className="bg-slate-800/70 text-white h-[100vh] position-absolute top-0 left-0 overflow-y-auto"
      style={{ padding: "20px" }}
    >
      <div
        className="bg-slate-800/70 w-full p-4 rounded-xl shadow-lg text-white "
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="text-3xl">Manage Users</h1>
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
          className="transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Logout
        </button>
      </div>

      <div className="bg-slate-600/70 rounded-xl p-8 shadow-lg mb-8 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Existing Users</h2>
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
              <tr
                key={user._id || user.username}
                className="hover:bg-slate-900/40 transition odd:bg-slate-800 even:bg-slate-700/30"
              >
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="m-auto w-max">{user.username}</p>
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                  }}
                >
                  <p className="m-auto w-max">{user.role}</p>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <p className="m-auto w-max text-slate-400 (for location/date)">
                    {user.location || "N/A"}
                  </p>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <p className="m-auto w-max text-slate-400 (for location/date)">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                  }}
                  className="flex-col lg:flex-row m-auto flex gap-2 justify-end"
                >
                  <button
                    onClick={() => handleEditPassword(user._id)}
                    className="m-auto bg-[#007d3e] p-2 rounded text-white bg-emerald-500/90 hover:bg-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Edit Password
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.username)}
                    className="m-auto bg-[#ff4444] p-2 rounded text-white bg-red-500/90 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    // style={{
                    //   backgroundColor: "#f96363",
                    //   color: "white",
                    // }}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-500/70 w-full p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-lg font-semibold m-auto mb-4">
          Add New Device User
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ marginBottom: "20px" }}
          className="w-[50%] flex flex-col lg:flex-row m-auto"
        >
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
            className="mt-2 mb-2 px-0 lg:px-4 py-3 rounded-xl 
      bg-slate-800/70 text-white placeholder-gray-400 
      border border-slate-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-200 m-auto disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
            className="mt-2 mb-2 px-0 lg:px-4 py-3 rounded-xl 
      bg-slate-800/70 text-white placeholder-gray-400 
      border border-slate-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-200 m-auto disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Location"
            value={newUser.location}
            onChange={(e) =>
              setNewUser({ ...newUser, location: e.target.value })
            }
            required
            className="mt-2 mb-2 px-0 lg:px-4 py-3 rounded-xl 
      bg-slate-800/70 text-white placeholder-gray-400 
      border border-slate-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-200 m-auto  disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={loading}
            // style={{
            //   backgroundColor: "#22a3ff",
            //   color: "white",
            //   padding: "8px 16px",
            //   border: "none",
            //   borderRadius: "4px",
            //   cursor: "pointer",
            //   margin: "0 auto",
            // }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}
