// components/navigation/TopBar.tsx
"use client";

import { Phone, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { socialLinks } from "@/lib/data/navigation";

interface TopBarProps {
  showTopBar: boolean;
  setShowTopBar: (show: boolean) => void;
}

export function TopBar({ showTopBar, setShowTopBar }: TopBarProps) {
  if (!showTopBar) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm">
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-10">
          {/* Left - Contact Info */}
          <div className="hidden md:flex items-center gap-6">
            
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>support@mirrormefashion.com</span>
            </div>
          </div>

          {/* Center - Company Name */}
          <div className="flex-1 text-center md:flex-none">
            <span className="font-bold text-lg tracking-wide">
            Mirror Me Fashion <sup className="text-xs font-normal">BETA</sup>
            </span>
          </div>

          {/* Right - Social Media & Close */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-200 transition-colors"
                  title={social.title}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTopBar(false)}
              className="h-6 w-6 hover:bg-red-500/20 text-white"
              title="Close top bar"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
