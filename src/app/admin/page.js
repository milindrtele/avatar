"use client";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

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
      className="bg-slate-800/70"
      style={{ height: "100vh", padding: "20px" }}
    >
      <div
        className="bg-slate-800/70 w-full p-4 rounded-xl shadow-lg text-white"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="text-xl">Admin Dashboard</h1>
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
      <a
        className="w-[25%]  px-6 py-3 rounded-lg text-white font-medium 
bg-gradient-to-r from-blue-500 to-indigo-600 
hover:from-blue-600 hover:to-indigo-700 
transition-all duration-200 shadow-md mb-4 mt-2
disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        href="/admin/users"
      >
        Manage Users
      </a>
    </div>
  );
}
