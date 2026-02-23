"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { useRecruiterApplicationsQuery } from "@/hooks/useRecruiterApplications";
import { useToast } from "@/hooks";
import { RecommendationModal } from "@/components/employer/opportunities/RecommendationModal";
import {
  getTalentRecommendationsByUserId,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
} from "@/lib/api/talent";
import { Application } from "@/lib/api/applications";
import type { TalentRecommendationDto } from "@/lib/api/talent";

interface HiredOpportunity {
  id: string;
  title: string;
  hiredDate: string;
}

interface HiredTalent {
  userId: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  previousHires: number;
  opportunities: HiredOpportunity[];
  recommendations: TalentRecommendationDto[];
}

const groupApplicationsByTalent = (
  applications: Application[],
): Map<string, HiredTalent> => {
  const talentMap = new Map<string, HiredTalent>();

  applications.forEach((app) => {
    const userId = app.userId;

    if (!talentMap.has(userId)) {
      talentMap.set(userId, {
        userId,
        name: app.user.talentProfile.fullName,
        role: app.user.talentProfile.headline || "Not specified",
        avatar: app.user.talentProfile.profileImageUrl || "",
        location: app.user.talentProfile.location || "Location not available",
        previousHires: app.user.talentProfile.hiredCount,
        opportunities: [],
        recommendations: [],
      });
    }

    const talent = talentMap.get(userId)!;
    const hiredDate = app.createdAt
      ? new Date(app.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Date not available";

    talent.opportunities.push({
      id: app.id,
      title: app.opportunity.title,
      hiredDate,
    });
  });

  return talentMap;
};

export default function HiredTalentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [_sortBy, _setSortBy] = useState("Newest");
  const [hiredTalents, setHiredTalents] = useState<HiredTalent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);
  const [selectedTalentUserId, setSelectedTalentUserId] = useState<
    string | null
  >(null);
  const [editingRecommendation, setEditingRecommendation] =
    useState<TalentRecommendationDto | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const hasAccess = useRequireRole(["recruiter"]);

  const { toast } = useToast();

  const {
    data: rawApplications = [],
    isLoading: isAppsLoading,
    error: appsError,
  } = useRecruiterApplicationsQuery({ status: "hired" });

  useEffect(() => {
    if (rawApplications.length > 0) {
      fetchRecommendationsForTalents(rawApplications);
    } else if (!isAppsLoading) {
      setHiredTalents([]);
      setIsLoading(false);
    }
  }, [rawApplications, isAppsLoading]);

  const fetchRecommendationsForTalents = async (
    applications: Application[],
  ) => {
    try {
      setIsLoading(true);
      const hired = applications.filter((app) => app.status === "hired");
      const talentMap = groupApplicationsByTalent(hired);

      // Fetch recommendations for each talent
      const talentsWithRecommendations = await Promise.all(
        Array.from(talentMap.values()).map(async (talent) => {
          try {
            const recs = await getTalentRecommendationsByUserId(talent.userId);
            return { ...talent, recommendations: recs };
          } catch (err) {
            console.error(
              `Error fetching recommendations for ${talent.userId}:`,
              err,
            );
            return talent;
          }
        }),
      );

      setHiredTalents(talentsWithRecommendations);
    } catch (error) {
      console.error("Error fetching hired talents:", error);
      setHiredTalents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHiredTalents = async () => {
    // No longer needed directly, handled by useQuery and useEffect
  };

  const handleRecommendationSubmit = async (data: {
    title: string;
    comment: string;
    rating: number;
  }) => {
    if (!selectedTalentUserId) return;

    try {
      if (editingRecommendation) {
        // Update existing recommendation
        await updateRecommendation(editingRecommendation.id, {
          title: data.title,
          comment: data.comment,
          rating: data.rating,
        });
        toast?.({
          title: "Success",
          description: "Recommendation updated successfully",
        });
      } else {
        // Create new recommendation
        await createRecommendation(selectedTalentUserId, {
          title: data.title,
          comment: data.comment,
          rating: data.rating,
        });
        toast?.({
          title: "Success",
          description: "Recommendation added successfully",
        });
      }
      await fetchHiredTalents();
      setIsRecommendationModalOpen(false);
      setEditingRecommendation(null);
    } catch (error) {
      console.error("Error submitting recommendation:", error);

      // Handle specific error cases
      let errorDescription = editingRecommendation
        ? "Failed to update recommendation"
        : "Failed to add recommendation";

      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorDescription = "You don't have permission to add recommendations";
        } else if (error.message.includes("409")) {
          errorDescription = error.message; // Use backend message
        }
      }

      toast?.({
        title: "Error",
        description: errorDescription,
      });
    }
  };

  const handleDeleteRecommendation = async (recId: string) => {
    try {
      await deleteRecommendation(recId);
      await fetchHiredTalents();
      setOpenMenuId(null);
      toast?.({
        title: "Success",
        description: "Recommendation deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting recommendation:", error);

      let errorDescription = "Failed to delete recommendation";
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          errorDescription =
            "You don't have permission to delete this recommendation";
        }
      }

      toast?.({
        title: "Error",
        description: errorDescription,
      });
    }
  };

  const filteredTalents = hiredTalents.filter(
    (talent) =>
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.opportunities.some((opp) =>
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading) {
    return <PageLoadingState message="Loading hired talents..." />;
  }

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 md:px-8 py-5 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col gap-5 md:gap-6 mb-6">
          {/* Back Button */}
          <Link
            href="/applicants"
            className="flex items-center gap-2 text-black/30 hover:text-black/50 transition-colors w-fit"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.783 11.7826C9.71332 11.8525 9.63053 11.9079 9.53937 11.9458C9.4482 11.9837 9.35046 12.0031 9.25175 12.0031C9.15304 12.0031 9.0553 11.9837 8.96414 11.9458C8.87297 11.9079 8.79018 11.8525 8.7205 11.7826L5.7205 8.78255C5.65058 8.71287 5.5951 8.63008 5.55725 8.53891C5.5194 8.44775 5.49991 8.35001 5.49991 8.2513C5.49991 8.15259 5.5194 8.05485 5.55725 7.96369C5.5951 7.87252 5.65058 7.78973 5.7205 7.72005L8.7205 4.72005C8.8614 4.57915 9.0525 4.5 9.25175 4.5C9.45101 4.5 9.64211 4.57915 9.783 4.72005C9.9239 4.86095 10.0031 5.05204 10.0031 5.2513C10.0031 5.45056 9.9239 5.64165 9.783 5.78255L7.31488 8.25193L9.78488 10.7213C9.85449 10.7911 9.90966 10.8739 9.94724 10.965C9.98482 11.0561 10.0041 11.1538 10.0039 11.2523C10.0037 11.3509 9.98413 11.4484 9.94623 11.5394C9.90832 11.6304 9.85286 11.713 9.783 11.7826Z"
                fill="#B2B2B2"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal">
              Back to applicants
            </span>
          </Link>

          {/* Title and Description */}
          <div className="flex flex-col gap-2">
            <h1 className="font-inter-tight text-[21px] font-medium text-black leading-5">
              Hired Talents
            </h1>
            <p className="font-inter-tight text-[13px] font-normal text-black/30">
              View all talents you&apos;ve hired across opportunities
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6">
          {/* Search Container */}
          <div className="flex-1 max-w-full sm:max-w-[550px] flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] border border-[#E1E4EA]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.75 12.75L15.75 15.75"
                stroke="#B2B2B2"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
                stroke="#B2B2B2"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search name or Role Or Opportunity"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-inter-tight text-[13px] font-normal text-black placeholder:text-black/30 outline-none bg-transparent capitalize"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <button className="flex items-center gap-1 px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors">
              <svg
                width="15"
                height="15"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 5.25H4.5"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.25 12.75H6.75"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 12.75H15.75"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.25 5.25H15.75"
                  stroke="black"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.5 5.25C4.5 4.55109 4.5 4.20164 4.61418 3.92597C4.76642 3.55844 5.05844 3.26642 5.42597 3.11418C5.70164 3 6.05109 3 6.75 3C7.44891 3 7.79835 3 8.07405 3.11418C8.44155 3.26642 8.7336 3.55844 8.88585 3.92597C9 4.20164 9 4.55109 9 5.25C9 5.94891 9 6.29837 8.88585 6.57403C8.7336 6.94157 8.44155 7.23358 8.07405 7.38582C7.79835 7.5 7.44891 7.5 6.75 7.5C6.05109 7.5 5.70164 7.5 5.42597 7.38582C5.05844 7.23358 4.76642 6.94157 4.61418 6.57403C4.5 6.29837 4.5 5.94891 4.5 5.25Z"
                  stroke="black"
                  strokeWidth="1.125"
                />
                <path
                  d="M9 12.75C9 12.0511 9 11.7017 9.11415 11.426C9.2664 11.0585 9.55845 10.7664 9.92595 10.6141C10.2017 10.5 10.5511 10.5 11.25 10.5C11.9489 10.5 12.2983 10.5 12.574 10.6141C12.9415 10.7664 13.2336 11.0585 13.3858 11.426C13.5 11.7017 13.5 12.0511 13.5 12.75C13.5 13.4489 13.5 13.7983 13.3858 14.074C13.2336 14.4415 12.9415 14.7336 12.574 14.8858C12.2983 15 11.9489 15 11.25 15C10.5511 15 10.2017 15 9.92595 14.8858C9.55845 14.7336 9.2664 14.4415 9.11415 14.074C9 13.7983 9 13.4489 9 12.75Z"
                  stroke="black"
                  strokeWidth="1.125"
                />
              </svg>
              <span className="font-inter-tight text-[13px] font-normal text-black">
                Filter
              </span>
            </button>

            {/* Sort Button */}
            <button className="flex items-center gap-1 px-[14px] py-[7px] rounded-[8px] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors">
              <span className="font-inter-tight text-[13px] font-normal text-black">
                {_sortBy}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Talents Grid */}
        {filteredTalents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="font-inter-tight text-[15px] font-normal text-black/30">
              No hired talents found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTalents.map((talent) => (
              <div
                key={talent.userId}
                className="flex flex-col gap-4 p-4 rounded-[10px] border border-[#E5E7EB] bg-white flex-shrink-0"
              >
                {/* Profile Section */}
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <button
                    onClick={() =>
                      router.push(`/discover-talent/${talent.userId}`)
                    }
                    className="flex items-start gap-3 hover:opacity-80 transition-opacity text-left"
                  >
                    <img
                      src={talent.avatar}
                      alt={talent.name}
                      className="w-[42px] h-[42px] rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-center gap-2">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-inter-tight text-[13px] font-bold text-black">
                          {talent.name}
                        </h3>
                        <p className="font-inter-tight text-[11px] font-normal text-[#525866]">
                          {talent.role}
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-fit px-5 h-[18px] rounded-full bg-[#D1FAE5]">
                        <span className="font-inter-tight text-[10px] font-semibold text-[#076046]">
                          {talent.opportunities.length} Hired
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Opportunities List */}
                  <div className="flex flex-col gap-2">
                    <p className="font-inter-tight text-[12px] font-semibold text-black">
                      Opportunities
                    </p>
                    {talent.opportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="flex flex-col gap-1 p-2 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]"
                      >
                        <p className="font-inter-tight text-[11px] font-medium text-black">
                          {opp.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z"
                              stroke="#525866"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 1.5V4.5"
                              stroke="#525866"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 1.5V4.5"
                              stroke="#525866"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.25 7.5H15.75"
                              stroke="#525866"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="font-inter-tight text-[11px] text-[#181B25]">
                            <span className="text-[12px] text-[#525866]">
                              Hired on:
                            </span>{" "}
                            {opp.hiredDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Location and Previous Hires */}
                  <p className="font-inter-tight text-[11px] text-[#525866]">
                    {talent.location} • {talent.previousHires}x Previously Hired
                  </p>
                </div>

                {/* Recommendations and Actions */}
                <div className="flex flex-col gap-3 pt-2 border-t border-[#E5E7EB]">
                  {/* Recommendations Display */}
                  {talent.recommendations.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="font-inter-tight text-[12px] font-semibold text-black">
                        Recommendation
                      </p>
                      {talent.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex flex-col gap-1 p-2 rounded-lg bg-[#D1FAE5] border border-[#A7D8BD] relative"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1">
                              <p className="font-inter-tight text-[10px] font-semibold text-[#076046]">
                                {rec.title}
                              </p>
                            </div>
                            {/* 3-dot menu */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === rec.id ? null : rec.id,
                                  )
                                }
                                className="p-1 hover:bg-[#BFE8D7] rounded transition-colors"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle cx="6" cy="12" r="2" fill="#076046" />
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="2"
                                    fill="#076046"
                                  />
                                  <circle
                                    cx="18"
                                    cy="12"
                                    r="2"
                                    fill="#076046"
                                  />
                                </svg>
                              </button>

                              {/* Dropdown menu */}
                              {openMenuId === rec.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E1E4EA] rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      setSelectedTalentUserId(talent.userId);
                                      setEditingRecommendation(rec);
                                      setIsRecommendationModalOpen(true);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-[11px] font-medium text-black hover:bg-gray-50 flex items-center gap-2 border-b border-[#E1E4EA] whitespace-nowrap"
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3 17.25V21h3.75L17.81 9.94m-4.75-4.75l3.75-3.75a2.121 2.121 0 013 3l-3.75 3.75m-2 2h6"
                                        stroke="#076046"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteRecommendation(rec.id)
                                    }
                                    className="w-full text-left px-3 py-2 text-[11px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6m4-6v6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="font-inter-tight text-[10px] font-semibold text-yellow-500">
                              {"★".repeat(rec.rating || 0)}
                            </span>
                            <span className="font-inter-tight text-[10px] text-[#076046]">
                              {rec.rating}/5
                            </span>
                          </div>
                          <p className="font-inter-tight text-[10px] text-[#076046] leading-tight">
                            {rec.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Recommendation Button - Only show if no recommendations exist */}
                  {talent.recommendations.length === 0 && (
                    <button
                      onClick={() => {
                        setSelectedTalentUserId(talent.userId);
                        setIsRecommendationModalOpen(true);
                      }}
                      className="flex items-center justify-center h-7 px-4 rounded-[8px] border border-[#E6E7EA] hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-inter-tight text-[11px] font-medium text-black">
                        Add Recommendation
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Modal */}
      {isRecommendationModalOpen && selectedTalentUserId && (
        <RecommendationModal
          isOpen={isRecommendationModalOpen}
          onClose={() => {
            setIsRecommendationModalOpen(false);
            setSelectedTalentUserId(null);
            setEditingRecommendation(null);
          }}
          onSubmit={handleRecommendationSubmit}
          applicantName={
            hiredTalents.find((t) => t.userId === selectedTalentUserId)?.name ||
            ""
          }
          initialData={
            editingRecommendation
              ? {
                  title: editingRecommendation.title,
                  comment: editingRecommendation.comment || "",
                  rating: editingRecommendation.rating || 5,
                }
              : undefined
          }
          isEditing={!!editingRecommendation}
        />
      )}
    </div>
  );
}
