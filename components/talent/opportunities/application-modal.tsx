"use client";

import { useState } from "react";
import { X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleColors } from "@/lib/theme/RoleColorContext";
import { useApplications } from "@/hooks/useApplications";
import { useToast, useProfile } from "@/hooks";
import type { DisplayOpportunity } from "./types";
import { ProjectSelectionModal } from "./project-selection-modal";

interface ApplicationModalProps {
  isOpen: boolean;
  opportunity: DisplayOpportunity | null;
  onClose: () => void;
  onSubmit?: () => void;
}

export interface Project {
  id: string;
  title: string;
  image: string;
  tags: string[];
}

export function ApplicationModal({
  isOpen,
  opportunity,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const { toast } = useToast();
  const { primary } = useRoleColors();
  const { activeRole } = useProfile();
  const { submit, isLoading: isSubmitting } = useApplications();
  const [proposal, setProposal] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!opportunity) return null;

  const isFormValid =
    proposal.trim().length >= 10 && selectedProjects.length <= 3;

  const handleRemoveProject = (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleProjectsSelected = (projects: Project[]) => {
    setSelectedProjects(projects);
    setShowProjectSelection(false);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setError(null);

    try {
      const profileType = (activeRole === "mentor" ? "mentor" : "talent") as
        | "talent"
        | "mentor";
      await submit({
        opportunityId: opportunity.id,
        profileType,
        note: proposal.trim() || undefined,
        galleryIds: selectedProjects.map((p) => p.id),
        files: [],
      });

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });

      // Reset form after success
      setTimeout(() => {
        setProposal("");
        setSelectedProjects([]);
        setError(null);
        onSubmit?.();
        onClose();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit application";
      console.error("ApplicationModal.handleSubmit - CAUGHT ERROR:", {
        opportunityId: opportunity.id,
        error: message,
        fullError: err,
      });
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setProposal("");
      setSelectedProjects([]);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-[17px] w-full max-w-[515px] mx-4 max-h-[95vh] overflow-y-auto shadow-[0_0_15px_0_rgba(0,0,0,0.15)]">
          {/* Content */}
          <div className="p-[20px_16px] flex flex-col items-center gap-[30px]">
            {/* Title */}
            <h2 className="w-full text-center text-black font-inter-tight text-[15px] font-medium leading-[15px] capitalize flex-shrink-0">
              Apply with your TalentNG profile
            </h2>

            {/* Form Content */}
            <div className="w-full flex flex-col gap-[22px]">
              {/* Error Message */}
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-[8px] flex-shrink-0">
                  <p className="text-[11px] text-red-600 font-inter-tight">
                    {error}
                  </p>
                </div>
              )}

              {/* Your Proposal */}
              <div className="flex flex-col gap-[10px] flex-shrink-0">
                <div className="flex items-center justify-between">
                  <label className="text-[#525866] font-inter-tight text-[14px] font-normal">
                    Your Proposal
                  </label>
                  <span className="text-[#99A0AE] font-inter-tight text-[12px]">
                    {proposal.trim().length}/10 min
                  </span>
                </div>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Type here (minimum 10 characters)"
                  disabled={isSubmitting}
                  className="w-full px-[12px] py-[18px] pb-[120px] border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[14px] text-black placeholder:text-[#99A0AE] resize-none focus:outline-none disabled:bg-gray-50"
                  style={{ "--tw-ring-color": primary } as React.CSSProperties}
                  onFocus={(e) => (e.currentTarget.style.borderColor = primary)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E1E4EA")
                  }
                />
              </div>

              {/* Attach Relevant Projects */}
              <div className="flex flex-col gap-[12px] flex-shrink-0">
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[#525866] font-inter-tight text-[14px] font-normal">
                    Attach Relevant Projects (Optional: Max 3)
                  </label>
                  <button
                    onClick={() => setShowProjectSelection(true)}
                    disabled={isSubmitting}
                    className="flex items-center gap-[6px] px-[12px] py-[16px] border border-[#E1E4EA] rounded-[8px] hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LinkIcon size={20} className="text-[#525866]" />
                    <span className="text-[#525866] font-inter-tight text-[14px] font-normal">
                      Attach here
                    </span>
                  </button>
                </div>

                {/* Selected Projects */}
                {selectedProjects.length > 0 && (
                  <div className="flex items-center gap-[3.5px] overflow-x-auto flex-shrink-0">
                    {selectedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="relative w-[158px] h-[120px] flex-shrink-0"
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="absolute left-0 top-[8px] w-[149px] h-[112px] object-cover rounded-[7px]"
                        />
                        <button
                          onClick={() => handleRemoveProject(project.id)}
                          disabled={isSubmitting}
                          className="absolute right-0 top-0 w-[17px] h-[17px] bg-white rounded-full shadow-[0_0_15px_0_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.7213 3.57324L3.5747 10.7198M10.7208 10.7203L3.57422 3.57375"
                              stroke="#525866"
                              strokeWidth="1.90588"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full px-[160px] py-[18px] rounded-[20px] border text-white text-center font-inter-tight text-[13px] font-normal leading-normal hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                style={{ backgroundColor: primary, borderColor: primary }}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Selection Modal */}
      <ProjectSelectionModal
        isOpen={showProjectSelection}
        onClose={() => setShowProjectSelection(false)}
        selectedProjects={selectedProjects}
        onProjectsSelected={handleProjectsSelected}
      />
    </>
  );
}
