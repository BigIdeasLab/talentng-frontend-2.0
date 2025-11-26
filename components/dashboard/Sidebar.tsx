"use client";

import {
  LayoutDashboard,
  Telescope,
  Briefcase,
  BookOpen,
  Headphones,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeItem?: string;
  onItemSelect?: (item: string) => void;
  onMobileClose?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "discover", label: "Discover Talent", icon: Telescope },
  { id: "opportunities", label: "Opportuities", icon: Briefcase },
  { id: "mentorship", label: "Mentorship", icon: BookOpen },
  { id: "learning", label: "Learning", icon: BookOpen },
];

const otherItems = [
  { id: "support", label: "Support", icon: Headphones },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeItem = "dashboard",
  onItemSelect,
}: SidebarProps) {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <aside className="hidden md:flex w-[271px] flex-col bg-white border-r border-[#E1E4EA]">
      {/* Logo Section */}
      <div className="px-[30px] py-[15px] border-b border-[#E1E4EA]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[45px] h-[34px] rounded-[2.679px] bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            T
          </div>
          <span className="font-medium text-[18px] text-black font-inter-tight">
            TalentNG
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 px-[20px] py-[10px] overflow-y-auto">
        {/* User Dropdown Section */}
        <div className="mb-6">
          <div className="px-[10px] py-[15px] rounded-lg bg-[#F5F5F5]">
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between gap-[8px] hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-[8px] min-w-0">
                    <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[15px] font-normal text-black font-inter-tight truncate">
                        {user?.fullName || "User"}
                      </div>
                      <div className="text-[13px] text-[rgba(0,0,0,0.30)] font-inter-tight truncate">
                        Independent Talent
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-black flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Navigation Items */}
        <div className="flex flex-col gap-[8px]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onItemSelect?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-[8px] px-[12px] py-[8px] rounded-lg transition-colors",
                  isActive
                    ? "bg-white text-[#525866]"
                    : "text-[#525866] hover:bg-white/50",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[14px] font-normal font-inter-tight text-left flex-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Others Section */}
        <div className="mt-8 pt-6 border-t border-[#E1E4EA]">
          <div className="px-[12px] py-[10px] mb-[8px]">
            <span className="text-[12px] font-medium text-[rgba(0,0,0,0.30)] font-inter-tight">
              OTHERS
            </span>
          </div>
          <div className="flex flex-col gap-[8px]">
            {otherItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-[8px] px-[12px] py-[8px] rounded-lg text-[#525866] hover:bg-white/50 transition-colors"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[14px] font-normal font-inter-tight text-left flex-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
