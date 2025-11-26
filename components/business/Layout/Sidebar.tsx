"use client";

import {
  LayoutDashboard,
  Telescope,
  Briefcase,
  Bell,
  FileText,
  Users,
  GraduationCap,
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

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "discover", label: "Discover Talent", icon: Telescope },
  { id: "opportunities", label: "Opportuities", icon: Briefcase },
  { id: "notification", label: "Notification", icon: Bell, badge: 3 },
  { id: "projects", label: "Projects", icon: FileText },
  { id: "mentorship", label: "Mentorship", icon: Users },
  { id: "learning", label: "Learning", icon: GraduationCap },
];

const otherItems: Omit<MenuItem, 'badge'>[] = [
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
          <img
            src="/logo-2.png"
            alt="TalentNG Logo"
            className="w-[45px] h-[34px] rounded-[2.679px] object-cover shadow-[0.602px_0.602px_19.111px_0_rgba(0,0,0,0.25)]"
          />
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
                    <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex-shrink-0 overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-normal text-black font-inter-tight truncate">
                        {user?.fullName || "Akanbi David"}
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
                  "w-full flex items-center gap-[8px] px-[12px] py-[8px] rounded-lg transition-colors relative",
                  isActive
                    ? "bg-white text-[#525866]"
                    : "text-[#525866] hover:bg-white/50",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[14px] font-normal font-inter-tight text-left flex-1">
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E63C23] flex-shrink-0">
                    <span className="text-[13px] font-semibold text-white font-inter-tight">
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Others Section */}
        <div className="mt-auto pt-6">
          <div className="px-[12px] mb-[10px]">
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
                  onClick={() => onItemSelect?.(item.id)}
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
