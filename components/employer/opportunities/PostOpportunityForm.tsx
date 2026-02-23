"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import {
  useCreateOpportunity,
  useRecruiterOpportunitiesQuery,
} from "@/hooks/useRecruiterOpportunities";
import { useToast } from "@/hooks";
import type { FormSection } from "@/lib/types";
import { FormSectionComponent } from "./FormSection";
import { BasicInfoStep } from "./post-steps/BasicInfoStep";
import { DescriptionStep } from "./post-steps/DescriptionStep";
import { BudgetScopeStep } from "./post-steps/BudgetScopeStep";

const DEFAULT_FORM_DATA = {
  type: "",
  title: "",
  description: "",
  keyResponsibilities: [] as string[],
  requirements: [] as string[],
  tags: [] as string[],
  tools: [] as string[],
  category: "",
  workType: "",
  location: "",
  paymentType: "" as "weekly" | "monthly" | "hourly" | "",
  priceMode: "range" as "range" | "fixed",
  minBudget: "",
  maxBudget: "",
  price: "",
  duration: "",
  startDate: "",
  experienceLevel: "",
  employmentType: "",
  status: "active" as const,
  applicationCap: "",
  closingDate: "",
};

export function PostOpportunityForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const createMutation = useCreateOpportunity();
  const { data: opportunitiesRaw } = useRecruiterOpportunitiesQuery();
  const allExistingOpportunities = opportunitiesRaw?.data || [];

  const [titleError, setTitleError] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string>("basic-info");
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("opportunityFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_FORM_DATA,
          ...parsed,
          workType: (parsed.workType || "").toLowerCase() || "",
          experienceLevel: (() => {
            const level = parsed.experienceLevel || "";
            const normalized = level.toLowerCase();
            if (normalized === "junior" || normalized === "entry")
              return "Entry";
            if (normalized === "mid" || normalized === "intermediate")
              return "Intermediate";
            if (normalized === "senior") return "Senior";
            if (normalized === "expert") return "Expert";
            return level;
          })(),
        };
      } catch (e) {
        console.error("Failed to parse saved form data:", e);
      }
    }
    return DEFAULT_FORM_DATA;
  });

  const clearForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    sessionStorage.removeItem("opportunityFormData");
  };

  const checkDuplicateTitle = () => {
    const title = formData.title.trim();
    if (!title) {
      setTitleError("");
      return;
    }
    const duplicate = allExistingOpportunities.some(
      (opp) => opp.title.toLowerCase() === title.toLowerCase(),
    );
    setTitleError(
      duplicate ? "You already have an opportunity with this title." : "",
    );
  };

  useEffect(() => {
    if (formData.title.trim()) {
      checkDuplicateTitle();
    }
  }, []);

  const validateAllSections = (): string | null => {
    // Basic Info
    if (
      !formData.title.trim() ||
      formData.title.trim().length < 5 ||
      !formData.type ||
      !formData.category ||
      !formData.workType ||
      !formData.location ||
      !formData.employmentType
    ) {
      return "basic-info";
    }

    // Description
    if (
      !formData.description.trim() ||
      formData.description.trim().length < 30 ||
      formData.keyResponsibilities.length === 0 ||
      formData.tags.length === 0 ||
      formData.tools.length === 0
    ) {
      return "description";
    }

    // Budget & Scope (skip for volunteer)
    if (!isVolunteer) {
      if (
        !formData.paymentType ||
        !formData.duration ||
        !formData.startDate ||
        !formData.experienceLevel
      ) {
        return "budget-scope";
      }
      if (formData.priceMode === "range") {
        if (!formData.minBudget || !formData.maxBudget) return "budget-scope";
      } else if (!formData.price) {
        return "budget-scope";
      }
    }

    return null;
  };

  const handleSave = () => {
    if (titleError) {
      setExpandedSection("basic-info");
      setTimeout(() => {
        const el = sectionRefs.current["basic-info"];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      toast({
        title: "Duplicate Title",
        description: "Please choose a different title before continuing.",
        variant: "destructive",
      });
      return;
    }

    const failedSection = validateAllSections();
    if (failedSection) {
      setExpandedSection(failedSection);
      setTimeout(() => {
        const el = sectionRefs.current[failedSection];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      toast({
        title: "Incomplete",
        description: "Please complete all required fields before posting.",
        variant: "destructive",
      });
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set("data", JSON.stringify(formData));
    router.push(`/opportunities/preview?${searchParams.toString()}`);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);

    setTimeout(() => {
      const element = sectionRefs.current[section];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev: typeof formData) => ({ ...prev, ...data }));
  };

  const isVolunteer = formData.type?.toLowerCase() === "volunteer";

  // Clear budget fields when switching to volunteer
  useEffect(() => {
    if (isVolunteer) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        paymentType: "",
        priceMode: "range",
        minBudget: "",
        maxBudget: "",
        price: "",
        duration: "",
        startDate: "",
        experienceLevel: "",
      }));
    }
  }, [isVolunteer]);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("opportunityFormData", JSON.stringify(formData));
  }, [formData]);

  // Warn before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const buildCompensation = (): string => {
    if (!formData.paymentType) return "";

    if (formData.priceMode === "range") {
      return `${formData.minBudget}-${formData.maxBudget} ${formData.paymentType}`;
    } else {
      return `${formData.price} ${formData.paymentType}`;
    }
  };

  const transformFormData = (status: "draft" | "active" = "draft") => ({
    ...formData,
    compensation: buildCompensation(),
    minBudget: formData.minBudget ? Number(formData.minBudget) : undefined,
    maxBudget: formData.maxBudget ? Number(formData.maxBudget) : undefined,
    price: formData.price ? Number(formData.price) : undefined,
    applicationCap: formData.applicationCap
      ? Number(formData.applicationCap)
      : undefined,
    closingDate: formData.closingDate
      ? new Date(formData.closingDate).toISOString()
      : undefined,
    startDate: formData.startDate
      ? new Date(formData.startDate).toISOString()
      : undefined,
    status,
  });

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    try {
      await createMutation.mutateAsync(transformFormData("draft"));
      clearForm();
      toast({
        title: "Success",
        description: "Opportunity saved as draft",
      });
      router.push("/opportunities?tab=draft");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save draft";
      const isDuplicate = message
        .toLowerCase()
        .includes("already have an opportunity with this title");
      toast({
        title: isDuplicate ? "Duplicate Title" : "Error",
        description: isDuplicate
          ? "You already have an opportunity with this title. Please choose a different title."
          : message,
        variant: "destructive",
      });
    }
  };

  // Handle navigation with confirmation
  const handleCancel = () => {
    setShowExitModal(true);
    setPendingNavigation(() => () => {
      sessionStorage.removeItem("opportunityFormData");
      router.push("/opportunities");
    });
  };

  const handleDiscard = () => {
    sessionStorage.removeItem("opportunityFormData");
    setShowExitModal(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const handleCloseModal = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[250px] border-r border-[#E1E4EA] p-6 overflow-y-auto flex flex-col gap-[22px]">
        <h3 className="text-[14px] font-semibold text-black">Sections</h3>
        <div className="flex flex-col gap-[22px]">
          <button
            onClick={() => toggleSection("basic-info")}
            className={`text-[14px] font-normal transition-colors text-left ${
              expandedSection === "basic-info"
                ? "font-medium"
                : "text-[#525866] hover:text-black"
            }`}
            style={
              expandedSection === "basic-info"
                ? { color: ROLE_COLORS.recruiter.primary }
                : undefined
            }
          >
            Basic Info
          </button>
          <button
            onClick={() => toggleSection("description")}
            className={`text-[14px] font-normal transition-colors text-left ${
              expandedSection === "description"
                ? "font-medium"
                : "text-[#525866] hover:text-black"
            }`}
            style={
              expandedSection === "description"
                ? { color: ROLE_COLORS.recruiter.primary }
                : undefined
            }
          >
            Description
          </button>
          {!isVolunteer && (
            <button
              onClick={() => toggleSection("budget-scope")}
              className={`text-[14px] font-normal transition-colors text-left ${
                expandedSection === "budget-scope"
                  ? "font-medium"
                  : "text-[#525866] hover:text-black"
              }`}
              style={
                expandedSection === "budget-scope"
                  ? { color: ROLE_COLORS.recruiter.primary }
                  : undefined
              }
            >
              Budget & Scope
            </button>
          )}
          <button
            onClick={() => toggleSection("application-settings")}
            className={`text-[14px] font-normal transition-colors text-left ${
              expandedSection === "application-settings"
                ? "font-medium"
                : "text-[#525866] hover:text-black"
            }`}
            style={
              expandedSection === "application-settings"
                ? { color: ROLE_COLORS.recruiter.primary }
                : undefined
            }
          >
            Application Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Action Bar */}
        <div className="px-[80px] py-4 border-b border-[#E1E4EA] flex items-center justify-between">
          <h1 className="font-inter-tight text-[17px] font-medium text-black">
            Post An Opportunity
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2 border border-gray-200 rounded-full font-inter-tight text-[13px] font-normal text-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full font-inter-tight text-[13px] font-normal text-white hover:opacity-80 transition-colors"
              style={{
                backgroundColor: ROLE_COLORS.recruiter.primary,
                borderColor: ROLE_COLORS.recruiter.primary,
              }}
            >
              Save & Post
            </button>
          </div>
        </div>

        {/* Form Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-styled px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            {/* Basic Info Section */}
            <FormSectionComponent
              title="Basic Info"
              isExpanded={expandedSection === "basic-info"}
              onToggle={() => toggleSection("basic-info")}
              forwardedRef={(el) => {
                if (el) sectionRefs.current["basic-info"] = el;
              }}
            >
              <BasicInfoStep
                formData={{
                  type: formData.type,
                  title: formData.title,
                  category: formData.category,
                  workType: formData.workType,
                  location: formData.location,
                  employmentType: formData.employmentType,
                }}
                updateFormData={(data) => {
                  updateFormData(data);
                  if (data.title !== undefined) setTitleError("");
                }}
                onNext={() => toggleSection("description")}
                titleError={titleError}
                onTitleBlur={checkDuplicateTitle}
              />
            </FormSectionComponent>

            {/* Description Section */}
            <FormSectionComponent
              title="Description"
              isExpanded={expandedSection === "description"}
              onToggle={() => toggleSection("description")}
              forwardedRef={(el) => {
                if (el) sectionRefs.current["description"] = el;
              }}
            >
              <DescriptionStep
                formData={{
                  description: formData.description,
                  keyResponsibilities: formData.keyResponsibilities,
                  requirements: formData.requirements,
                  tags: formData.tags,
                  tools: formData.tools,
                }}
                updateFormData={updateFormData}
                onNext={() => toggleSection("budget-scope")}
              />
            </FormSectionComponent>

            {/* Budget & Scope Section - Hidden for Volunteer */}
            {!isVolunteer && (
              <FormSectionComponent
                title="Budget & Scope"
                isExpanded={expandedSection === "budget-scope"}
                onToggle={() => toggleSection("budget-scope")}
                forwardedRef={(el) => {
                  if (el) sectionRefs.current["budget-scope"] = el;
                }}
              >
                <BudgetScopeStep
                  formData={{
                    paymentType: formData.paymentType,
                    priceMode: formData.priceMode,
                    minBudget: formData.minBudget,
                    maxBudget: formData.maxBudget,
                    price: formData.price,
                    duration: formData.duration,
                    startDate: formData.startDate,
                    experienceLevel: formData.experienceLevel,
                  }}
                  updateFormData={updateFormData}
                  onSubmit={handleSave}
                  onNext={() => toggleSection("application-settings")}
                />
              </FormSectionComponent>
            )}

            {/* Application Settings Section */}
            <div
              ref={(el) => {
                if (el) sectionRefs.current["application-settings"] = el;
              }}
              className="border border-gray-300 rounded-[16px] overflow-hidden"
            >
              <button
                onClick={() => toggleSection("application-settings")}
                className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-black text-[14px]">
                  Application Settings
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedSection === "application-settings"
                      ? "rotate-180"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              {expandedSection === "application-settings" && (
                <>
                  <div className="h-[1px] bg-gray-300" />
                  <div className="p-5 flex flex-col gap-5">
                    {/* Application Cap */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-medium text-black">
                        Application Cap{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <p className="text-[12px] text-gray-500 mb-2">
                        Maximum number of applications to accept. Leave empty
                        for unlimited.
                      </p>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g., 50"
                        value={formData.applicationCap}
                        onChange={(e) =>
                          updateFormData({ applicationCap: e.target.value })
                        }
                        className="px-4 py-3 border border-gray-300 rounded-[10px] text-[14px] focus:outline-none"
                        style={
                          {
                            "--focus-color": ROLE_COLORS.recruiter.primary,
                          } as React.CSSProperties
                        }
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor =
                            ROLE_COLORS.recruiter.primary)
                        }
                        onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                      />
                    </div>

                    {/* Closing Date */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-medium text-black">
                        Auto-Close Date{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <p className="text-[12px] text-gray-500 mb-2">
                        Opportunity will automatically close on this date.
                      </p>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.closingDate}
                        onChange={(e) =>
                          updateFormData({ closingDate: e.target.value })
                        }
                        className="px-4 py-3 border border-gray-300 rounded-[10px] text-[14px] focus:outline-none"
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor =
                            ROLE_COLORS.recruiter.primary)
                        }
                        onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                      />
                    </div>

                    {/* Info Box */}
                    <div className="p-3 bg-blue-50 rounded-[10px] border border-blue-200">
                      <p className="text-[12px] text-blue-900">
                        <span className="font-medium">Note:</span> Opportunities
                        will automatically close when either the application cap
                        is reached or the closing date passes.
                      </p>
                    </div>

                    {/* Preview Button */}
                    <button
                      onClick={handleSave}
                      className="w-full h-[44px] bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[14px] font-normal text-white hover:bg-[#2a2d35] transition-colors mt-4"
                    >
                      Preview
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] p-6 max-w-[400px] w-full mx-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="font-inter-tight text-[17px] font-medium text-black">
                Save Changes?
              </h2>
              <p className="font-inter-tight text-[13px] text-[#525866]">
                You have unsaved changes. Would you like to save them as a draft
                before leaving?
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full font-inter-tight text-[13px] font-normal text-black hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full font-inter-tight text-[13px] font-normal text-[#E63C23] hover:bg-red-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAsDraft}
                className="flex-1 px-4 py-2.5 rounded-full font-inter-tight text-[13px] font-normal text-white hover:opacity-80 transition-colors"
                style={{
                  backgroundColor: ROLE_COLORS.recruiter.primary,
                  borderColor: ROLE_COLORS.recruiter.primary,
                }}
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
