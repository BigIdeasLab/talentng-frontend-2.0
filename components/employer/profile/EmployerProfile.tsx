"use client";

import { useState } from "react";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import { Button } from "@/components/ui/button";

interface EmployerProfileProps {
  initialProfileData?: Partial<RecruiterProfile>;
  initialUserId?: string | null;
  initialStats?: any;
  initialRecommendations?: any[];
  initialServices?: any[];
  initialError?: string | null;
}

export function EmployerProfile({
  initialProfileData = {},
  initialUserId = null,
  initialStats = null,
  initialRecommendations = [],
  initialServices = [],
  initialError = null,
}: EmployerProfileProps) {
  const profileData = initialProfileData as RecruiterProfile;

  return (
    <div className="flex flex-col h-full bg-white md:flex-row">
      {/* Profile Panel */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <div className="w-[360px] bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col p-6 space-y-6">
          {/* Company Logo/Image */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white shadow-lg"
              style={{
                backgroundImage: `url(${profileData.companyLogoUrl || "https://via.placeholder.com/96"})`,
              }}
            />
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.companyName || "Company Name"}
              </h2>
              <p className="text-sm text-gray-600">
                {profileData.industry || "Industry"}
              </p>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Location
              </p>
              <p className="text-sm text-gray-800">
                {profileData.location || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Company Size
              </p>
              <p className="text-sm text-gray-800">
                {profileData.companySize || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Stage
              </p>
              <p className="text-sm text-gray-800">
                {profileData.companyStage || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Operating Model
              </p>
              <p className="text-sm text-gray-800">
                {profileData.operatingModel || "—"}
              </p>
            </div>
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

          {/* Website */}
          {profileData.companyWebsite && (
            <div className="border-t border-gray-200 pt-4">
              <a
                href={profileData.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {profileData.companyWebsite}
              </a>
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
            {profileData.companyName || "Company Profile"}
          </h1>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl space-y-8">
            {/* Company Overview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Company Overview
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Industry
                  </p>
                  <p className="text-base text-gray-900 mt-1">
                    {profileData.industry || "Not specified"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Company Size
                  </p>
                  <p className="text-base text-gray-900 mt-1">
                    {profileData.companySize || "Not specified"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Stage
                  </p>
                  <p className="text-base text-gray-900 mt-1">
                    {profileData.companyStage || "Not specified"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Location
                  </p>
                  <p className="text-base text-gray-900 mt-1">
                    {profileData.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

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
