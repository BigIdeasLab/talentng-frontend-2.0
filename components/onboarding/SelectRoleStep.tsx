"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Role } from "@/lib/types/onboarding";
import { Check } from "lucide-react";

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.6667 5L7.5 14.1667L3.33334 10"
      stroke="#22C55E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SelectRoleStep = ({
  onNext,
  onBack,
  existingRoles = [],
  isAddingRole = false,
}: {
  onNext: (role: Role) => void;
  onBack?: () => void;
  existingRoles?: string[];
  isAddingRole?: boolean;
}) => {
   const [selectedRole, setSelectedRole] = useState<Role | null>(null);

   useEffect(() => {
     // console.log("User roles:", existingRoles);
   }, [existingRoles]);

   const roles = [
    {
      id: "talent",
      label: "As Talent",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/611d63c0306f773058be10af29e0d55cc818b085?width=512",
    },
    {
      id: "employer",
      label: "Employer / Recruiter",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/7e75bac5dec4ff1b9249b202c3cdc262e464ad7f?width=512",
    },
    {
      id: "mentor",
      label: "Mentor",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/6b5c4a37fa26679b6a2b05eb189a80f6bed5b713?width=512",
    },
  ];

  // Check if a role is already completed
  const isRoleCompleted = (roleId: string): boolean => {
    // Map frontend role IDs to API role values
    const roleMap: Record<string, string[]> = {
      talent: ["talent"],
      employer: ["recruiter"], // employer role maps to recruiter in API
      mentor: ["mentor"],
    };

    const apiRoles = roleMap[roleId] || [roleId];
    return apiRoles.some((role) => existingRoles.includes(role));
  };

  // Count completed roles for progress badge
  const completedCount = roles.filter((r) => isRoleCompleted(r.id)).length;

  return (
    <div className="relative h-full flex flex-col">
      {/* Top Bar with Logo and Back Button */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0 bg-white">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="TalentNG Logo"
          className="w-16 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]"
        />

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 bg-[#A9A9A9] text-white rounded-[60px] text-sm font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-11"
        >
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-3 px-5 md:px-8 py-3 justify-center items-center overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-1.5 text-center w-full flex-shrink-0">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg md:text-2xl font-semibold text-black font-[Inter_Tight] leading-tight">
              {isAddingRole
                ? "Add a New Role"
                : "How do you want to use Talent.ng"}
            </h2>
            {isAddingRole && completedCount > 0 && (
              <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                {completedCount} of 3
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm font-light text-[#919191] font-[Inter_Tight]">
            {isAddingRole
              ? "Choose another role to expand your opportunities"
              : "Pick the option that best describes you"}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-[640px] flex-shrink-0">
          {roles.map((role) => {
            const completed = isRoleCompleted(role.id);
            return (
              <button
                key={role.id}
                onClick={() => !completed && setSelectedRole(role.id as Role)}
                disabled={completed}
                className={`flex flex-col overflow-hidden transition-all rounded-[10px] relative ${
                  completed
                    ? "opacity-50 cursor-not-allowed"
                    : selectedRole === role.id
                      ? "ring-2 ring-[#5C30FF]"
                      : "hover:shadow-md"
                }`}
                title={
                  completed ? `You're already onboarded as ${role.label}` : ""
                }
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-[#E3E3E3] overflow-hidden">
                  <img
                    src={role.image}
                    alt={role.label}
                    className="w-full h-full object-cover"
                  />

                  {/* Completed Badge */}
                  {completed && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <CheckIcon />
                        <span className="text-white text-xs font-medium">
                          Completed
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="bg-white py-3 px-2 flex items-center justify-center">
                  <span
                    className={`text-sm font-medium font-[Inter_Tight] ${completed ? "text-gray-500 line-through" : "text-black"}`}
                  >
                    {role.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-2 flex-shrink-0">
          <Button
            onClick={() => selectedRole && onNext(selectedRole)}
            disabled={!selectedRole}
            className="px-8 py-2 h-11 rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-medium text-sm font-[Inter_Tight] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
