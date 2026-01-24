"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { useToast } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  TabType,
  OpportunityCard as OpportunityCardType,
  OpportunityCardProps,
} from "@/lib/types";
import { TYPE_CONFIG } from "@/types/opportunities";
import { getApplications, type Application } from "@/lib/api/applications";

export function OpportunityCard({
  opportunity,
  activeTab,
  onMutationSuccess,
}: OpportunityCardProps & { onMutationSuccess?: () => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const config = TYPE_CONFIG[opportunity.type] || TYPE_CONFIG["job-listing"];
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const {
    isLoading,
    post,
    delete: deleteOpp,
    updateStatus,
  } = useOpportunitiesManager();

  useEffect(() => {
    if (activeTab === "open" || activeTab === "closed") {
      const fetchApplicants = async () => {
        setLoadingApplicants(true);
        try {
          const data = await getApplications({
            opportunityId: opportunity.id,
          });
          setApplicants(data.slice(0, 3));
        } catch (error) {
          console.error("Error fetching applicants:", error);
        } finally {
          setLoadingApplicants(false);
        }
      };

      fetchApplicants();
    }
  }, [opportunity.id, activeTab]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLoading || showModal || showDeleteModal) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/opportunities/${opportunity.id}`);
  };

  const confirmPost = async () => {
    try {
      await post(opportunity.id);
      setShowModal(false);
      toast({
        title: "Success",
        description: "Opportunity posted successfully",
      });
      onMutationSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to post opportunity";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setShowModal(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteOpp(opportunity.id);
      setShowDeleteModal(false);
      toast({
        title: "Success",
        description: "Opportunity deleted successfully",
      });
      onMutationSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete opportunity";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setShowDeleteModal(false);
    }
  };

  const renderOpportunityActions = () => {
    if (activeTab === "closed") {
      return (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2.5">
            {applicants.length > 0 ? (
              applicants.map((app) => (
                <img
                  key={app.id}
                  src={app.user.talentProfile.profileImageUrl}
                  alt={app.user.talentProfile.fullName}
                  title={app.user.talentProfile.fullName}
                  className="w-6 h-6 rounded-full border border-white flex-shrink-0 object-cover"
                />
              ))
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-gray-300 border border-white flex-shrink-0" />
                <div className="w-6 h-6 rounded-full bg-gray-400 border border-white flex-shrink-0" />
                <div className="w-6 h-6 rounded-full bg-gray-500 border border-white flex-shrink-0" />
              </>
            )}
          </div>
          <div className="text-xs font-medium font-inter-tight text-black">
            {opportunity.applicantsCount} Talent Applied
          </div>
        </div>
      );
    }

    if (activeTab === "draft") {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/opportunities/edit/${opportunity.id}`);
      };

      const handlePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowModal(true);
      };

      return (
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleEdit}
            className="flex items-center gap-0.5 h-8 px-3 bg-[#181B25] text-white rounded-full hover:bg-[#2a2d35] transition-colors flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4106 4.48679L12.4619 3.43547C13.0425 2.85484 13.9839 2.85484 14.5645 3.43547C15.1451 4.0161 15.1451 4.95748 14.5645 5.53811L13.5132 6.58943M11.4106 4.48679L5.23517 10.6622C4.4512 11.4462 4.05919 11.8381 3.79228 12.3158C3.52535 12.7935 3.2568 13.9214 3 15C4.07857 14.7432 5.20649 14.4746 5.68417 14.2077C6.16184 13.9408 6.55383 13.5488 7.33781 12.7648L13.5132 6.58943M11.4106 4.48679L13.5132 6.58943"
                stroke="white"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 15H12.75"
                stroke="white"
                strokeWidth="1.125"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px] font-medium font-inter-tight">
              Edit
            </span>
          </button>

          <button
            onClick={handlePost}
            className="flex items-center gap-0.5 h-8 px-3 bg-[#5C30FF] text-white rounded-full border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.75 10.5L6.375 13.125L14.25 4.875"
                stroke="white"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-medium font-inter-tight">
              Post
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="flex items-center gap-0.5 h-8 px-3 bg-red-50 text-red-600 rounded-full border border-red-200 hover:bg-red-100 transition-colors flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 4.5H15.75M7.5 7.5V13.5M10.5 7.5V13.5M3.75 4.5L4.5 14.25C4.5 14.663 4.66875 15.059 4.97919 15.3508C5.28963 15.6425 5.70218 15.825 6.125 15.825H11.875C12.2982 15.825 12.7104 15.6425 13.0208 15.3508C13.3313 15.059 13.5 14.663 13.5 14.25L14.25 4.5M6.375 4.5V3.375C6.375 3.16875 6.45938 2.97188 6.60469 2.82656C6.75 2.68125 6.94688 2.59688 7.15312 2.59688H10.8469C11.0531 2.59688 11.25 2.68125 11.3953 2.82656C11.5406 2.97188 11.625 3.16875 11.625 3.375V4.5"
                stroke="currentColor"
                strokeWidth="1.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-medium font-inter-tight">
              Delete
            </span>
          </button>
        </div>
      );
    }

    const handleMarkAsFilled = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await updateStatus(opportunity.id, "closed");
        toast({
          title: "Success",
          description: "Opportunity marked as filled",
        });
        onMutationSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to mark opportunity as filled";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    };

    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleMarkAsFilled}
          disabled={isLoading}
          className="flex items-center gap-0.5 h-8 px-3 bg-[#5C30FF] text-white rounded-full border border-[#5C30FF] hover:bg-[#4a26cc] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 10.5L6.375 13.125L14.25 4.875"
              stroke="white"
              strokeWidth="1.125"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[10px] font-medium font-inter-tight">
            {isLoading ? "Marking..." : "Mark As Filled"}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.992 12H11.9995"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9842 18H11.9917"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9998 6H12.0073"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/opportunities/edit/${opportunity.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/opportunities/${opportunity.id}/applicants`);
              }}
            >
              View Applications
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col border border-[#E1E4EA] cursor-pointer hover:shadow-md transition-shadow ${
        activeTab === "open" ? "rounded-t-[16px]" : "rounded-[16px]"
      } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      {/* Opportunity Card */}
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src={opportunity.companyLogo}
              alt={opportunity.companyName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <div className="text-xs font-medium font-inter-tight text-black">
                {opportunity.companyName}
              </div>
              <div className="text-[11px] font-light font-inter-tight text-[#525866]">
                {opportunity.date}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-1 px-2 py-1.5 rounded-md flex-shrink-0"
            style={{ backgroundColor: config.bgColor }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.dotColor }}
            />
            <span
              className="text-[10px] font-normal font-inter-tight"
              style={{ color: config.textColor }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-medium font-inter-tight text-black">
          {opportunity.title}
        </h3>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {opportunity.skills.map((skill, index) => (
            <span
              key={index}
              className="text-[12px] font-normal font-inter-tight text-black"
            >
              {skill}
              {index < opportunity.skills.length - 1 && (
                <span className="ml-1.5 text-gray-300">•</span>
              )}
            </span>
          ))}
        </div>

        {/* Rate and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-[#E1E4EA]">
          {opportunity.type !== "volunteer" && (
            <div className="text-[15px] font-medium font-inter-tight text-black">
              {opportunity.priceMode === "fixed" ? (
                <>
                  ₦{(opportunity.price || 0).toLocaleString()}
                  {opportunity.paymentType && (
                    <span>
                      /
                      {opportunity.paymentType === "hourly"
                        ? "hr"
                        : opportunity.paymentType === "weekly"
                          ? "wk"
                          : "mo"}
                    </span>
                  )}
                </>
              ) : (
                <>
                  ₦{(opportunity.minBudget || 0).toLocaleString()} - ₦
                  {(opportunity.maxBudget || 0).toLocaleString()}
                  {opportunity.paymentType && (
                    <span>
                      /
                      {opportunity.paymentType === "hourly"
                        ? "hr"
                        : opportunity.paymentType === "weekly"
                          ? "wk"
                          : "mo"}
                    </span>
                  )}
                </>
              )}
              {opportunity.duration && (
                <>
                  <span className="mx-1.5">•</span>
                  <span>{opportunity.duration}</span>
                </>
              )}
            </div>
          )}

          <div className="sm:ml-auto">{renderOpportunityActions()}</div>
        </div>
      </div>

      {/* Applicants Section - Only for Open Opportunities */}
      {activeTab === "open" && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/opportunities/${opportunity.id}/applicants`);
          }}
          className="flex items-center gap-2 p-3 border-t border-[#E1E4EA] rounded-b-[16px] cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex -space-x-2.5">
            {loadingApplicants ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gray-300 border border-white flex-shrink-0 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-gray-400 border border-white flex-shrink-0 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-gray-500 border border-white flex-shrink-0 animate-pulse" />
              </>
            ) : applicants.length > 0 ? (
              applicants.map((app) => (
                <img
                  key={app.id}
                  src={app.user.talentProfile.profileImageUrl}
                  alt={app.user.talentProfile.fullName}
                  title={app.user.talentProfile.fullName}
                  className="w-6 h-6 rounded-full border border-white flex-shrink-0 object-cover"
                />
              ))
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-gray-300 border border-white flex-shrink-0" />
                <div className="w-6 h-6 rounded-full bg-gray-400 border border-white flex-shrink-0" />
                <div className="w-6 h-6 rounded-full bg-gray-500 border border-white flex-shrink-0" />
              </>
            )}
          </div>
          <p className="text-xs font-medium font-inter-tight">
            <span className="text-black">
              {opportunity.applicantsCount} talents already applied to this
              opportunity.{" "}
            </span>
            <span className="text-[#E39B00] underline">View</span>
          </p>
        </div>
      )}

      {/* Post Confirmation Modal */}
      {activeTab === "draft" && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Post Opportunity"
          description={`Are you sure you want to post "${opportunity.title}"? It will be visible to all talents.`}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPost}
                disabled={isLoading}
                className="bg-[#5C30FF] hover:bg-[#4a1fe5]"
              >
                {isLoading ? "Posting..." : "Post Now"}
              </Button>
            </>
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={activeTab === "draft" ? "Delete Draft?" : "Delete Opportunity?"}
        description={`Are you sure you want to delete "${opportunity.title}"? This action cannot be undone.`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading
                ? "Deleting..."
                : `Delete ${activeTab === "draft" ? "Draft" : "Opportunity"}`}
            </Button>
          </>
        }
      />
    </div>
  );
}
