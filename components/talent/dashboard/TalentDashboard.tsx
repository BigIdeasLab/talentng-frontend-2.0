"use client";

import React from "react";
import Link from "next/link";

export function TalentDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow">
        <h1 className="text-4xl font-bold mb-4">Talent Dashboard</h1>
        <p className="text-xl text-gray-600 mb-4"></p>
        <Link
          href="/profile"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          GO TO PROFILE
        </Link>
      </div>
    </div>
  );
}
