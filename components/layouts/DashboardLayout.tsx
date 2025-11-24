"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`fixed h-full ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        {/* Header */}
        <div className="sticky top-0 z-40">
          <DashboardHeader toggleSidebar={toggleSidebar} />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}