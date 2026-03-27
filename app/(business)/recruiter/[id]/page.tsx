"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getRecruiterProfileByUserId } from "@/lib/api/recruiter";
import type { RecruiterProfile } from "@/lib/api/recruiter/types";
import { getTalentOpportunities } from "@/lib/api/opportunities";
import type { Opportunity } from "@/lib/api/opportunities/types";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { OpportunityCard } from "@/components/talent/opportunities/opportunity-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { DisplayOpportunity } from "@/components/talent/opportunities/types";

type TabType = "about" | "opportunities";

const tabs: { id: TabType; label: string }[] = [
  { id: "about", label: "About" },
  { id: "opportunities", label: "Open Opportunities" },
];

export default function RecruiterProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("about");

  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [opportunities, setOpportunities] = useState<DisplayOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [opportunityCount, setOpportunityCount] = useState<number>(0);

  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);

  useEffect(() => {
    if (!hasAccess) return;
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecruiterProfileByUserId(userId);
        setProfile(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("404")) {
          setError("not_found");
        } else {
          setError("failed");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [userId, hasAccess]);

  useEffect(() => {
    if (!hasAccess || !profile) return;

    async function fetchOpportunities() {
      setIsLoadingOpportunities(true);
      try {
        const res = await getTalentOpportunities({
          postedById: userId,
          status: "active",
        });
        const mapped: DisplayOpportunity[] = (res.data || []).map(
          (opp: Opportunity) => ({
            id: opp.id,
            postedById: opp.postedBy?.id || opp.postedById,
            type: opp.type,
            title: opp.title,
            companyName: opp.company,
            companyLogo:
              opp.logo ||
              opp.postedBy?.recruiterProfile?.profileImageUrl ||
              profile?.profileImageUrl ||
              "",
            date: opp.createdAt,
            location: opp.location,
            rate: opp.compensation,
            skills: opp.tags,
            category: opp.category,
            status: opp.status as "active" | "closed" | "draft",
            appliedAs: opp.appliedAs,
            saved: opp.saved,
            priceMode: opp.priceMode,
            minBudget: opp.minBudget,
            maxBudget: opp.maxBudget,
            price: opp.price,
            paymentType: opp.paymentType as
              | "hourly"
              | "weekly"
              | "monthly"
              | undefined,
            experienceLevel: opp.experienceLevel,
            duration: opp.duration,
          }),
        );
        setOpportunities(mapped);
        setOpportunityCount(res.pagination?.total ?? mapped.length);
      } catch {
        setOpportunities([]);
      } finally {
        setIsLoadingOpportunities(false);
      }
    }
    fetchOpportunities();
  }, [userId, hasAccess, profile]);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white md:flex-row">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex w-[350px] flex-col bg-white border-r border-[#E1E4EA] px-[25px] py-[15px]">
          <div className="flex flex-col items-center gap-[20px]">
            <div className="w-[110px] h-[110px] rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="w-full space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-[52px] border-b border-[#E1E4EA]" />
          <div className="p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error === "not_found" || !profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-3 text-[13px]">Company not found</p>
          <button
            onClick={() => router.back()}
            className="px-3 py-1.5 bg-[#181B25] text-white rounded-md hover:bg-[#252831] text-[11px]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (error === "failed") {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-3 text-[13px]">
            Failed to load company profile
          </p>
          <button
            onClick={() => router.back()}
            className="px-3 py-1.5 bg-[#181B25] text-white rounded-md hover:bg-[#252831] text-[11px]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const socialLinks = profile.links as Record<string, string> | null;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-[#E1E4EA] flex items-center justify-between">
        <h1 className="font-inter-tight text-[14px] font-medium text-black">
          Company Profile
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-1.5 border border-[#F5F5F5] rounded-full font-inter-tight text-[11px] font-normal text-black hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Profile Panel — matches EmployerProfilePanel structure */}
        <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col bg-white lg:border-r border-[#E1E4EA] lg:overflow-hidden">
          <div className="flex-1 lg:overflow-y-auto scrollbar-hidden px-[25px] py-[15px]">
          {/* Company Profile Section */}
          <div className="flex flex-col items-center gap-[20px]">
            {/* Company Logo */}
            <div className="relative w-[110px] h-[110px]">
              <img
                src={profile.profileImageUrl || "/default.png"}
                alt={profile.company || "Company"}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Company Info */}
            <div className="flex flex-col items-center gap-[12px] w-full">
              <div className="text-center">
                <h2 className="text-[16px] font-medium text-black font-inter-tight">
                  {profile.company || profile.username}
                </h2>
                {profile.industry && (
                  <p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight">
                    {profile.industry}
                  </p>
                )}
              </div>

              {/* Details Container */}
              <div className="flex flex-col items-start gap-[10px] w-full">
                {/* Location */}
                {profile.location && (
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-[6px]">
                      <MapPin className="w-[18px] h-[18px] text-[#525866]" />
                      <span className="text-[12px] font-normal text-black font-inter-tight">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                )}

                {/* Jobs Posted */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[6px]">
                    <Briefcase className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      {opportunityCount} Jobs Posted
                    </span>
                  </div>
                </div>

                {/* Talents Hired */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[6px]">
                    <Users className="w-[18px] h-[18px] text-[#525866]" />
                    <span className="text-[12px] font-normal text-black font-inter-tight">
                      0 Talents Hired
                    </span>
                  </div>
                </div>

                {/* Profile Views */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.83 11C1.83 11 4.58 4.58 11 4.58C17.42 4.58 20.17 11 20.17 11C20.17 11 17.42 17.42 11 17.42C4.58 17.42 1.83 11 1.83 11Z"
                        stroke="#525866"
                        strokeWidth="1.375"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="11"
                        cy="11"
                        r="2.75"
                        stroke="#525866"
                        strokeWidth="1.375"
                      />
                    </svg>
                    <span className="text-[13px] font-normal text-black font-inter-tight">
                      0 Profile Views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Opportunities Button */}
          <button
            onClick={() => setActiveTab("opportunities")}
            className="w-full h-[44px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] text-white font-normal text-[14px] font-inter-tight transition-colors flex-shrink-0 mt-[20px]"
          >
            View Opportunities
          </button>

          {/* Social Links Section */}
          {socialLinks && Object.values(socialLinks).some(Boolean) && (
            <div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
              <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
                Social Links
              </h3>
              <div className="flex flex-col gap-[10px] w-full">
                {[
                  {
                    name: "X",
                    url: socialLinks?.twitter,
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 14L7.03227 8.96773M7.03227 8.96773L2 2H5.33333L8.96773 7.03227M7.03227 8.96773L10.6667 14H14L8.96773 7.03227M14 2L8.96773 7.03227"
                          stroke="#525866"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                  {
                    name: "Instagram",
                    url: socialLinks?.instagram,
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1.66602 8.00033C1.66602 5.01477 1.66602 3.52199 2.59351 2.59449C3.52101 1.66699 5.01379 1.66699 7.99935 1.66699C10.9849 1.66699 12.4777 1.66699 13.4052 2.59449C14.3327 3.52199 14.3327 5.01477 14.3327 8.00033C14.3327 10.9859 14.3327 12.4787 13.4052 13.4062C12.4777 14.3337 10.9849 14.3337 7.99935 14.3337C5.01379 14.3337 3.52101 14.3337 2.59351 13.4062C1.66602 12.4787 1.66602 10.9859 1.66602 8.00033Z"
                          stroke="#525866"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 8C11 9.65687 9.65687 11 8 11C6.34315 11 5 9.65687 5 8C5 6.34315 6.34315 5 8 5C9.65687 5 11 6.34315 11 8Z"
                          stroke="#525866"
                        />
                        <path
                          d="M11.672 4.33301H11.666"
                          stroke="#525866"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                  {
                    name: "LinkedIn",
                    url: socialLinks?.linkedin,
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3.00065 6.33301H2.66732C2.03878 6.33301 1.72451 6.33301 1.52924 6.52827C1.33398 6.72354 1.33398 7.03781 1.33398 7.66634V13.333C1.33398 13.9615 1.33398 14.2758 1.52924 14.4711C1.72451 14.6663 2.03878 14.6663 2.66732 14.6663H3.00065C3.62919 14.6663 3.94346 14.6663 4.13872 14.4711C4.33398 14.2758 4.33398 13.9615 4.33398 13.333V7.66634C4.33398 7.03781 4.33398 6.72354 4.13872 6.52827C3.94346 6.33301 3.62919 6.33301 3.00065 6.33301Z"
                          stroke="#525866"
                        />
                        <path
                          d="M4.33398 2.83301C4.33398 3.66143 3.66241 4.33301 2.83398 4.33301C2.00556 4.33301 1.33398 3.66143 1.33398 2.83301C1.33398 2.00458 2.00556 1.33301 2.83398 1.33301C3.66241 1.33301 4.33398 2.00458 4.33398 2.83301Z"
                          stroke="#525866"
                        />
                        <path
                          d="M8.21798 6.33301H7.66732C7.03878 6.33301 6.72452 6.33301 6.52924 6.52827C6.33398 6.72354 6.33398 7.03781 6.33398 7.66634V13.333C6.33398 13.9615 6.33398 14.2758 6.52924 14.4711C6.72452 14.6663 7.03878 14.6663 7.66732 14.6663H8.00065C8.62918 14.6663 8.94345 14.6663 9.13872 14.4711C9.33398 14.2758 9.33398 13.9615 9.33398 13.333L9.33405 10.9997C9.33405 9.89521 9.68605 8.99974 10.7259 8.99974C11.2458 8.99974 11.6673 9.44747 11.6673 9.99974V12.9997C11.6673 13.6283 11.6673 13.9425 11.8626 14.1378C12.0578 14.3331 12.3721 14.3331 13.0007 14.3331H13.3331C13.9615 14.3331 14.2757 14.3331 14.471 14.1379C14.6663 13.9427 14.6663 13.6285 14.6665 13.0001L14.6674 9.33314C14.6674 7.67634 13.0916 6.33317 11.5319 6.33317C10.6439 6.33317 9.85178 6.76841 9.33405 7.44901C9.33398 7.02894 9.33398 6.81894 9.24278 6.66301C9.18498 6.56425 9.10272 6.48203 9.00398 6.42425C8.84805 6.33301 8.63805 6.33301 8.21798 6.33301Z"
                          stroke="#525866"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                  {
                    name: "Website",
                    url: socialLinks?.website,
                    icon: (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="6.5" stroke="#525866" />
                        <path
                          d="M1.5 8H14.5"
                          stroke="#525866"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 1.5C9.65685 3.15685 10.6569 5.48568 10.6569 8C10.6569 10.5143 9.65685 12.8432 8 14.5C6.34315 12.8432 5.34315 10.5143 5.34315 8C5.34315 5.48568 6.34315 3.15685 8 1.5Z"
                          stroke="#525866"
                        />
                      </svg>
                    ),
                  },
                ]
                  .filter((social) => social.url)
                  .map((social, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center w-full"
                  >
                    <div className="flex items-center gap-[6px]">
                      {social.icon}
                      <span className="text-[12px] font-normal text-black font-inter-tight">
                        {social.name}
                      </span>
                    </div>
                    <Link
                      href={social.url}
                      target="_blank"
                      className="text-[#525866] hover:text-black transition-colors"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[18px] h-[18px]"
                      >
                        <path
                          d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                          stroke="currentColor"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.8432 3.20458L10.1282 11.9702M18.8432 3.20458C18.3904 2.75119 15.34 2.79345 14.6951 2.80262M18.8432 3.20458C19.296 3.65798 19.2538 6.71231 19.2446 7.35802"
                          stroke="currentColor"
                          strokeWidth="1.375"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white">
          {/* Top Navigation — matches EmployerProfileNav */}
          <div className="flex items-center justify-between w-full bg-white border-b border-[#E1E4EA] sticky top-0 z-30">
            <div className="flex items-center gap-0 overflow-x-auto flex-1 scrollbar-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-[12px] sm:px-[20px] py-[14px] sm:py-[18px] text-[12px] sm:text-[13px] font-medium font-inter-tight whitespace-nowrap transition-colors relative",
                    activeTab === tab.id
                      ? "text-black"
                      : "text-[rgba(0,0,0,0.30)] hover:text-[rgba(0,0,0,0.6)]",
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5 w-full flex-1">
                {/* About Section */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-black font-inter-tight">
                    About {profile.company || profile.username}
                  </h2>
                  <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                    {profile.bio ? (
                      profile.bio
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))
                    ) : (
                      <p className="text-black/50 italic">
                        No company description added yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Details Section */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-black font-inter-tight">
                    Company Details
                  </h2>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Industry", value: profile.industry },
                      { label: "Company Size", value: profile.companySize },
                      { label: "Company Stage", value: profile.companyStage },
                      {
                        label: "Operating Model",
                        value: profile.operatingModel,
                      },
                      { label: "Location", value: profile.location },
                    ]
                      .filter((field) => field.value)
                      .map((field, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]"
                        >
                          <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                            {field.label}
                          </div>
                          <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                            {field.value}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Open Opportunities Tab */}
            {activeTab === "opportunities" && (
              <div className="p-3 md:p-4 lg:p-5 w-full pb-20">
                {isLoadingOpportunities ? (
                  <div className="w-full flex items-center justify-center py-12">
                    <p className="text-gray-500">Loading opportunities...</p>
                  </div>
                ) : opportunities.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {opportunities.map((opp) => (
                      <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center py-12">
                    <EmptyState
                      icon={Briefcase}
                      title="No open opportunities"
                      description="This company hasn't posted any active opportunities yet."
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
