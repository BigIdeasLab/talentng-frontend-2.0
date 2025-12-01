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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentProfile } from "@/hooks/useProfileData";

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
  href?: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "discover",
    label: "Discover Talent",
    icon: Telescope,
    href: "/discover-talent",
  },
  {
    id: "opportunities",
    label: "Opportuities",
    icon: Briefcase,
    href: "/opportunities",
  },
  {
    id: "notification",
    label: "Notification",
    icon: Bell,
    badge: 3,
    href: "/notifications",
  },
  { id: "projects", label: "Projects", icon: FileText, href: "/projects" },
  { id: "mentorship", label: "Mentorship", icon: Users, href: "/mentorship" },
  { id: "learning", label: "Learning", icon: GraduationCap, href: "/learning" },
];

const otherItems: Omit<MenuItem, "badge">[] = [
  { id: "support", label: "Support", icon: Headphones },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeItem = "dashboard",
  onItemSelect,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: talentProfile } = useCurrentProfile();
  const handleProfile = () => {
    setIsDropdownOpen(false);
    router.push("/profile");
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    router.push("/settings");
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex w-[250px] flex-col bg-white border-r border-[#E1E4EA] h-screen overflow-hidden">
      {/* Logo Section */}
      <div className="px-[30px] py-[12px] flex-shrink-0">
        <div className="flex items-center gap-[10px]">
          <img
            src="/logo.png"
            alt="TalentNG Logo"
            className="w-[40px] h-[30px] rounded-[2.679px] object-cover ]"
          />
          <span className="font-medium text-[16px] text-black font-inter-tight">
            TalentNG
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 px-[20px] py-[8px] overflow-y-auto">
        {/* User Dropdown Section */}
        <div className="mb-4 flex-shrink-0">
          <div className="px-[10px] py-[12px] rounded-lg bg-[#F5F5F5]">
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between gap-[8px] hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-[8px] min-w-0">
                    <img
                      src={talentProfile?.profileImageUrl || "/logo.png"}
                      alt={talentProfile?.fullName || "Profile"}
                      className="w-[28px] h-[28px] rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-normal text-black font-inter-tight truncate">
                        {talentProfile?.fullName || "User"}
                      </div>
                      <div className="text-[11px] text-[rgba(0,0,0,0.30)] font-inter-tight truncate">
                        Independent Talent
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-black flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <DropdownMenuItem onClick={handleProfile}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Navigation Items */}
        <div className="flex flex-col gap-[6px]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const MenuComponent = item.href ? Link : "button";
            return (
              <MenuComponent
                key={item.id}
                href={item.href || "#"}
                onClick={() => onItemSelect?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-[8px] px-[12px] py-[6px] rounded-lg transition-colors relative flex-shrink-0",
                  isActive
                    ? "bg-white text-[#525866]"
                    : "text-[#525866] hover:bg-white/50",
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[13px] font-normal font-inter-tight text-left flex-1">
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E63C23] flex-shrink-0">
                    <span className="text-[11px] font-semibold text-white font-inter-tight">
                      {item.badge}
                    </span>
                  </div>
                )}
              </MenuComponent>
            );
          })}
        </div>
      </div>

      {/* Others Section */}
      <div className=" px-[20px] py-[8px] flex-shrink-0">
        <div className="px-[12px] mb-[8px]">
          <span className="text-[11px] font-medium text-[rgba(0,0,0,0.30)] font-inter-tight">
            OTHERS
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          {otherItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onItemSelect?.(item.id)}
                className="w-full flex items-center gap-[8px] px-[12px] py-[6px] rounded-lg text-[#525866] hover:bg-white/50 transition-colors flex-shrink-0"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[13px] font-normal font-inter-tight text-left flex-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
