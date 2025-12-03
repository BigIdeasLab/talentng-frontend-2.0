"use client";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Bell,
  FileText,
  MessageSquare,
  Headphones,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentProfile } from "@/hooks/useProfileData";
import { useProfile } from "@/hooks/useProfile";

interface SidebarProps {
  activeItem?: string;
  onItemSelect?: (item: string) => void;
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
    id: "candidates",
    label: "Candidates",
    icon: Users,
    href: "/candidates",
  },
  {
    id: "jobs",
    label: "Job Postings",
    icon: Briefcase,
    href: "/jobs",
  },
  {
    id: "applications",
    label: "Applications",
    icon: FileText,
    badge: 5,
    href: "/applications",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    badge: 2,
    href: "/notifications",
  },
];

const otherItems: Omit<MenuItem, "badge">[] = [
  { id: "support", label: "Support", icon: Headphones },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function EmployerSidebar({
  activeItem = "dashboard",
  onItemSelect,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { initialProfileRaw } = useProfile();
  const { data: liveProfileData } = useCurrentProfile();

  const profile = useMemo(() => {
    if (liveProfileData) return liveProfileData;
    return initialProfileRaw;
  }, [liveProfileData, initialProfileRaw]);

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
            className="w-[40px] h-[30px] rounded-[2.679px] object-cover"
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
                      src={profile?.profileImageUrl || "/logo.png"}
                      alt={profile?.fullName || "Profile"}
                      className="w-[28px] h-[28px] rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-normal text-black font-inter-tight truncate">
                        {profile?.fullName || "User"}
                      </div>
                      <div className="text-[11px] text-[rgba(0,0,0,0.30)] font-inter-tight truncate">
                        Employer
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
              </MenuComponent>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
