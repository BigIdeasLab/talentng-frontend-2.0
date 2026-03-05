"use client";

import { useState } from "react";
import { X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleColors } from "@/lib/theme/RoleColorContext";
import { useSubmitApplication } from "@/hooks/useTalentApplications";
import { useToast, useProfile } from "@/hooks";
import { SuccessModal } from "@/components/ui/success-modal";
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
  const submitMutation = useSubmitApplication();
  const isSubmitting = submitMutation.isPending;
  const [proposal, setProposal] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<any[]>([]); // Store full gallery items
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!opportunity) return null;

  const isFormValid =
    selectedProjects.length >= 1 && selectedProjects.length <= 3;

  const handleRemoveProject = (projectId: string) => {
    setSelectedProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleProjectsSelected = (projects: Project[], fullGalleryItems?: any[]) => {
    setSelectedProjects(projects);
    if (fullGalleryItems) {
      setProjects(fullGalleryItems);
    }
    setShowProjectSelection(false);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setError(null);

    try {
      const profileType = (activeRole === "mentor" ? "mentor" : "talent") as
        | "talent"
        | "mentor";
      await submitMutation.mutateAsync({
        opportunityId: opportunity.id,
        profileType,
        note: proposal.trim(),
        galleryIds: selectedProjects.map((p) => p.id) || [],
        attachments: [],
      });

      setShowSuccess(true);
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
    } finally {
      // isSubmitting automatically handled by mutation state
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
                    Your Proposal (Optional)
                  </label>
                  <span className="text-[#99A0AE] font-inter-tight text-[12px]">
                    {proposal.trim().length} characters
                  </span>
                </div>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Type here (optional)"
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
                    Attach Relevant Projects (Required: 1-3 projects)
                  </label>
                  <button
                    onClick={() => setShowProjectSelection(true)}
                    disabled={isSubmitting}
                    className="flex items-center gap-[6px] px-[12px] py-[16px] border border-[#E1E4EA] rounded-[8px] hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LinkIcon size={20} className="text-[#525866]" />
                    <span className="text-[#525866] font-inter-tight text-[14px] font-normal">
                      {selectedProjects.length === 0 ? 'Select projects' : 'Change selection'}
                    </span>
                  </button>
                </div>

                {/* Selected Projects */}
                {selectedProjects.length > 0 && (
                  <div className="flex items-center gap-[3.5px] overflow-x-auto flex-shrink-0">
                    {selectedProjects.map((project) => {
                      // Find the full gallery item to get all images
                      const galleryItem = projects.find(
                        (p) => p.id === project.id,
                      );
                      const allImages = galleryItem?.images || [project.image];
                      const hasMultipleImages = allImages.length > 1;

                      return (
                        <div
                          key={project.id}
                          className="relative w-[158px] h-[120px] flex-shrink-0"
                        >
                          {/* Main image */}
                          <img
                            src={allImages[0]}
                            alt={project.title}
                            className="absolute left-0 top-[8px] w-[149px] h-[112px] object-cover rounded-[7px]"
                          />

                          {/* Multiple images indicator */}
                          {hasMultipleImages && (
                            <div className="absolute left-[4px] bottom-[12px] px-[6px] py-[3px] bg-black/70 rounded-[4px] flex items-center gap-[3px]">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.5 3.75V8.25C10.5 9.075 9.825 9.75 9 9.75H3C2.175 9.75 1.5 9.075 1.5 8.25V3.75C1.5 2.925 2.175 2.25 3 2.25H9C9.825 2.25 10.5 2.925 10.5 3.75Z"
                                  stroke="white"
                                  strokeWidth="0.75"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M4.125 5.25C4.53921 5.25 4.875 4.91421 4.875 4.5C4.875 4.08579 4.53921 3.75 4.125 3.75C3.71079 3.75 3.375 4.08579 3.375 4.5C3.375 4.91421 3.71079 5.25 4.125 5.25Z"
                                  fill="white"
                                />
                                <path
                                  d="M10.5 6.75L8.25 4.5L3 9.75"
                                  stroke="white"
                                  strokeWidth="0.75"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-white font-inter-tight text-[9px] font-medium">
                                {allImages.length}
                              </span>
                            </div>
                          )}

                          {/* Remove button */}
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
                      );
                    })}
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setProposal("");
          setSelectedProjects([]);
          setError(null);
          onSubmit?.();
          onClose();
        }}
        title="Application Submitted!"
        description="Your application has been sent successfully. You'll be notified once the recruiter reviews it."
        accentColor={primary}
      />
    </>
  );
}
