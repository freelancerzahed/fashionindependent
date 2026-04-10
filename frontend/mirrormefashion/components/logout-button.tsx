"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/contexts/UserContext";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  asDropdownItem?: boolean;
}

export function LogoutButton({ asDropdownItem = false }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useUserContext();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Use GET request instead of POST to match your backend
      const response = await fetch("/api/auth/logout", {
        method: "GET", // Changed from POST to GET
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear user data from localStorage
      localStorage.removeItem("user");
      
      // Call the context logout function
      await logout();
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local data
      localStorage.removeItem("user");
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  if (asDropdownItem) {
    return (
      <DropdownMenuItem
        onClick={handleLogout}
        disabled={isLoading}
        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isLoading ? "Logging out..." : "Log out"}
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline"
      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  );
}
