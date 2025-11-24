"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Role } from "@/lib/types/onboarding";

export const SelectRoleStep = ({
  onNext,
  onBack,
}: {
  onNext: (role: Role) => void;
  onBack?: () => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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

  return (
    <div className="relative h-full flex flex-col">
      {/* Top Bar with Logo and Back Button */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 flex-shrink-0 bg-white">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="TalentNG Logo"
          className="w-20 h-auto rounded-[3.457px] shadow-[0.777px_0.777px_24.66px_0_rgba(0,0,0,0.25)]"
        />

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="px-[25px] py-[11px] bg-[#A9A9A9] text-white rounded-[60px] text-[15px] font-medium font-[Inter_Tight] hover:bg-[#999] transition-colors h-[53px]"
        >
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-5 px-6 md:px-12 py-2 md:py-4 justify-center items-center">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center w-full flex-shrink-0">
          <h2 className="text-2xl md:text-[30px] font-semibold text-black font-[Inter_Tight] leading-tight">
            How do you want to use Talent.ng
          </h2>
          <p className="text-sm md:text-[17px] font-light text-[#919191] font-[Inter_Tight]">
            Pick the option that best describes you
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[808px] flex-shrink-0">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id as Role)}
              className={`flex flex-col overflow-hidden transition-all rounded-[10px] ${
                selectedRole === role.id ? "ring-2 ring-[#5C30FF]" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full aspect-square bg-[#E3E3E3] overflow-hidden">
                <img
                  src={role.image}
                  alt={role.label}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Label */}
              <div className="bg-white py-[17px] px-2.5 flex items-center justify-center">
                <span className="text-base font-medium text-black font-[Inter_Tight]">
                  {role.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-2 flex-shrink-0">
          <Button
            onClick={() => selectedRole && onNext(selectedRole)}
            disabled={!selectedRole}
            className="px-10 py-[21px] h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-medium text-[15px] font-[Inter_Tight] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
