"use client";

import { useState } from "react";
import { HamburgerMenuButton } from "./HamburgerMenuButton";
import {
  MobileDrawer,
  MobileDrawerItem,
  MobileDrawerSection,
} from "./MobileDrawer";
import { Home, User, Settings, LogOut } from "lucide-react";

/**
 * Example demonstrating the HamburgerMenuButton component
 * integrated with the MobileDrawer component.
 */
export function HamburgerMenuButtonExample() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Hamburger Menu Button - Top Left */}
          <HamburgerMenuButton isOpen={isDrawerOpen} onClick={handleToggle} />
          {/* App Logo/Title */}
          <h1 className="text-lg font-semibold text-gray-900">My App</h1>
          {/* Right side placeholder (e.g., notifications) */}
          <div className="w-11" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={handleClose}>
        <MobileDrawerSection title="Main">
          <MobileDrawerItem
            onClick={() => {
              console.log("Navigate to Dashboard");
              handleClose();
            }}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </MobileDrawerItem>
          <MobileDrawerItem
            onClick={() => {
              console.log("Navigate to Profile");
              handleClose();
            }}
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </MobileDrawerItem>
        </MobileDrawerSection>

        <MobileDrawerSection title="Account">
          <MobileDrawerItem
            onClick={() => {
              console.log("Navigate to Settings");
              handleClose();
            }}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </MobileDrawerItem>
          <MobileDrawerItem
            onClick={() => {
              console.log("Logout");
              handleClose();
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </MobileDrawerItem>
        </MobileDrawerSection>
      </MobileDrawer>

      {/* Main Content */}
      <main className="pt-16 px-4 md:pt-0">
        <div className="max-w-4xl mx-auto py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            HamburgerMenuButton Example
          </h2>
          <p className="text-gray-600 mb-4">
            Click the hamburger menu button in the top-left corner to open the
            mobile navigation drawer.
          </p>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>44x44px minimum tap target for accessibility</li>
              <li>Animated icon transition (hamburger ↔ X)</li>
              <li>ARIA labels for screen readers</li>
              <li>Visual feedback on touch/click</li>
              <li>Keyboard focus indicators</li>
              <li>Positioned in top-left of mobile header</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Usage</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {`<HamburgerMenuButton
  isOpen={isDrawerOpen}
  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
/>`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Example with custom styling
 */
export function HamburgerMenuButtonCustomExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h3 className="text-lg font-semibold">Custom Styling Example</h3>

      {/* Default */}
      <div className="flex items-center gap-4">
        <HamburgerMenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
        <span className="text-sm text-gray-600">Default styling</span>
      </div>

      {/* Custom background */}
      <div className="flex items-center gap-4">
        <HamburgerMenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        />
        <span className="text-sm text-gray-600">Custom blue background</span>
      </div>

      {/* Custom with border */}
      <div className="flex items-center gap-4">
        <HamburgerMenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="border-2 border-gray-300"
        />
        <span className="text-sm text-gray-600">With border</span>
      </div>

      {/* Custom aria label */}
      <div className="flex items-center gap-4">
        <HamburgerMenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          ariaLabel="Open main menu"
        />
        <span className="text-sm text-gray-600">Custom ARIA label</span>
      </div>
    </div>
  );
}
