/**
 * MobileNavigation Component Examples
 * 
 * This file demonstrates various usage patterns for the MobileNavigation component.
 * The MobileNavigation component provides role-specific navigation for mobile devices,
 * including ProfileSwitcher, navigation items with badges, and auto-close on selection.
 */

import { useState } from "react";
import { MobileNavigation } from "./MobileNavigation";
import { MobileDrawer } from "./MobileDrawer";
import { HamburgerMenuButton } from "./HamburgerMenuButton";

/**
 * Example 1: Basic Talent Navigation
 * 
 * Shows the simplest usage with talent role and no badges.
 */
export function BasicTalentNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <HamburgerMenuButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <MobileNavigation
          activeRole="talent"
          onClose={() => setIsOpen(false)}
        />
      </MobileDrawer>
    </div>
  );
}

/**
 * Example 2: Recruiter Navigation with Badges
 * 
 * Shows recruiter navigation with notification and upcoming badges.
 */
export function RecruiterNavigationWithBadges() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount] = useState(5);
  const [upcomingCount] = useState(3);

  return (
    <div>
      <HamburgerMenuButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <MobileNavigation
          activeRole="recruiter"
          notificationCount={notificationCount}
          upcomingCount={upcomingCount}
          onClose={() => setIsOpen(false)}
        />
      </MobileDrawer>
    </div>
  );
}

/**
 * Example 3: Mentor Navigation with Callbacks
 * 
 * Shows mentor navigation with item selection and notification callbacks.
 */
export function MentorNavigationWithCallbacks() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleItemSelect = (item: string) => {
    console.log("Selected item:", item);
    setSelectedItem(item);
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
    setShowNotifications(true);
  };

  return (
    <div>
      <HamburgerMenuButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <MobileNavigation
          activeRole="mentor"
          onItemSelect={handleItemSelect}
          onNotificationClick={handleNotificationClick}
          notificationCount={2}
          upcomingCount={1}
          onClose={() => setIsOpen(false)}
        />
      </MobileDrawer>

      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4">
            <h2>Notifications</h2>
            <button onClick={() => setShowNotifications(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Complete Mobile Layout Integration
 * 
 * Shows how to integrate mobile navigation into a complete layout
 * with header, drawer, and content area.
 */
export function CompleteMobileLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeRole] = useState<"talent" | "recruiter" | "mentor">("talent");
  const [notificationCount] = useState(5);
  const [upcomingCount] = useState(3);

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <HamburgerMenuButton
          isOpen={isDrawerOpen}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        <div className="font-medium text-lg">TalentNG</div>
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-lg"
        >
          <span>🔔</span>
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 text-xs bg-red-600 text-white rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <MobileNavigation
          activeRole={activeRole}
          onItemSelect={(item) => {
            console.log("Selected:", item);
            setIsDrawerOpen(false);
          }}
          onNotificationClick={() => {
            setIsNotificationsOpen(true);
            setIsDrawerOpen(false);
          }}
          notificationCount={notificationCount}
          upcomingCount={upcomingCount}
          onClose={() => setIsDrawerOpen(false)}
        />
      </MobileDrawer>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <h1>Main Content</h1>
        <p>Your page content goes here...</p>
      </div>

      {/* Notifications Modal (simplified) */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <p>You have {notificationCount} unread notifications</p>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Role Switching
 * 
 * Shows how navigation adapts when switching between roles.
 */
export function RoleSwitchingNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"talent" | "recruiter" | "mentor">("talent");

  return (
    <div>
      {/* Role Switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveRole("talent")}
          className={`px-4 py-2 rounded ${activeRole === "talent" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Talent
        </button>
        <button
          onClick={() => setActiveRole("recruiter")}
          className={`px-4 py-2 rounded ${activeRole === "recruiter" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Recruiter
        </button>
        <button
          onClick={() => setActiveRole("mentor")}
          className={`px-4 py-2 rounded ${activeRole === "mentor" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Mentor
        </button>
      </div>

      <HamburgerMenuButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <MobileNavigation
          activeRole={activeRole}
          notificationCount={5}
          upcomingCount={3}
          onClose={() => setIsOpen(false)}
        />
      </MobileDrawer>
    </div>
  );
}
