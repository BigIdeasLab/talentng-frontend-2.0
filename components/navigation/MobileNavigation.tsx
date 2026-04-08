"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  Users,
  Headphones,
  Settings,
  FileText,
  Calendar,
  Search,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSwitcher } from "@/components/layouts/ProfileSwitcher";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";
import {
  PrefetchOnInteraction,
  usePrefetchRoute,
} from "@/lib/utils/resource-prefetching";

interface MobileNavigationProps {
  activeRole: "talent" | "recruiter" | "mentor";
  onItemSelect?: (item: string) => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
  upcomingCount?: number;
  applicantsCount?: number;
  pendingInvitesCount?: number;
  ticketCount?: number;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href?: string;
}

const getTalentMenuItems = (
  notificationCount?: number,
  upcomingCount?: number,
  pendingInvitesCount?: number,
): MenuItem[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.25} />,
    href: "/dashboard",
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: <Briefcase className="w-5 h-5" strokeWidth={1.25} />,
    href: "/opportunities",
  },
  {
    id: "mentorship",
    label: "Mentorship",
    icon: <Users className="w-5 h-5" strokeWidth={1.25} />,
    href: "/mentorship",
  },
  {
    id: "my-applications",
    label: "My Applications",
    icon: <FileText className="w-5 h-5" strokeWidth={1.25} />,
    badge: pendingInvitesCount,
    href: "/my-applications",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <Calendar className="w-5 h-5" strokeWidth={1.25} />,
    badge: upcomingCount,
    href: "/calendar",
  },
  {
    id: "notification",
    label: "Notification",
    icon: <Bell className="w-5 h-5" strokeWidth={1.25} />,
    badge: notificationCount,
  },
];

const getRecruiterMenuItems = (
  notificationCount?: number,
  upcomingCount?: number,
  applicantsCount?: number,
): MenuItem[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.25} />,
    href: "/dashboard",
  },
  {
    id: "discover-talent",
    label: "Discover Talent",
    icon: <Search className="w-5 h-5" strokeWidth={1.25} />,
    href: "/discover-talent",
  },
  {
    id: "create-opportunities",
    label: "Create Opportunities",
    icon: <Briefcase className="w-5 h-5" strokeWidth={1.25} />,
    href: "/opportunities",
  },
  {
    id: "applicants",
    label: "Applicants",
    icon: <Users className="w-5 h-5" strokeWidth={1.25} />,
    href: "/applicants",
    badge: applicantsCount,
  },
  {
    id: "interviews",
    label: "Interviews",
    icon: <Calendar className="w-5 h-5" strokeWidth={1.25} />,
    href: "/interviews",
    badge: upcomingCount,
  },
  {
    id: "notification",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" strokeWidth={1.25} />,
    badge: notificationCount,
  },
];

const getMentorMenuItems = (
  notificationCount?: number,
  upcomingCount?: number,
): MenuItem[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.25} />,
    href: "/dashboard",
  },
  {
    id: "application",
    label: "Applications",
    icon: <FileText className="w-5 h-5" strokeWidth={1.25} />,
    href: "/applications",
  },
  {
    id: "availability",
    label: "Availability",
    icon: <Clock className="w-5 h-5" strokeWidth={1.25} />,
    href: "/availability",
  },
  {
    id: "session-management",
    label: "Sessions",
    icon: <Calendar className="w-5 h-5" strokeWidth={1.25} />,
    href: "/sessions",
    badge: upcomingCount,
  },
  {
    id: "notification",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" strokeWidth={1.25} />,
    badge: notificationCount,
  },
];

const getOtherItems = (ticketCount?: number): MenuItem[] => [
  {
    id: "support",
    label: "Support",
    icon: <Headphones className="w-5 h-5" strokeWidth={1.25} />,
    href: "/support",
    badge: ticketCount,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" strokeWidth={1.25} />,
    href: "/settings",
  },
];

/**
 * MobileNavigation component provides role-specific navigation for mobile devices.
 * Includes ProfileSwitcher, navigation items with badges, auto-close on selection, and route prefetching.
 */
export function MobileNavigation({
  activeRole,
  onItemSelect,
  onNotificationClick,
  notificationCount = 0,
  upcomingCount = 0,
  applicantsCount = 0,
  pendingInvitesCount = 0,
  ticketCount = 0,
  onClose,
}: MobileNavigationProps) {
  const pathname = usePathname();

  const menuItems =
    activeRole === "recruiter"
      ? getRecruiterMenuItems(notificationCount, upcomingCount, applicantsCount)
      : activeRole === "mentor"
        ? getMentorMenuItems(notificationCount, upcomingCount)
        : getTalentMenuItems(notificationCount, upcomingCount, pendingInvitesCount);

  const otherItems = getOtherItems(ticketCount);

  const roleColors =
    activeRole === "recruiter"
      ? ROLE_COLORS.recruiter
      : activeRole === "mentor"
        ? ROLE_COLORS.mentor
        : ROLE_COLORS.talent;

  // Prefetch all navigation routes on component mount using Next.js Link prefetch
  React.useEffect(() => {
    // The PrefetchOnInteraction component handles prefetching for individual links
    // No additional prefetch logic needed here
  }, []);

  const handleItemClick = (item: MenuItem) => {
    if (item.id === "notification") {
      onNotificationClick?.();
      onClose?.();
    } else {
      onItemSelect?.(item.id);
      onClose?.();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ProfileSwitcher at the top */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <ProfileSwitcher />
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const isNotification = item.id === "notification";

            if (isNotification || !item.href) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full",
                    "active:bg-gray-100",
                    isActive
                      ? "bg-opacity-10 border border-opacity-100"
                      : "hover:bg-gray-50",
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: roleColors.light,
                          borderColor: roleColors.dark,
                        }
                      : undefined
                  }
                >
                  <span className="text-gray-700">{item.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-xs font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <PrefetchOnInteraction
                key={item.id}
                href={item.href}
                config={{ enableOnMobile: true, delay: 0 }}
              >
                <Link
                  href={item.href}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full",
                    "active:bg-gray-100",
                    isActive
                      ? "bg-opacity-10 border border-opacity-100"
                      : "hover:bg-gray-50",
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: roleColors.light,
                          borderColor: roleColors.dark,
                        }
                      : undefined
                  }
                >
                  <span className="text-gray-700">{item.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-xs font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </PrefetchOnInteraction>
            );
          })}
        </div>

        {/* Others Section */}
        <div className="mt-6 px-4">
          <div className="px-4 mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Others
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {otherItems.map((item) => {
              const isActive = pathname === item.href;

              if (!item.href) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full",
                      "active:bg-gray-100",
                      isActive
                        ? "bg-opacity-10 border border-opacity-100"
                        : "hover:bg-gray-50",
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: roleColors.light,
                            borderColor: roleColors.dark,
                          }
                        : undefined
                    }
                  >
                    <span className="text-gray-700">{item.icon}</span>
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <PrefetchOnInteraction
                  key={item.id}
                  href={item.href}
                  config={{ enableOnMobile: true, delay: 0 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full",
                      "active:bg-gray-100",
                      isActive
                        ? "bg-opacity-10 border border-opacity-100"
                        : "hover:bg-gray-50",
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: roleColors.light,
                            borderColor: roleColors.dark,
                          }
                        : undefined
                    }
                  >
                    <span className="text-gray-700">{item.icon}</span>
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </PrefetchOnInteraction>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
