"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          You are logged in!
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          JWT token is stored in localStorage. Backend is running on port 3000.
        </p>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
