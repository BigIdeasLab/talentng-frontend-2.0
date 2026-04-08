"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { ResponsiveTable, ColumnDef } from "@/components/ui/ResponsiveTable";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  useDeleteOpportunity,
  useUpdateOpportunity,
  usePostOpportunity,
  useReopenOpportunity,
} from "@/hooks/useRecruiterOpportunities";
import type { OpportunityCard as OpportunityType } from "@/lib/types";
import { VerifiedBadgeIcon } from "@/components/verification/VerifiedBadgeIcon";

interface OpportunitiesTableProps {
  opportunities: OpportunityType[];
  activeTab: "open" | "closed" | "draft";
  onMutationSuccess?: () => void;
}

// Opportunity Status Color Configuration
const OPPORTUNITY_STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  draft: {
    bg: "#F5F5F5",
    dot: "#606060",
    text: "#606060",
    label: "Draft",
  },
  active: {
    bg: "#ECFDF5",
    dot: "#047857",
    text: "#047857",
    label: "Active",
  },
  closed: {
    bg: "#FEF2F2",
    dot: "#DC2626",
    text: "#DC2626",
    label: "Closed",
  },
};

export function OpportunitiesTable({
  opportunities,
  activeTab,
  onMutationSuccess,
}: OpportunitiesTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityType | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({ isOpen: false, title: "", description: "" });

  const deleteMutation = useDeleteOpportunity();
  const updateMutation = useUpdateOpportunity();
  const postMutation = usePostOpportunity();
  const reopenMutation = useReopenOpportunity();

  const isLoading =
    deleteMutation.isPending ||
    updateMutation.isPending ||
    postMutation.isPending ||
    reopenMutation.isPending;

  const handleViewClick = (opportunity: OpportunityType) => {
    router.push(`/opportunities/${opportunity.id}`);
  };

  const handleEditClick = (opportunity: OpportunityType) => {
    router.push(`/opportunities/edit/${opportunity.id}`);
  };

  const handlePostClick = (opportunity: OpportunityType) => {
    setSelectedOpportunity(opportunity);
    setShowPostModal(true);
  };

  const handleDeleteClick = (opportunity: OpportunityType) => {
    setSelectedOpportunity(opportunity);
    setShowDeleteModal(true);
  };

  const handleMarkAsFilledClick = async (opportunity: OpportunityType) => {
    try {
      await updateMutation.mutateAsync({
        id: opportunity.id,
        data: { status: "closed" },
      });
      setShowSuccess({
        isOpen: true,
        title: "Marked as Filled!",
        description:
          "This opportunity is now closed and no longer accepting applications.",
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

  const handleReopenClick = (opportunity: OpportunityType) => {
    setSelectedOpportunity(opportunity);
    setShowReopenModal(true);
  };

  const handleViewApplicantsClick = (opportunity: OpportunityType) => {
    router.push(`/opportunities/${opportunity.id}/applicants`);
  };

  const confirmPost = async () => {
    if (!selectedOpportunity) return;
    try {
      await postMutation.mutateAsync(selectedOpportunity.id);
      setShowPostModal(false);
      setShowSuccess({
        isOpen: true,
        title: "Opportunity Posted!",
        description:
          "Your opportunity is now live and talents can start applying.",
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
      setShowPostModal(false);
    } finally {
      setSelectedOpportunity(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedOpportunity) return;
    try {
      await deleteMutation.mutateAsync(selectedOpportunity.id);
      setShowDeleteModal(false);
      setShowSuccess({
        isOpen: true,
        title: "Opportunity Deleted",
        description: "The opportunity has been permanently deleted.",
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
    } finally {
      setSelectedOpportunity(null);
    }
  };

  const confirmReopen = async () => {
    if (!selectedOpportunity) return;
    const hadCap =
      selectedOpportunity.applicationCap &&
      selectedOpportunity.applicationCap > 0;
    try {
      const response = await reopenMutation.mutateAsync(selectedOpportunity.id);
      setShowReopenModal(false);
      setShowSuccess({
        isOpen: true,
        title: "Opportunity Reopened!",
        description:
          response.message ||
          "Your opportunity is now accepting new applications.",
      });
      onMutationSuccess?.();
      if (hadCap) {
        router.push(
          `/opportunities/edit/${selectedOpportunity.id}?section=application-settings`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reopen opportunity";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setShowReopenModal(false);
    } finally {
      setSelectedOpportunity(null);
    }
  };

  // Define columns for ResponsiveTable
  // Essential columns for tablet: Title, Category, Location, Applicants, Status
  const columns: ColumnDef<OpportunityType>[] = [
    {
      key: "title",
      label: "Opportunity",
      essential: true,
      render: (opportunity) => (
        <div className="flex items-center gap-2">
          <img
            src={opportunity.companyLogo}
            alt={opportunity.companyName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <div className="font-inter-tight text-[13px] font-medium text-black">
              {opportunity.title}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="font-inter-tight text-[12px] font-light text-[#525866]">
                {opportunity.companyName}
              </div>
              <VerifiedBadgeIcon
                verificationStatus={opportunity.verificationStatus}
                size="sm"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      essential: true,
      accessor: (opportunity) => opportunity.category || "-",
    },
    {
      key: "type",
      label: "Type",
      essential: false,
      render: (opportunity) => (
        <span className="capitalize">
          {opportunity.type.replace("-", " ") || "-"}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      essential: true,
      accessor: (opportunity) => opportunity.location || "Remote",
    },
    {
      key: "budget",
      label: "Budget",
      essential: false,
      render: (opportunity) => {
        if (opportunity.type === "volunteer") return "Volunteer";
        if (opportunity.priceMode === "fixed") {
          return `₦${(opportunity.price || 0).toLocaleString()}${
            opportunity.paymentType
              ? "/" +
                (opportunity.paymentType === "hourly"
                  ? "hr"
                  : opportunity.paymentType === "weekly"
                    ? "wk"
                    : "mo")
              : ""
          }`;
        }
        return `₦${(opportunity.minBudget || 0).toLocaleString()} - ₦${(opportunity.maxBudget || 0).toLocaleString()}`;
      },
    },
    {
      key: "applicants",
      label: "Applicants",
      essential: true,
      accessor: (opportunity) => opportunity.applicantsCount.toString(),
    },
    {
      key: "date",
      label: "Posted",
      essential: false,
      accessor: (opportunity) => opportunity.date,
    },
    {
      key: "status",
      label: "Status",
      essential: true,
      render: (opportunity) => (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
          style={{
            backgroundColor:
              OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.bg || "#F5F5F5",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.dot || "#606060",
            }}
          />
          <span
            className="text-[11px] font-normal font-inter-tight"
            style={{
              color:
                OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.text ||
                "#606060",
            }}
          >
            {OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.label ||
              opportunity.status}
          </span>
        </div>
      ),
    },
  ];

  // Custom mobile card renderer for opportunity data
  const mobileCardRenderer = (opportunity: OpportunityType, index: number) => (
    <div className="space-y-3">
      {/* Opportunity header with logo */}
      <div className="flex items-center gap-2">
        <div className="font-inter-tight text-[13px] font-normal text-black">
          {index + 1}.
        </div>
        <img
          src={opportunity.companyLogo}
          alt={opportunity.companyName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col gap-0.5 flex-1">
          <div className="font-inter-tight text-[13px] font-medium text-black">
            {opportunity.title}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="font-inter-tight text-[12px] font-light text-[#525866]">
              {opportunity.companyName}
            </div>
            <VerifiedBadgeIcon
              verificationStatus={opportunity.verificationStatus}
              size="sm"
            />
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0"
          style={{
            backgroundColor:
              OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.bg || "#F5F5F5",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.dot || "#606060",
            }}
          />
          <span
            className="text-[11px] font-normal font-inter-tight"
            style={{
              color:
                OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.text ||
                "#606060",
            }}
          >
            {OPPORTUNITY_STATUS_CONFIG[opportunity.status]?.label ||
              opportunity.status}
          </span>
        </div>
      </div>

      {/* Skills */}
      {opportunity.skills && opportunity.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {opportunity.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-[#F5F5F5] text-[#525866] text-[11px] font-normal font-inter-tight rounded-full"
            >
              {skill}
            </span>
          ))}
          {opportunity.skills.length > 3 && (
            <span className="px-2.5 py-1 bg-[#F5F5F5] text-[#525866] text-[11px] font-normal font-inter-tight rounded-full">
              +{opportunity.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Opportunity details */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Category
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {opportunity.category || "-"}
          </div>
        </div>
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Location
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {opportunity.location || "Remote"}
          </div>
        </div>
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Applicants
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {opportunity.applicantsCount}
          </div>
        </div>
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Posted
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {opportunity.date}
          </div>
        </div>
        {opportunity.type !== "volunteer" && (
          <div className="col-span-2">
            <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
              Budget
            </div>
            <div className="font-inter-tight text-[12px] text-black">
              {opportunity.priceMode === "fixed"
                ? `₦${(opportunity.price || 0).toLocaleString()}${
                    opportunity.paymentType
                      ? "/" +
                        (opportunity.paymentType === "hourly"
                          ? "hr"
                          : opportunity.paymentType === "weekly"
                            ? "wk"
                            : "mo")
                      : ""
                  }`
                : `₦${(opportunity.minBudget || 0).toLocaleString()} - ₦${(opportunity.maxBudget || 0).toLocaleString()}`}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons for mobile */}
      <div className="pt-2 border-t border-[#E1E4EA] flex flex-col gap-1.5">
        {activeTab === "draft" && (
          <>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleEditClick(opportunity)}
                className="flex-1 px-3 py-1.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[11px] font-medium hover:bg-[#2a2d35] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handlePostClick(opportunity)}
                className="flex-1 px-3 py-1.5 text-white rounded-full font-inter-tight text-[11px] font-medium hover:opacity-80 transition-colors"
                style={{
                  backgroundColor: ROLE_COLORS.recruiter.primary,
                }}
              >
                Post
              </button>
            </div>
            <button
              onClick={() => handleDeleteClick(opportunity)}
              className="w-full px-3 py-1.5 bg-red-50 text-red-600 rounded-full font-inter-tight text-[11px] font-medium border border-red-200 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </>
        )}
        {activeTab === "open" && (
          <>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleViewClick(opportunity)}
                className="flex-1 px-3 py-1.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[11px] font-medium hover:bg-[#2a2d35] transition-colors"
              >
                View
              </button>
              <button
                onClick={() => handleViewApplicantsClick(opportunity)}
                className="flex-1 px-3 py-1.5 text-white rounded-full font-inter-tight text-[11px] font-medium hover:opacity-80 transition-colors"
                style={{
                  backgroundColor: ROLE_COLORS.recruiter.primary,
                }}
              >
                View Applicants
              </button>
            </div>
            <button
              onClick={() => handleMarkAsFilledClick(opportunity)}
              disabled={isLoading}
              className="w-full px-3 py-1.5 bg-gray-50 text-black rounded-full font-inter-tight text-[11px] font-medium border border-[#E1E4EA] hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Mark as Filled
            </button>
          </>
        )}
        {activeTab === "closed" && (
          <>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleViewClick(opportunity)}
                className="flex-1 px-3 py-1.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[11px] font-medium hover:bg-[#2a2d35] transition-colors"
              >
                View
              </button>
              <button
                onClick={() => handleViewApplicantsClick(opportunity)}
                className="flex-1 px-3 py-1.5 bg-gray-50 text-black rounded-full font-inter-tight text-[11px] font-medium border border-[#E1E4EA] hover:bg-gray-100 transition-colors"
              >
                View Applicants
              </button>
            </div>
            <button
              onClick={() => handleReopenClick(opportunity)}
              disabled={isLoading}
              className="w-full px-3 py-1.5 text-white rounded-full font-inter-tight text-[11px] font-medium hover:opacity-80 transition-colors disabled:opacity-50"
              style={{
                backgroundColor: ROLE_COLORS.recruiter.primary,
              }}
            >
              Reopen
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <ResponsiveTable
        data={opportunities}
        columns={columns}
        mobileCardRenderer={mobileCardRenderer}
        emptyMessage="No opportunities found"
        keyExtractor={(opportunity) => opportunity.id}
        showRowNumbers={true}
      />

      {/* Post Confirmation Modal */}
      {selectedOpportunity && (
        <Modal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setSelectedOpportunity(null);
          }}
          title="Post Opportunity"
          description={`Are you sure you want to post "${selectedOpportunity.title}"? It will be visible to all talents.`}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPostModal(false);
                  setSelectedOpportunity(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPost}
                disabled={isLoading}
                className="hover:opacity-80"
                style={{ backgroundColor: ROLE_COLORS.recruiter.primary }}
              >
                {isLoading ? "Posting..." : "Post Now"}
              </Button>
            </>
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedOpportunity && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedOpportunity(null);
          }}
          title={
            activeTab === "draft" ? "Delete Draft?" : "Delete Opportunity?"
          }
          description={`Are you sure you want to delete "${selectedOpportunity.title}"? This action cannot be undone.`}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedOpportunity(null);
                }}
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
      )}

      {/* Reopen Confirmation Modal */}
      {selectedOpportunity && (
        <Modal
          isOpen={showReopenModal}
          onClose={() => {
            setShowReopenModal(false);
            setSelectedOpportunity(null);
          }}
          title="Reopen Opportunity"
          description={
            selectedOpportunity.applicationCap &&
            selectedOpportunity.applicationCap > 0
              ? `Are you sure you want to reopen "${selectedOpportunity.title}"? It will be visible to all talents and accept new applications. Any previous application cap will be cleared.`
              : `Are you sure you want to reopen "${selectedOpportunity.title}"? It will be visible to all talents and accept new applications.`
          }
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReopenModal(false);
                  setSelectedOpportunity(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReopen}
                disabled={isLoading}
                className="hover:opacity-80"
                style={{ backgroundColor: ROLE_COLORS.recruiter.primary }}
              >
                {isLoading ? "Reopening..." : "Reopen"}
              </Button>
            </>
          }
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess.isOpen}
        onClose={() => setShowSuccess((s) => ({ ...s, isOpen: false }))}
        title={showSuccess.title}
        description={showSuccess.description}
        accentColor={ROLE_COLORS.recruiter.primary}
      />
    </>
  );
}
