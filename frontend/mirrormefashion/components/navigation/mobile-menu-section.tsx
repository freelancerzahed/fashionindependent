// components/navigation/MobileMenuSection.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  badge?: number;
  color?: string;
}

interface MobileMenuSectionProps {
  title?: string;
  icon?: any;
  items: MenuItem[];
  pathname: string;
  onItemClick: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  color?: string;
  bgColor?: string;
  collapsible?: boolean;
  small?: boolean;
}

export function MobileMenuSection({
  title,
  icon: Icon,
  items,
  pathname,
  onItemClick,
  isExpanded = false,
  onToggle,
  color,
  bgColor = "bg-gray-100",
  collapsible = false,
  small = false,
}: MobileMenuSectionProps) {
  if (collapsible && title && onToggle) {
    return (
      <div>
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-1.5 rounded-md flex-shrink-0 ${bgColor}`}>
                <Icon className={`h-4 w-4 ${color || "text-gray-600"}`} />
              </div>
              <span className="font-semibold text-sm text-gray-700 truncate">
                {title}
              </span>
            </div>
            <ChevronRight
              className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="space-y-1 ml-6">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      small ? "text-xs" : "text-sm"
                    } transition-colors ${
                      isActive
                        ? "bg-red-50 text-red-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <div>
      {title && Icon && (
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4 text-red-600 flex-shrink-0" />
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </h4>
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-red-50 text-red-700 shadow-sm border-l-4 border-red-600"
                  : "hover:bg-gray-50 hover:text-gray-900 text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-md flex-shrink-0 ${
                  isActive ? "bg-red-100" : "bg-gray-100"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${
                    isActive ? item.color || "text-red-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="font-medium text-sm truncate">
                  {item.label}
                </span>
                {item.badge && (
                  <Badge className="bg-red-600 hover:bg-red-600 text-xs h-5 px-2 flex-shrink-0 ml-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
