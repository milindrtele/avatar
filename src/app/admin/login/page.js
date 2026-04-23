"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const cookies = document.cookie;
    console.log("Cookies:", cookies);
    // Check if already authenticated
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth="));
    const roleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="));

    if (authCookie && roleCookie) {
      const role = roleCookie.split("=")[1];
      if (role === "admin") {
        window.location.href = "/admin";
      }
    }
  }, []);

  async function handleLogin() {
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <div>
        <h1>Admin Login</h1>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
