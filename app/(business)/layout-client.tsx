"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useProfileData } from "@/hooks/useProfileData";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useTicketCount } from "@/hooks/useSupport";
import { TalentSidebar } from "@/components/layouts/sidebars/TalentSidebar";
import { RecruiterSidebar } from "@/components/layouts/sidebars/RecruiterSidebar";
import { MentorSidebar } from "@/components/layouts/sidebars/MentorSidebar";
import { getTalentUpcomingCount } from "@/lib/api/talent";
import {
  getRecruiterInterviewsCount,
  getRecruiterApplicationsCount,
} from "@/lib/api/applications";
import { getMentorSessionsCount } from "@/lib/api/mentorship";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { HamburgerMenuButton } from "@/components/navigation/HamburgerMenuButton";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { NotificationsModal } from "@/components/layouts/modals/NotificationsModal";
import { RoleSwitchModal } from "@/components/ui/RoleSwitchModal";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { useAuth } from "@/hooks/useAuth";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [talentUpcomingCount, setTalentUpcomingCount] = useState(0);
  const [recruiterUpcomingCount, setRecruiterUpcomingCount] = useState(0);
  const [recruiterApplicantsCount, setRecruiterApplicantsCount] = useState(0);
  const [mentorUpcomingCount, setMentorUpcomingCount] = useState(0);
  const { activeRole, isLoading, roleSwitchRequired, triggerRoleSwitch } =
    useProfile();
  const { user } = useAuth();

  // Fetch active ticket count
  const { data: ticketCountData } = useTicketCount();
  const ticketCount = ticketCountData?.count || 0;

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
  // Temporarily disabled - uncomment when notifications API is available
  /*
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
    onRecruiterApplicantsUpdate: (count: number) => {
      // Update recruiter applicants badge count from SSE
      setRecruiterApplicantsCount(count);
    },
    onMentorUpdate: (count) => {
      // Update mentor upcoming badge count from SSE
      setMentorUpcomingCount(count);
    },
    enabled: !!activeRole,
  });
  */

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
      getRecruiterApplicationsCount()
        .then((res) => {
          setRecruiterApplicantsCount(res.count);
        })
        .catch((error) => {
          console.error("[Layout] Failed to fetch applicants count:", error);
          // If endpoint doesn't exist, set to 0 silently
          setRecruiterApplicantsCount(0);
        });
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

  // Redirect to onboarding if user needs onboarding (authoritative backend check)
  useEffect(() => {
    if (!isLoading && user?.needsOnboarding) {
      // Use window.location for hard redirect to break out of any routing loops
      window.location.href = "/onboarding";
    }
  }, [isLoading, user?.needsOnboarding]);

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
            applicantsCount={recruiterApplicantsCount}
            ticketCount={ticketCount}
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
            ticketCount={ticketCount}
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
            ticketCount={ticketCount}
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
        className="md:hidden sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b border-[#E1E4EA] z-50"
        suppressHydrationWarning
      >
        {/* Logo and Brand Name - Left */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="TalentNG" className="h-10 w-auto" />
          <span className="font-medium text-[18px] text-black font-inter-tight">
            TalentNG
          </span>
        </div>

        {/* Hamburger Menu Button - Right */}
        <HamburgerMenuButton
          isOpen={isMobileDrawerOpen}
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        />
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
            applicantsCount={recruiterApplicantsCount}
            ticketCount={ticketCount}
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
        className={`flex-1 overflow-hidden transition-all duration-200 ${
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
