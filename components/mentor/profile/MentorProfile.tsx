"use client";

import { useState } from "react";
import type { MentorProfile as MentorProfileType } from "@/lib/api/mentor/types";
import { Button } from "@/components/ui/button";

interface MentorProfileProps {
  initialProfileData?: Partial<MentorProfileType>;
  initialUserId?: string | null;
  initialStats?: any;
  initialRecommendations?: any[];
  initialServices?: any[];
  initialError?: string | null;
}

export function MentorProfile({
  initialProfileData = {},
  initialUserId = null,
  initialStats = null,
  initialRecommendations = [],
  initialServices = [],
  initialError = null,
}: MentorProfileProps) {
  const profileData = initialProfileData as MentorProfileType;

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <div className="w-[360px] bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
              style={{
                backgroundImage: `url(${profileData.profileImageUrl || "https://via.placeholder.com/96"})`,
              }}
            />
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.fullName || "Mentor"}
              </h2>
              <p className="text-sm text-gray-600">
                {profileData.headline || "Mentor"}
              </p>
            </div>
          </div>

          {/* Mentor Info */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Company
              </p>
              <p className="text-sm text-gray-800">
                {profileData.company || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Location
              </p>
              <p className="text-sm text-gray-800">
                {profileData.location || "—"}
              </p>
            </div>

            {/* Expertise */}
            {profileData.expertise && profileData.expertise.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.slice(0, 3).map((exp, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {exp}
                    </span>
                  ))}
                  {profileData.expertise.length > 3 && (
                    <span className="text-xs text-gray-600">
                      +{profileData.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Mentorship Topics */}
            {profileData.mentorshipTopics &&
              profileData.mentorshipTopics.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Mentorship Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.mentorshipTopics
                      .slice(0, 3)
                      .map((topic, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    {profileData.mentorshipTopics.length > 3 && (
                      <span className="text-xs text-gray-600">
                        +{profileData.mentorshipTopics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Bio */}
          {profileData.bio && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                About
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profileData.bio}
              </p>
            </div>
          )}

          {/* Links */}
          {profileData.links && Object.keys(profileData.links).length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Links
              </p>
              <div className="space-y-2">
                {Object.entries(profileData.links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline truncate"
                    title={url}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <div className="border-t border-gray-200 pt-4 mt-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white h-screen md:h-screen overflow-hidden">
        {/* Top Navigation */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {profileData.fullName || "Mentor Profile"}
          </h1>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl space-y-8">
            {/* About Section */}
            {profileData.bio && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {profileData.bio}
                </p>
              </div>
            )}

            {/* Professional Background */}
            {profileData.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Professional Background
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {profileData.description}
                </p>
              </div>
            )}

            {/* Expertise */}
            {profileData.expertise && profileData.expertise.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profileData.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-full"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mentorship Topics */}
            {profileData.mentorshipTopics &&
              profileData.mentorshipTopics.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Mentorship Topics
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {profileData.mentorshipTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-green-100 text-green-700 font-medium px-4 py-2 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Stats */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Stats
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData.views || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Profile Views</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData.isFeatured ? "Featured" : "Not Featured"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Status</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {profileData.visibility || "Public"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Visibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
