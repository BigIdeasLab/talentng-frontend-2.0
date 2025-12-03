"use client";

import { useProfile } from "@/hooks/useProfile";
import React from "react";
import Link from "next/link";

export default function SupportPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";

  const renderContent = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">NOT IMPLEMENTED YET</p>
          <Link
            href="/profile"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            GO TO PROFILE PAGE
          </Link>
        </div>
      </div>
    );
  };

  switch (role) {
    case "employer":
      return renderContent();
    case "agency":
      return renderContent();
    case "talent":
    default:
      return renderContent();
  }
}
