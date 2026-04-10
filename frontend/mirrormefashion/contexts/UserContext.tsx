"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    recaptchaToken?: string,
    rememberMe?: boolean,
    loginBy?: string
  ) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ✅ Restore session on mount
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from storage:", err);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    recaptchaToken?: string,
    rememberMe = false,
    loginBy = "email"
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailLogin = loginBy === "email";
    if (isEmailLogin && !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return false;
    }
    if (!isEmailLogin && !/^\d+$/.test(email)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return false;
    }

    if (!recaptchaToken || recaptchaToken.trim() === "") {
      setError("Captcha verification failed. Please try again.");
      setLoading(false);
      return false;
    }

    try {
      const payload = {
        email,
        password,
        user_type: "customer",
        login_by: loginBy,
        recaptcha_token: recaptchaToken,
        remember_me: rememberMe,
      };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Backend returned non-JSON response");
      }

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Login failed"
        );
      }

      if (data.user && typeof data.user === "object" && data.user.id) {
        setUser(data.user);

        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem("token", data.token);
            document.cookie = `token=${data.token}; path=/; max-age=${
              30 * 24 * 60 * 60
            }`; // 30 days
          }
        } else {
          sessionStorage.setItem("user", JSON.stringify(data.user));
          if (data.token) {
            sessionStorage.setItem("token", data.token);
            document.cookie = `token=${data.token}; path=/`; // session cookie
          }
        }
      } else {
        throw new Error("Invalid user data from server");
      }

      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("Backend logout failed", err);
    } finally {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within UserProvider");
  return context;
};
