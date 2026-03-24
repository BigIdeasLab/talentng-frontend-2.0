"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks";
import type { ApplicantFilterState } from "@/components/employer/applicants/ApplicantFilterModal";
import {
  updateApplicationStatus,
  scheduleInterview,
} from "@/lib/api/applications";
import { SuccessModal } from "@/components/ui/success-modal";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { HireApplicationModal } from "@/components/employer/applicants/HireApplicationModal";
import {
  ResponsiveTable,
  ColumnDef,
  RowAction,
} from "@/components/ui/ResponsiveTable";

interface Applicant {
  id: string;
  userId: string;
  opportunityId: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  opportunity?: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
    talentProfile: {
      id: string;
      fullName: string;
      headline: string;
      bio?: string;
      skills: string[];
      location: string;
      profileImageUrl: string;
      category: string;
    };
  };
}

interface ApplicantsTableProps {
  searchQuery: string;
  sortBy: string;
  applicants: Applicant[];
  opportunityTitle?: string;
  appliedFilters?: ApplicantFilterState | null;
}

export function ApplicantsTable({
  searchQuery,
  sortBy,
  applicants,
  opportunityTitle,
  appliedFilters,
}: ApplicantsTableProps) {
  const { toast } = useToast();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [showHireSuccess, setShowHireSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredAndSortedApplicants = useMemo(() => {
    let result = (applicants || []).filter((applicant) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        applicant.user?.talentProfile?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        applicant.user?.username
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Applied filters
      if (appliedFilters) {
        if (
          appliedFilters.status.length > 0 &&
          !appliedFilters.status.includes(applicant.status)
        ) {
          return false;
        }
        if (
          appliedFilters.location &&
          applicant.user?.talentProfile?.location !== appliedFilters.location
        ) {
          return false;
        }

        if (appliedFilters.dateRange && appliedFilters.dateRange !== "all") {
          const createdAt = new Date(applicant.createdAt);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24),
          );

          if (appliedFilters.dateRange === "today" && diffDays > 0)
            return false;
          if (appliedFilters.dateRange === "week" && diffDays > 7) return false;
          if (appliedFilters.dateRange === "month" && diffDays > 30)
            return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return 0;
    });

    return result;
  }, [applicants, searchQuery, appliedFilters, sortBy]);

  const handleHireClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsHireModalOpen(true);
  };

  const handleHire = async (
    applicationId: string,
    message: string,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      // Update application status to "hired"
      await updateApplicationStatus(applicationId, "hired");

      setIsHireModalOpen(false);
      setShowHireSuccess(true);
    } catch (error) {
      console.error("Error hiring applicant:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Define columns for ResponsiveTable
  // Essential columns for tablet: Talents, Location, Date Applied, Status
  const columns: ColumnDef<Applicant>[] = [
    {
      key: "talent",
      label: "Talents",
      essential: true,
      render: (applicant) => (
        <div className="flex items-center gap-2">
          <img
            src={applicant.user?.talentProfile?.profileImageUrl || ""}
            alt={applicant.user?.talentProfile?.fullName || ""}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex flex-col gap-0.5">
            <div className="font-inter-tight text-[13px] font-medium text-black">
              {applicant.user?.talentProfile?.fullName || "Unknown"}
            </div>
            <div className="font-inter-tight text-[12px] font-light text-[#525866]">
              {applicant.user?.talentProfile?.headline ||
                applicant.user?.talentProfile?.category ||
                ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "hires",
      label: "Hires",
      essential: false,
      accessor: () => "-",
    },
    {
      key: "opportunity",
      label: "Opportunity",
      essential: false,
      accessor: () => opportunityTitle || "-",
    },
    {
      key: "location",
      label: "Location",
      essential: true,
      accessor: (applicant) => applicant.user?.talentProfile?.location || "-",
    },
    {
      key: "dateApplied",
      label: "Date Applied",
      essential: true,
      accessor: (applicant) => formatDate(applicant.createdAt),
    },
    {
      key: "status",
      label: "Status",
      essential: true,
      render: (applicant) => (
        <span className="capitalize">{applicant.status || "pending"}</span>
      ),
    },
  ];

  // Define actions for ResponsiveTable
  const actions: RowAction<Applicant>[] = [
    {
      key: "view",
      label: "View Profile",
      onClick: (applicant) => {
        // TODO: Navigate to profile
        console.log("View profile:", applicant.id);
      },
      className: "bg-[#181B25] text-white hover:bg-[#2a2d35]",
    },
    {
      key: "hire",
      label: "Hire",
      onClick: handleHireClick,
      className: "text-white hover:opacity-80",
    },
  ];

  // Custom mobile card renderer for applicant data
  const mobileCardRenderer = (applicant: Applicant, index: number) => (
    <div className="space-y-3">
      {/* Applicant header with profile image */}
      <div className="flex items-center gap-2">
        <div className="font-inter-tight text-[13px] font-normal text-black">
          {index + 1}.
        </div>
        <img
          src={applicant.user?.talentProfile?.profileImageUrl || ""}
          alt={applicant.user?.talentProfile?.fullName || ""}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col gap-0.5">
          <div className="font-inter-tight text-[13px] font-medium text-black">
            {applicant.user?.talentProfile?.fullName || "Unknown"}
          </div>
          <div className="font-inter-tight text-[12px] font-light text-[#525866]">
            {applicant.user?.talentProfile?.headline ||
              applicant.user?.talentProfile?.category ||
              ""}
          </div>
        </div>
      </div>

      {/* Applicant details */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Opportunity
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {opportunityTitle || "-"}
          </div>
        </div>
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Location
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {applicant.user?.talentProfile?.location || "-"}
          </div>
        </div>
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Date Applied
          </div>
          <div className="font-inter-tight text-[12px] text-black">
            {formatDate(applicant.createdAt)}
          </div>
        </div>
        <div>
          <div className="font-inter-tight text-[11px] text-[#525866] mb-0.5">
            Status
          </div>
          <div className="font-inter-tight text-[12px] text-black capitalize">
            {applicant.status || "pending"}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        <button className="flex-1 px-3 py-1.5 bg-[#181B25] text-white rounded-full font-inter-tight text-[11px] font-medium hover:bg-[#2a2d35] transition-colors">
          View Profile
        </button>
        <button
          onClick={() => handleHireClick(applicant)}
          className="flex-1 px-3 py-1.5 text-white rounded-full font-inter-tight text-[11px] font-medium border hover:opacity-80 transition-colors"
          style={{
            backgroundColor: ROLE_COLORS.recruiter.primary,
            borderColor: ROLE_COLORS.recruiter.primary,
          }}
        >
          Hire
        </button>
      </div>
    </div>
  );

  return (
    <>
      <ResponsiveTable
        data={filteredAndSortedApplicants}
        columns={columns}
        actions={actions}
        mobileCardRenderer={mobileCardRenderer}
        emptyMessage="No applicants match your search"
      />

      {/* Hire Modal */}
      {selectedApplicant && (
        <HireApplicationModal
          isOpen={isHireModalOpen}
          onClose={() => {
            setIsHireModalOpen(false);
            setSelectedApplicant(null);
          }}
          applicantName={
            selectedApplicant.user?.talentProfile?.fullName || "Applicant"
          }
          jobTitle={opportunityTitle || "Position"}
          companyName="Your Company"
          applicationId={selectedApplicant.id}
          onHire={handleHire}
        />
      )}

      <SuccessModal
        isOpen={showHireSuccess}
        onClose={() => {
          setShowHireSuccess(false);
          setSelectedApplicant(null);
        }}
        title="Hired Successfully!"
        description={`${selectedApplicant?.user?.talentProfile?.fullName} has been hired for the ${opportunityTitle} position.`}
        accentColor={ROLE_COLORS.recruiter.primary}
      />
    </>
  );
}
