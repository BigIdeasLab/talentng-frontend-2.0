"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useProfileData } from "@/hooks/useProfileData";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { TalentSidebar } from "@/components/layouts/sidebars/TalentSidebar";
import { RecruiterSidebar } from "@/components/layouts/sidebars/RecruiterSidebar";
import { MentorSidebar } from "@/components/layouts/sidebars/MentorSidebar";
import { getTalentUpcomingCount } from "@/lib/api/talent";
import { getRecruiterInterviewsCount } from "@/lib/api/applications";
import { getMentorSessionsCount } from "@/lib/api/mentorship";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { HamburgerMenuButton } from "@/components/navigation/HamburgerMenuButton";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { NotificationsModal } from "@/components/layouts/modals/NotificationsModal";
import { RoleSwitchModal } from "@/components/ui/RoleSwitchModal";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [talentUpcomingCount, setTalentUpcomingCount] = useState(0);
  const [recruiterUpcomingCount, setRecruiterUpcomingCount] = useState(0);
  const [mentorUpcomingCount, setMentorUpcomingCount] = useState(0);
  const { activeRole, isLoading, roleSwitchRequired, triggerRoleSwitch } =
    useProfile();

  // Map active role to recipient role for notifications
  const getRecipientRole = (
    role: string | null,
  ): "talent" | "recruiter" | "mentor" | "general" => {
    if (role === "recruiter") return "recruiter";
    if (role === "talent") return "talent";
    if (role === "mentor") return "mentor";
    return "general";
  };

  // Fetch role-specific notifications
  const {
    unreadCount: roleUnreadCount,
    refreshNotifications: refreshRoleNotifications,
  } = useNotifications(activeRole ? getRecipientRole(activeRole) : undefined);

  // Fetch general notifications
  const {
    unreadCount: generalUnreadCount,
    refreshNotifications: refreshGeneralNotifications,
  } = useNotifications("general");

  // Subscribe to role-specific notification updates
  useNotificationSocket({
    recipientRole: activeRole ? getRecipientRole(activeRole) : "talent",
    onCountUpdate: (unread) => {
      // Update state when count changes
      setTotalUnreadCount(() => unread);
    },
    onNotificationCreated: () => {
      // Refresh notifications when new one arrives
      refreshRoleNotifications();
      refreshGeneralNotifications();
    },
    onNotificationRead: () => {
      // Refresh notifications when one is marked as read
      refreshRoleNotifications();
      refreshGeneralNotifications();
    },
    onUpcomingUpdate: (count) => {
      // Update talent upcoming badge count from SSE
      setTalentUpcomingCount(count);
    },
    onRecruiterUpdate: (count) => {
      // Update recruiter upcoming badge count from SSE
      setRecruiterUpcomingCount(count);
    },
    onMentorUpdate: (count) => {
      // Update mentor upcoming badge count from SSE
      setMentorUpcomingCount(count);
    },
    enabled: !!activeRole,
  });

  // Fetch initial upcoming counts based on active role
  useEffect(() => {
    // Wait until role is fully resolved from JWT — prevents 403s from
    // a stale 'talent' role firing before the JWT sync settles.
    if (isLoading || !activeRole) return;

    if (activeRole === "talent") {
      getTalentUpcomingCount()
        .then((res) => setTalentUpcomingCount(res.count))
        .catch(console.error);
    } else if (activeRole === "recruiter") {
      getRecruiterInterviewsCount()
        .then((res) => setRecruiterUpcomingCount(res.count))
        .catch(console.error);
    } else if (activeRole === "mentor") {
      getMentorSessionsCount()
        .then((res) => setMentorUpcomingCount(res.count))
        .catch(console.error);
    }
  }, [activeRole, isLoading]);

  // Refresh layout's notification counts when a notification is read in the modal
  const handleNotificationRead = useCallback(() => {
    refreshRoleNotifications();
    refreshGeneralNotifications();
  }, [refreshRoleNotifications, refreshGeneralNotifications]);

  // Combine counts for sidebar display
  useEffect(() => {
    setTotalUnreadCount(roleUnreadCount + generalUnreadCount);
  }, [roleUnreadCount, generalUnreadCount]);

  // Redirect to onboarding if no active role after loading
  useEffect(() => {
    if (!isLoading && !activeRole) {
      router.replace("/onboarding");
    }
  }, [isLoading, activeRole, router]);

  // Fetch profile data client-side
  useProfileData();

  // Select sidebar based on active role
  const renderSidebar = () => {
    if (!activeRole) return null;

    switch (activeRole) {
      case "recruiter":
        return (
          <RecruiterSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            notificationCount={totalUnreadCount}
            upcomingCount={recruiterUpcomingCount}
          />
        );
      case "mentor":
        return (
          <MentorSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            notificationCount={totalUnreadCount}
            upcomingCount={mentorUpcomingCount}
          />
        );
      case "talent":
      default:
        return (
          <TalentSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            notificationCount={totalUnreadCount}
            upcomingCount={talentUpcomingCount}
          />
        );
    }
  };

  // Handle mobile navigation item selection
  const handleMobileItemSelect = (item: string) => {
    setActiveNavItem(item);
    setIsMobileDrawerOpen(false); // Auto-close drawer on navigation
  };

  return (
    <div className="flex h-screen bg-white flex-col md:flex-row">
      {/* Global Error Listener (Phase 6) */}
      <GlobalErrorHandler />

      {/* Mobile Header with Hamburger Menu */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E1E4EA]"
        suppressHydrationWarning
      >
        <HamburgerMenuButton
          isOpen={isMobileDrawerOpen}
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        />
        <div className="font-medium text-[18px] text-black font-inter-tight">
          TalentNG
        </div>
        {/* Notification badge in mobile header */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open notifications"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6.44V9.77M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15C11.09 22.15 10.25 21.77 9.65 21.17C9.05 20.57 8.67 19.73 8.67 18.82"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
            />
          </svg>
          {totalUnreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full">
              {totalUnreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Navigation Menu"
        description="Main navigation menu"
      >
        {activeRole && (
          <MobileNavigation
            activeRole={activeRole as "talent" | "recruiter" | "mentor"}
            onItemSelect={handleMobileItemSelect}
            onNotificationClick={() => {
              setIsNotificationsOpen(true);
              setIsMobileDrawerOpen(false);
            }}
            notificationCount={totalUnreadCount}
            upcomingCount={
              activeRole === "recruiter"
                ? recruiterUpcomingCount
                : activeRole === "mentor"
                  ? mentorUpcomingCount
                  : talentUpcomingCount
            }
            onClose={() => setIsMobileDrawerOpen(false)}
          />
        )}
      </MobileDrawer>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {renderSidebar()}
      </div>

      {/* Children Content */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-styled transition-all duration-200 ${
          isNotificationsOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {isLoading || !activeRole ? <LoadingScreen /> : children}
      </div>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNotificationRead={handleNotificationRead}
      />

      {/* Role Switch Modal (Phase 6) */}
      <RoleSwitchModal
        isOpen={!!roleSwitchRequired}
        onClose={() => triggerRoleSwitch("")}
        requiredRole={roleSwitchRequired as any}
      />
    </div>
  );
}
