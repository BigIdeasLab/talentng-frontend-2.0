"use client";

import Link from "next/link";

export default function MentorshipPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-6">Mentorship feature</p>
        <Link
          href="/profile"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Back to Profile
        </Link>
      </div>
    </div>
  );
}
