"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthInitPage() {
  const router = useRouter();

  useEffect(() => {
    // Extract token and user from cookies
    const cookies = document.cookie.split("; ");
    let token = null;
    let user = null;

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "token") {
        token = decodeURIComponent(value);
      } else if (name === "user") {
        try {
          user = JSON.parse(decodeURIComponent(value));
        } catch (e) {
          console.error("Failed to parse user cookie:", e);
        }
      }
    }

    // Store in localStorage
    if (token) {
      localStorage.setItem("token", token);
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Redirect to profile
    router.push("/profile");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Initializing...</h1>
        <p className="text-gray-600">Setting up your session...</p>
      </div>
    </div>
  );
}
