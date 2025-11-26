"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EditProfilePage() {
  const [expandedSection, setExpandedSection] = useState<string>("personal");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar Navigation */}
      <div className="w-[235px] flex flex-col items-start gap-[50px] px-6 pt-[25px] border-r border-[#E1E4EA]">
        <h1 className="text-[25px] font-semibold text-black font-inter-tight">
          Edit Profile
        </h1>

        <div className="flex flex-col items-start gap-[30px] w-full">
          <button
            onClick={() => toggleSection("personal")}
            className={cn(
              "text-[16px] font-medium font-inter-tight transition-colors",
              expandedSection === "personal"
                ? "text-[#5C30FF]"
                : "text-[#525866]"
            )}
          >
            Personal Details
          </button>
          <button
            onClick={() => toggleSection("professional")}
            className={cn(
              "text-[16px] font-normal font-inter-tight transition-colors",
              expandedSection === "professional"
                ? "text-[#5C30FF]"
                : "text-[#525866]"
            )}
          >
            Professional Details
          </button>
          <button
            onClick={() => toggleSection("social")}
            className={cn(
              "text-[16px] font-normal font-inter-tight transition-colors",
              expandedSection === "social"
                ? "text-[#5C30FF]"
                : "text-[#525866]"
            )}
          >
            Social Links
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Action Bar */}
        <div className="h-[68px] border-b border-[#E1E4EA] flex items-center justify-end px-[107px] gap-2 bg-white">
          <Link href="/profile">
            <Button
              variant="outline"
              className="h-[48px] px-[31px] rounded-full border border-[#F5F5F5] bg-[#F5F5F5] text-black hover:bg-[#e5e5e5] font-inter-tight text-[16px] font-normal"
            >
              Discard
            </Button>
          </Link>
          <Button className="h-[48px] px-[31px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[16px] font-normal">
            Save Changes
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-[107px] pt-[93px] pb-8">
          <div className="max-w-[691px] mx-auto flex flex-col gap-[15px]">
            {/* Personal Details Section */}
            <div className="border border-[#E1E4EA] rounded-[20px] bg-white">
              <button
                onClick={() => toggleSection("personal")}
                className="w-full flex items-center justify-between px-[20px] py-[17px]"
              >
                <h2 className="text-[17px] font-medium text-black font-inter-tight">
                  Personal Details
                </h2>
                <ChevronDown
                  className={cn(
                    "w-6 h-6 text-[#B2B2B2] transition-transform",
                    expandedSection === "personal" && "rotate-180"
                  )}
                />
              </button>

              {expandedSection === "personal" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[20px] py-[23px] flex flex-col gap-[20px]">
                    {/* Profile Picture */}
                    <div className="relative w-[110px] h-[110px]">
                      <svg
                        width="110"
                        height="110"
                        viewBox="0 0 110 110"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                      >
                        <circle
                          cx="55"
                          cy="55"
                          r="45"
                          fill="#FF563D"
                          opacity="0.2"
                        />
                        <circle
                          cx="55"
                          cy="55"
                          r="54"
                          stroke="#E63C23"
                          strokeWidth="2"
                          strokeOpacity="0.2"
                        />
                        <path
                          d="M55 1C62.0914 1 69.1133 2.39675 75.6649 5.1105C82.2165 7.82426 88.1694 11.8019 93.1838 16.8162C98.1981 21.8306 102.176 27.7835 104.889 34.3351C107.603 40.8867 109 47.9086 109 55"
                          stroke="#E63C23"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Name Fields */}
                    <div className="flex gap-[11px]">
                      <div className="flex-1 flex flex-col gap-[12px]">
                        <label className="text-[15px] font-normal text-black font-inter-tight">
                          First Name
                        </label>
                        <div className="h-[57px] px-[15px] flex items-center justify-between border border-[#E1E4EA] rounded-[10px]">
                          <span className="text-[15px] font-normal text-black font-inter-tight">
                            Akanbi
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-[12px]">
                        <label className="text-[15px] font-normal text-black font-inter-tight">
                          Last Name
                        </label>
                        <div className="h-[57px] px-[15px] flex items-center justify-between border border-[#E1E4EA] rounded-[10px]">
                          <span className="text-[15px] font-normal text-black font-inter-tight">
                            David
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
                        </div>
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="flex flex-col gap-[12px]">
                      <label className="text-[15px] font-normal text-black font-inter-tight">
                        Headline
                      </label>
                      <div className="px-[15px] py-[23px] flex items-center border border-[#E1E4EA] rounded-[10px]">
                        <span className="text-[15px] font-normal text-black font-inter-tight">
                          Product & Interaction Designer
                        </span>
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="flex gap-[11px]">
                      <div className="flex-1 flex flex-col gap-[12px]">
                        <label className="text-[15px] font-normal text-black font-inter-tight">
                          Country
                        </label>
                        <div className="h-[57px] px-[15px] flex items-center justify-between border border-[#E1E4EA] rounded-[10px]">
                          <span className="text-[15px] font-normal text-black font-inter-tight">
                            Nigeria
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-[12px]">
                        <label className="text-[15px] font-normal text-black font-inter-tight">
                          City
                        </label>
                        <div className="h-[57px] px-[15px] flex items-center justify-between border border-[#E1E4EA] rounded-[10px]">
                          <span className="text-[15px] font-normal text-black font-inter-tight">
                            Lagos
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#B2B2B2]" />
                        </div>
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button className="h-[54px] px-[40px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[18px] font-normal">
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Professional Details Section */}
            <div className="border border-[#E1E4EA] rounded-[20px] bg-white">
              <button
                onClick={() => toggleSection("professional")}
                className="w-full flex items-center justify-between px-[20px] py-[28px]"
              >
                <h2 className="text-[17px] font-medium text-black font-inter-tight">
                  Professional Details
                </h2>
                <ChevronDown
                  className={cn(
                    "w-6 h-6 text-[#B2B2B2] transition-transform",
                    expandedSection === "professional" && "rotate-180"
                  )}
                />
              </button>

              {expandedSection === "professional" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[20px] py-[23px] flex flex-col gap-[20px]">
                    <p className="text-[15px] text-[#525866] font-inter-tight">
                      Add your professional information here
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Social Links Section */}
            <div className="border border-[#E1E4EA] rounded-[20px] bg-white">
              <button
                onClick={() => toggleSection("social")}
                className="w-full flex items-center justify-between px-[20px] py-[28px]"
              >
                <h2 className="text-[17px] font-medium text-black font-inter-tight">
                  Social Links
                </h2>
                <ChevronDown
                  className={cn(
                    "w-6 h-6 text-[#B2B2B2] transition-transform",
                    expandedSection === "social" && "rotate-180"
                  )}
                />
              </button>

              {expandedSection === "social" && (
                <>
                  <div className="h-[1px] bg-[#E1E4EA]" />
                  <div className="px-[20px] py-[23px] flex flex-col gap-[20px]">
                    <p className="text-[15px] text-[#525866] font-inter-tight">
                      Add your social media links here
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
