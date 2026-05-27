"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthInitPage() {
  const router = useRouter();

  useEffect(() => {
    // Use window.location.search for more reliable param parsing (avoids hydration issues)
    const searchParams = new URLSearchParams(window.location.search);
    let token = null;
    let user = null;

    // First try to get data from URL parameters (primary method)
    const urlToken = searchParams.get("token");
    const urlUser = searchParams.get("user");

    console.log("[Init-Client] Attempting to read from URL params...");
    console.log("[Init-Client] Token from URL:", !!urlToken);
    console.log("[Init-Client] User from URL:", !!urlUser);

    if (urlToken) {
      token = urlToken;
      console.log("[Init-Client] Using token from URL");
    }
    if (urlUser) {
      try {
        user = JSON.parse(decodeURIComponent(urlUser));
        console.log("[Init-Client] Parsed user from URL:", user);
      } catch (e) {
        console.error("[Init-Client] Failed to parse user from URL:", e);
      }
    }

    // Fallback to cookies if URL parameters are empty
    if (!token || !user) {
      console.log("[Init-Client] Falling back to cookies...");
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "token" && !token) {
          token = decodeURIComponent(value);
          console.log("[Init-Client] Found token in cookies");
        } else if (name === "user" && !user) {
          try {
            user = JSON.parse(decodeURIComponent(value));
            console.log("[Init-Client] Found user in cookies:", user);
          } catch (e) {
            console.error("[Init-Client] Failed to parse user cookie:", e);
          }
        }
      }
    }

    // If no auth data found, redirect to login
    if (!token || !user) {
      console.error("[Init-Client] ✗ No auth data found! Redirecting to login");
      router.push("/login");
      return;
    }

    // Store in localStorage with correct key names for fashionindependent
    console.log("[Init-Client] Storing in localStorage...");
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("[Init-Client] ✓ Auth data stored in localStorage");

    // Verify data was actually saved before redirecting
    const verifyTimer = setTimeout(() => {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        console.log("[Init-Client] ✓ Verified: Auth data confirmed in localStorage");
        console.log("[Init-Client] Redirecting to /dashboard/backer");
        router.push("/dashboard/backer");
      } else {
        console.error("[Init-Client] ✗ Verification failed: Auth data not in localStorage!");
        console.error("[Init-Client] Token saved:", !!savedToken);
        console.error("[Init-Client] User saved:", !!savedUser);
        // Retry with longer delay
        setTimeout(() => {
          console.log("[Init-Client] Retrying redirect...");
          router.push("/dashboard/backer");
        }, 200);
      }
    }, 50);

    return () => clearTimeout(verifyTimer);
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
