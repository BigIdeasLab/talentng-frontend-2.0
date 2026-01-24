"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { useToast } from "@/hooks";
import { BasicInfoStep } from "./post-steps/BasicInfoStep";
import { DescriptionStep } from "./post-steps/DescriptionStep";
import { BudgetScopeStep } from "./post-steps/BudgetScopeStep";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type FormSection =
  | "basic-info"
  | "description"
  | "budget-scope"
  | "application-settings";

interface EditOpportunityFormProps {
  opportunityId: string;
}

export function EditOpportunityForm({
  opportunityId,
}: EditOpportunityFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getById, update, isLoading: apiLoading } = useOpportunitiesManager();
  const [expandedSection, setExpandedSection] = useState<string>("basic-info");
  const [showExitModal, setShowExitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [formData, setFormData] = useState<{
    type: string;
    title: string;
    description: string;
    keyResponsibilities: string[];
    requirements: string[];
    tags: string[];
    tools: string[];
    category: string;
    workMode: string;
    location: string;
    paymentType: "weekly" | "monthly" | "hourly" | "";
    priceMode: "range" | "fixed";
    minBudget: string;
    maxBudget: string;
    price: string;
    duration: string;
    startDate: string;
    experienceLevel: string;
    employmentType: string;
    status: "active" | "closed" | "draft";
    applicationCap: string;
    closingDate: string;
  }>(() => {
    return {
      type: "",
      title: "",
      description: "",
      keyResponsibilities: [],
      requirements: [],
      tags: [],
      tools: [],
      category: "",
      workMode: "",
      location: "",
      paymentType: "",
      priceMode: "range",
      minBudget: "",
      maxBudget: "",
      price: "",
      duration: "",
      startDate: "",
      experienceLevel: "",
      employmentType: "",
      status: "draft",
      applicationCap: "",
      closingDate: "",
    };
  });

  // Fetch opportunity data on mount
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const data = await getById(opportunityId);
        const paymentType = (data.paymentType || "") as
          | "weekly"
          | "monthly"
          | "hourly"
          | "";

        setFormData({
          type: data.type || "",
          title: data.title || "",
          description: data.description || "",
          keyResponsibilities: data.keyResponsibilities || [],
          requirements: data.requirements || [],
          tags: data.tags || [],
          tools: data.tools || [],
          category: data.category || "",
          workMode: data.workType || "",
          location: data.location || "",
          paymentType,
          priceMode: (data.priceMode || "range") as "range" | "fixed",
          minBudget: data.minBudget ? String(data.minBudget) : "",
          maxBudget: data.maxBudget ? String(data.maxBudget) : "",
          price: data.price ? String(data.price) : "",
          duration: data.duration || "",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          experienceLevel: data.experienceLevel || "",
          employmentType: data.employmentType || "",
          status: (data.status || "draft") as any,
          applicationCap: data.applicationCap
            ? String(data.applicationCap)
            : "",
          closingDate: data.closingDate
            ? new Date(data.closingDate).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Error fetching opportunity:", error);
        alert("Failed to load opportunity. Redirecting...");
        router.push("/opportunities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [opportunityId, router]);

  const buildCompensation = (): string => {
    if (!formData.paymentType) return "";

    if (formData.priceMode === "range") {
      return `${formData.minBudget}-${formData.maxBudget} ${formData.paymentType}`;
    } else {
      return `${formData.price} ${formData.paymentType}`;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        compensation: buildCompensation(),
        minBudget: formData.minBudget ? Number(formData.minBudget) : undefined,
        maxBudget: formData.maxBudget ? Number(formData.maxBudget) : undefined,
        price: formData.price ? Number(formData.price) : undefined,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        closingDate: formData.closingDate
          ? new Date(formData.closingDate).toISOString()
          : undefined,
        applicationCap: formData.applicationCap
          ? Number(formData.applicationCap)
          : undefined,
      };

      await update(opportunityId, updateData);
      toast({
        title: "Success",
        description: "Opportunity updated successfully",
      });
      router.push("/opportunities");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update opportunity";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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

  // Handle navigation with confirmation
  const handleCancel = () => {
    setShowExitModal(true);
    setPendingNavigation(() => () => {
      router.push("/opportunities");
    });
  };

  const handleDiscard = () => {
    setShowExitModal(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const handleCloseModal = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  const handlePreview = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("data", JSON.stringify(formData));
    searchParams.set("edit", opportunityId);
    searchParams.set("status", formData.status);
    router.push(`/opportunities/preview?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          <p className="text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

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
                ? "text-[#5C30FF] font-medium"
                : "text-[#525866] hover:text-black"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => toggleSection("description")}
            className={`text-[14px] font-normal transition-colors text-left ${
              expandedSection === "description"
                ? "text-[#5C30FF] font-medium"
                : "text-[#525866] hover:text-black"
            }`}
          >
            Description
          </button>
          {!isVolunteer && (
            <button
              onClick={() => toggleSection("budget-scope")}
              className={`text-[14px] font-normal transition-colors text-left ${
                expandedSection === "budget-scope"
                  ? "text-[#5C30FF] font-medium"
                  : "text-[#525866] hover:text-black"
              }`}
            >
              Budget & Scope
            </button>
          )}
          <button
            onClick={() => toggleSection("application-settings")}
            className={`text-[14px] font-normal transition-colors text-left ${
              expandedSection === "application-settings"
                ? "text-[#5C30FF] font-medium"
                : "text-[#525866] hover:text-black"
            }`}
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
            Edit Opportunity
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-5 py-2 border border-gray-200 rounded-full font-inter-tight text-[13px] font-normal text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePreview}
              disabled={isSaving}
              className="px-5 py-2 bg-[#5C30FF] border border-[#5C30FF] rounded-full font-inter-tight text-[13px] font-normal text-white hover:bg-[#4a26cc] transition-colors disabled:opacity-50"
            >
              Preview & Save
            </button>
          </div>
        </div>

        {/* Form Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-styled px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            {/* Basic Info Section */}
            <div
              ref={(el) => {
                if (el) sectionRefs.current["basic-info"] = el;
              }}
              className="border border-gray-300 rounded-[16px] overflow-hidden"
            >
              <button
                onClick={() => toggleSection("basic-info")}
                className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-black text-[14px]">
                  Basic Info
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedSection === "basic-info" ? "rotate-180" : ""
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
              {expandedSection === "basic-info" && (
                <>
                  <div className="h-[1px] bg-gray-300" />
                  <div className="p-5">
                    <BasicInfoStep
                      formData={{
                        type: formData.type,
                        title: formData.title,
                        category: formData.category,
                        workMode: formData.workMode,
                        location: formData.location,
                        employmentType: formData.employmentType,
                      }}
                      updateFormData={updateFormData}
                      onNext={() => toggleSection("description")}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Description Section */}
            <div
              ref={(el) => {
                if (el) sectionRefs.current["description"] = el;
              }}
              className="border border-gray-300 rounded-[16px] overflow-hidden"
            >
              <button
                onClick={() => toggleSection("description")}
                className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-black text-[14px]">
                  Description
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedSection === "description" ? "rotate-180" : ""
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
              {expandedSection === "description" && (
                <>
                  <div className="h-[1px] bg-gray-300" />
                  <div className="p-5">
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
                  </div>
                </>
              )}
            </div>

            {/* Budget & Scope Section */}
            {!isVolunteer && (
              <div
                ref={(el) => {
                  if (el) sectionRefs.current["budget-scope"] = el;
                }}
                className="border border-gray-300 rounded-[16px] overflow-hidden"
              >
                <button
                  onClick={() => toggleSection("budget-scope")}
                  className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-black text-[14px]">
                    Budget & Scope
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedSection === "budget-scope" ? "rotate-180" : ""
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
                {expandedSection === "budget-scope" && (
                  <>
                    <div className="h-[1px] bg-gray-300" />
                    <div className="p-5">
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
                        onSubmit={() => toggleSection("application-settings")}
                      />
                    </div>
                  </>
                )}
              </div>
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
                        className="px-4 py-3 border border-gray-300 rounded-[10px] text-[14px] focus:outline-none focus:border-[#5C30FF]"
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
                        value={formData.closingDate}
                        onChange={(e) =>
                          updateFormData({ closingDate: e.target.value })
                        }
                        className="px-4 py-3 border border-gray-300 rounded-[10px] text-[14px] focus:outline-none focus:border-[#5C30FF]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={handleCloseModal}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to leave without saving?"
        footer={
          <>
            <Button variant="outline" onClick={handleCloseModal}>
              Keep Editing
            </Button>
            <Button variant="destructive" onClick={handleDiscard}>
              Discard Changes
            </Button>
          </>
        }
      />
    </div>
  );
}
