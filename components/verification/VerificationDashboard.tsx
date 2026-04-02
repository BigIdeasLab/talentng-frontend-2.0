"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { ApplicationForm } from "./ApplicationForm";
import { StatusTimeline } from "./StatusTimeline";
import {
  useVerificationStatus,
  useSubmitVerification,
  useResubmitVerification,
  useUploadDocument,
} from "@/hooks/useBusinessVerification";
import type {
  BusinessVerificationData,
  DocumentUploadResponse,
} from "@/lib/api/verification";
import { toast } from "sonner";

export function VerificationDashboard() {
  const router = useRouter();
  const { data: statusData, isLoading, error } = useVerificationStatus();
  const submitMutation = useSubmitVerification();
  const resubmitMutation = useResubmitVerification();
  const uploadMutation = useUploadDocument();

  const status = statusData?.status || "not_started";
  const application = statusData?.application;

  const handleSubmit = async (data: BusinessVerificationData) => {
    try {
      if (status === "rejected" && application?.id) {
        // Resubmission
        await resubmitMutation.mutateAsync({
          type: "business",
          ...data,
        });
        toast.success("Application resubmitted successfully!");
      } else {
        // New submission
        await submitMutation.mutateAsync({
          type: "business",
          ...data,
        });
        toast.success("Application submitted successfully!");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application",
      );
      throw error;
    }
  };

  const handleDocumentUpload = async (
    file: File,
  ): Promise<DocumentUploadResponse> => {
    try {
      const response = await uploadMutation.mutateAsync(file);
      return response;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document",
      );
      throw error;
    }
  };

  const handleBannerAction = () => {
    // Navigate to profile
    router.push("/profile");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[#5C30FF]" />
        <span className="ml-3 font-inter-tight text-[13px] text-black/60">
          Loading verification status...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-inter-tight text-[13px] font-medium text-red-800">
              Failed to load verification status
            </h3>
            <p className="font-inter-tight text-[12px] text-red-700 mt-1">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 font-inter-tight text-[12px] font-medium text-red-600 hover:text-red-700"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Form or Status */}
        <div className="lg:col-span-2">
          {(status === "not_started" || status === "rejected") && (
            <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 md:p-6">
              <h2 className="font-inter-tight text-[15px] font-semibold text-black mb-4">
                {status === "rejected"
                  ? "Resubmit Application"
                  : "Verification Application"}
              </h2>
              <ApplicationForm
                initialData={
                  status === "rejected" ? application?.data : undefined
                }
                onSubmit={handleSubmit}
                isSubmitting={
                  submitMutation.isPending || resubmitMutation.isPending
                }
              />
            </div>
          )}

          {status === "pending" && (
            <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 md:p-6">
              <h2 className="font-inter-tight text-[15px] font-semibold text-black mb-3">
                Application Under Review
              </h2>
              <p className="font-inter-tight text-[13px] text-black/60 mb-6">
                Your verification application is currently being reviewed by our
                team. This process typically takes 2-3 business days. We'll
                notify you once the review is complete.
              </p>

              {application?.data && (
                <div className="space-y-4">
                  <h3 className="font-inter-tight text-[13px] font-medium text-black">
                    Submitted Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-inter-tight text-[11px] text-black/50">
                        Business Name:
                      </span>
                      <p className="font-inter-tight text-[13px] font-medium text-black">
                        {application.data.businessName}
                      </p>
                    </div>
                    <div>
                      <span className="font-inter-tight text-[11px] text-black/50">
                        Registration Number:
                      </span>
                      <p className="font-inter-tight text-[13px] font-medium text-black">
                        {application.data.registrationNumber}
                      </p>
                    </div>
                    <div>
                      <span className="font-inter-tight text-[11px] text-black/50">
                        Business Type:
                      </span>
                      <p className="font-inter-tight text-[13px] font-medium text-black">
                        {application.data.businessType}
                      </p>
                    </div>
                    <div>
                      <span className="font-inter-tight text-[11px] text-black/50">
                        Phone Number:
                      </span>
                      <p className="font-inter-tight text-[13px] font-medium text-black">
                        {application.data.phoneNumber}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-inter-tight text-[11px] text-black/50">
                        Address:
                      </span>
                      <p className="font-inter-tight text-[13px] font-medium text-black">
                        {application.data.address}, {application.data.city},{" "}
                        {application.data.state}, {application.data.country}
                      </p>
                    </div>
                    {application.data.website && (
                      <div className="md:col-span-2">
                        <span className="font-inter-tight text-[11px] text-black/50">
                          Website:
                        </span>
                        <p className="font-inter-tight text-[13px] font-medium text-black">
                          <a
                            href={application.data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8463FF] hover:underline"
                          >
                            {application.data.website}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "approved" && (
            <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 md:p-6">
              <h2 className="font-inter-tight text-[15px] font-semibold text-black mb-3">
                Verification Complete
              </h2>
              <p className="font-inter-tight text-[13px] text-black/60 mb-6">
                Congratulations! Your business has been verified. Your verified
                badge is now displayed on your profile and all your opportunity
                listings.
              </p>

              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center px-6 py-3 bg-[#5C30FF] hover:bg-[#4a24d6] text-white rounded-lg font-inter-tight text-[13px] font-medium transition-colors"
              >
                View Profile
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 md:p-6 sticky top-6">
            <h3 className="font-inter-tight text-[14px] font-semibold text-black mb-4">
              Verification Status
            </h3>
            <StatusTimeline
              status={status}
              submittedAt={application?.submittedAt}
              reviewedAt={application?.reviewedAt}
              rejectionReason={application?.rejectionReason}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
