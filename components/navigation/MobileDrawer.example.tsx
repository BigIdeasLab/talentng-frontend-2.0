/**
 * Example usage of MobileDrawer component
 * 
 * This file demonstrates how to use the MobileDrawer component
 * for mobile navigation in the application.
 */

"use client";

import { useState } from "react";
import {
  MobileDrawer,
  MobileDrawerItem,
  MobileDrawerSection,
} from "./MobileDrawer";
import { Home, User, Settings, LogOut } from "lucide-react";

export function MobileDrawerExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    console.log(`Navigating to ${path}`);
    // Close drawer after navigation
    setIsOpen(false);
  };

  return (
    <div>
      {/* Trigger button (e.g., hamburger menu) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        aria-label="Open navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Main Navigation"
        description="Navigate through the application"
      >
        {/* Main Navigation Section */}
        <MobileDrawerSection title="Main">
          <MobileDrawerItem onClick={() => handleNavigate("/dashboard")}>
            <Home className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </MobileDrawerItem>

          <MobileDrawerItem onClick={() => handleNavigate("/profile")}>
            <User className="w-5 h-5 mr-3" />
            <span>Profile</span>
          </MobileDrawerItem>

          <MobileDrawerItem onClick={() => handleNavigate("/settings")}>
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </MobileDrawerItem>
        </MobileDrawerSection>

        {/* Account Section */}
        <MobileDrawerSection title="Account">
          <MobileDrawerItem onClick={() => handleNavigate("/logout")}>
            <LogOut className="w-5 h-5 mr-3" />
            <span>Log Out</span>
          </MobileDrawerItem>
        </MobileDrawerSection>

        {/* Profile Switcher (if applicable) */}
        <MobileDrawerSection>
          <div className="px-6 py-4 border-t border-gray-200">
            {/* ProfileSwitcher component would go here */}
            <div className="text-sm text-gray-600">
              Profile Switcher Component
            </div>
          </div>
        </MobileDrawerSection>
      </MobileDrawer>
    </div>
  );
}

/**
 * Example with Next.js Link component
 */
export function MobileDrawerWithNextLink() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MobileDrawerSection>
        {/* Using href prop for Next.js Link integration */}
        <MobileDrawerItem href="/dashboard">
          <Home className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </MobileDrawerItem>

        <MobileDrawerItem href="/profile">
          <User className="w-5 h-5 mr-3" />
          <span>Profile</span>
        </MobileDrawerItem>
      </MobileDrawerSection>
    </MobileDrawer>
  );
}

/**
 * Example with notification badges
 */
export function MobileDrawerWithBadges() {
  const [isOpen, setIsOpen] = useState(false);
  const notificationCount = 5;

  return (
    <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MobileDrawerSection>
        <MobileDrawerItem onClick={() => console.log("Navigate to notifications")}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Notifications</span>
            </div>
            {notificationCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </div>
        </MobileDrawerItem>
      </MobileDrawerSection>
    </MobileDrawer>
  );
}
