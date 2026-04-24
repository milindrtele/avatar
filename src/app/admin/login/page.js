"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        alert("Invalid credentials");
        setIsLoading(false);
      }
    } catch (error) {
      alert("Error logging in. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div
      className="bg-slate-800/70"
      style={{ height: "100vh", display: "grid", placeItems: "center" }}
    >
      <div className="bg-slate-800/70 p-8 rounded-xl shadow-lg w-[80%] max-w-md">
        <h1 className="text-white text-xl mb-4">Admin Login</h1>
        <input
          name="username"
          id="userName"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl 
      bg-slate-800/70 text-white placeholder-gray-400 
      border border-slate-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-200 mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <input
          name="password"
          id="password"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-xl 
      bg-slate-800/70 text-white placeholder-gray-400 
      border border-slate-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition-all duration-200 mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg text-white font-medium 
bg-gradient-to-r from-blue-500 to-indigo-600 
hover:from-blue-600 hover:to-indigo-700 
transition-all duration-200 shadow-md mb-4 mt-2
disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              please wait...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}
