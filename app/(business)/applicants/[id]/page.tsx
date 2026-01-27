"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { useToast } from "@/hooks";
import { ScheduleInterviewModal } from "@/components/employer/applicants/ScheduleInterviewModal";
import { DeclineApplicationModal } from "@/components/employer/applicants/DeclineApplicationModal";
import { HireApplicationModal } from "@/components/employer/applicants/HireApplicationModal";
import { RescheduleInterviewModal } from "@/components/employer/applicants/RescheduleInterviewModal";
import { CancelInterviewModal } from "@/components/employer/applicants/CancelInterviewModal";
import { ApplicantDetailSkeleton } from "@/components/skeletons/ApplicantDetailSkeleton";
import { useApplications } from "@/hooks/useApplications";
import apiClient from "@/lib/api";
import {
  rescheduleInterview,
  cancelInterview,
  completeInterview,
} from "@/lib/api/applications";
import type { Application, ApplicationInterview } from "@/lib/api/applications";

const statusDisplayMap = {
  applied: { label: "In Review", bg: "#DBE9FE", text: "#5C30FF" },
  shortlisted: { label: "Shortlisted", bg: "#FEF3C7", text: "#92400D" },
  rejected: { label: "Rejected", bg: "#FEE2E1", text: "#991B1B" },
  hired: { label: "Hired", bg: "#D1FAE5", text: "#076046" },
};

export default function ApplicantProposalPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  const hasAccess = useRequireRole(["recruiter"]);

  const [applicant, setApplicant] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<ApplicationInterview | null>(null);
  const { getById, isLoading, updateStatus } = useApplications();
  const { toast } = useToast();

  useEffect(() => {
    if (!hasAccess) return;
    fetchApplicant();
  }, [hasAccess, applicationId, getById]);

  const fetchApplicant = async () => {
    try {
      setError(null);
      const data = await getById(applicationId);
      setApplicant(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load applicant";
      setError(message);
      console.error("Error fetching applicant:", err);
    }
  };

  const handleHireApplicant = async (
    applicationId: string,
    _message: string,
  ) => {
    try {
      await updateStatus(applicationId, "hired");
      toast({
        title: "Success",
        description: "Talent has been hired successfully",
        variant: "default",
      });
      router.push("/applicants");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to hire talent";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleDeclineApplicant = async (
    applicationId: string,
    _note: string,
  ) => {
    try {
      await updateStatus(applicationId, "rejected");
      toast({
        title: "Success",
        description: "Application has been declined",
        variant: "default",
      });
      router.push("/applicants");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to decline application";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleScheduleInterview = async (
    applicationId: string,
    scheduledDate: string,
    message: string,
    meetingLink?: string,
  ) => {
    try {
      // Call the schedule interview endpoint
      const response = await apiClient<Application>(
        `/applications/${applicationId}/schedule-interview`,
        {
          method: "POST",
          body: {
            scheduledDate,
            message,
            meetingLink,
          },
        },
      );

      // Update the applicant state with the response
      if (response) {
        setApplicant(response);
      }

      toast({
        title: "Success",
        description: "Interview has been scheduled",
        variant: "default",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to schedule interview";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleRescheduleInterview = async (
    applicationId: string,
    interviewId: string,
    scheduledDate: string,
    message: string,
    meetingLink?: string,
  ) => {
    try {
      const response = await rescheduleInterview(
        applicationId,
        interviewId,
        scheduledDate,
        message,
        meetingLink,
      );

      setApplicant(response);
      toast({
        title: "Success",
        description: "Interview has been rescheduled",
        variant: "default",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reschedule interview";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleCancelInterview = async (
    applicationId: string,
    interviewId: string,
    reason: string,
  ) => {
    try {
      const response = await cancelInterview(
        applicationId,
        interviewId,
        reason,
      );

      setApplicant(response);
      toast({
        title: "Success",
        description: "Interview has been cancelled and talent notified",
        variant: "default",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel interview";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleCompleteInterview = async (
    applicationId: string,
    interviewId: string,
  ) => {
    try {
      const response = await completeInterview(applicationId, interviewId);

      setApplicant(response);
      toast({
        title: "Success",
        description: "Interview marked as completed",
        variant: "default",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to complete interview";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  if (isLoading) {
    return <ApplicantDetailSkeleton />;
  }

  if (error || !applicant) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || "Applicant not found"}</p>
          <Link
            href="/applicants"
            className="px-4 py-2 bg-[#5C30FF] text-white rounded-lg hover:bg-[#4a26cc]"
          >
            Back to Applicants
          </Link>
        </div>
      </div>
    );
  }

  const projects = applicant.user.talentProfile.gallery || [];
  const statusDisplay = statusDisplayMap[applicant.status];

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-[16px] md:px-[40px] py-[24px]">
        <div className="max-w-full flex flex-col gap-[25px]">
          {/* Back Button */}
          <Link
            href="/applicants"
            className="flex items-center gap-[8px] text-black/30 hover:text-black/50 transition-colors w-fit"
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
            <span className="font-inter-tight text-[13px] font-normal leading-normal">
              Back to Applicants
            </span>
          </Link>

          {/* Profile Card */}
          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-[18px] p-[18px] rounded-[10px] border border-[#E1E4EA] bg-white">
              {/* Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-[10px]">
                  <img
                    src={applicant.user.talentProfile.profileImageUrl}
                    alt={applicant.user.talentProfile.fullName}
                    className="w-[59px] h-[59px] rounded-full object-cover"
                  />
                  <div className="flex flex-col justify-center gap-[10px]">
                    <div className="flex flex-col gap-[10px]">
                      <h1 className="font-inter-tight text-[20px] font-bold text-black leading-normal">
                        {applicant.user.talentProfile.fullName}
                      </h1>
                      <p className="font-inter-tight text-[13px] font-normal text-[#525866] leading-normal">
                        {applicant.user.talentProfile.headline}
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-center w-fit px-[20px] h-[18px] rounded-[50px]"
                      style={{
                        backgroundColor: statusDisplay.bg,
                      }}
                    >
                      <span
                        className="font-inter-tight text-[12px] font-semibold text-center leading-normal"
                        style={{ color: statusDisplay.text }}
                      >
                        {statusDisplay.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex items-center justify-between py-[18px] pr-[18px] border-t border-b border-[#E1E4EA]">
                {/* Hires */}
                <div className="flex items-center gap-[6px]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 4.375H2.5C1.80964 4.375 1.25 4.93464 1.25 5.625V11.875C1.25 12.5654 1.80964 13.125 2.5 13.125H12.5C13.1904 13.125 13.75 12.5654 13.75 11.875V5.625C13.75 4.93464 13.1904 4.375 12.5 4.375Z"
                      stroke="#5C30FF"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 13.125V3.125C10 2.79348 9.8683 2.47554 9.63388 2.24112C9.39946 2.0067 9.08152 1.875 8.75 1.875H6.25C5.91848 1.875 5.60054 2.0067 5.36612 2.24112C5.1317 2.47554 5 2.79348 5 3.125V13.125"
                      stroke="#5C30FF"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-inter-tight text-[12px] font-normal text-black leading-normal">
                    <span className="text-[#606060] text-[12px]">Hires:</span>{" "}
                    {applicant.user.talentProfile.hiredCount}x
                  </span>
                </div>

                {/* Earned */}
                <div className="flex items-center gap-[6px]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.75 7.5C13.75 10.9517 10.9517 13.75 7.5 13.75C4.04822 13.75 1.25 10.9517 1.25 7.5C1.25 4.04822 4.04822 1.25 7.5 1.25C10.9517 1.25 13.75 4.04822 13.75 7.5Z"
                      stroke="#008B47"
                      strokeWidth="1.375"
                    />
                    <path
                      d="M9.19338 6.28843C9.13145 5.81177 8.58413 5.04163 7.60001 5.04161C6.45651 5.04159 5.97536 5.6749 5.87773 5.99156C5.72542 6.41512 5.75588 7.28593 7.0962 7.38087C8.77163 7.49962 9.44282 7.69737 9.35745 8.72274C9.27201 9.74805 8.33807 9.96962 7.60001 9.9458C6.86188 9.92212 5.65428 9.58305 5.60742 8.67105M7.48288 4.37402V5.04388M7.48288 9.93968V10.624"
                      stroke="#008B47"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="font-inter-tight text-[12px] font-normal text-black leading-normal">
                    <span className="text-[#606060] text-[12px]">Earned:</span>{" "}
                    ₦
                    {Number(
                      applicant.user.talentProfile.earnings || "0",
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-[6px]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51106 13.3544C8.24006 13.6081 7.87775 13.75 7.50069 13.75C7.12362 13.75 6.76138 13.6081 6.49031 13.3544C4.00814 11.0163 0.681725 8.40431 2.30392 4.61229C3.18102 2.56198 5.28646 1.25 7.50069 1.25C9.71494 1.25 11.8204 2.56198 12.6975 4.61229C14.3176 8.39956 10.9994 11.0243 8.51106 13.3544Z"
                      stroke="#525866"
                      strokeWidth="1.375"
                    />
                    <path
                      d="M9.6875 6.875C9.6875 8.08312 8.70812 9.0625 7.5 9.0625C6.29188 9.0625 5.3125 8.08312 5.3125 6.875C5.3125 5.66688 6.29188 4.6875 7.5 4.6875C8.70812 4.6875 9.6875 5.66688 9.6875 6.875Z"
                      stroke="#525866"
                      strokeWidth="1.375"
                    />
                  </svg>
                  <span className="font-inter-tight text-[12px] font-normal text-black leading-normal">
                    {applicant.user.talentProfile.location}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-[6px]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.875 2.5H3.125C2.43464 2.5 1.875 3.05964 1.875 3.75V12.5C1.875 13.1904 2.43464 13.75 3.125 13.75H11.875C12.5654 13.75 13.125 13.1904 13.125 12.5V3.75C13.125 3.05964 12.5654 2.5 11.875 2.5Z"
                      stroke="#525866"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 1.25V3.75"
                      stroke="#525866"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 1.25V3.75"
                      stroke="#525866"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.875 6.25H13.125"
                      stroke="#525866"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-inter-tight text-[12px] font-normal text-black leading-normal">
                    {new Date(applicant.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Applied For Section */}
            <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
              <h2 className="font-inter-tight text-[15px] font-semibold text-black leading-normal">
                Applied For
              </h2>
              <div className="flex flex-col gap-[10px] p-[18px_12px_24px_12px] rounded-[8px] border border-[#E1E4EA] bg-[#F5F5F5]">
                <h3 className="font-inter-tight text-[15px] font-normal text-black leading-[18px]">
                  {applicant.opportunity.title}
                </h3>
                <p className="font-inter-tight text-[13px] font-normal text-[#606060] leading-[18px]">
                  {applicant.opportunity.company} • {applicant.opportunity.type}
                </p>

                {/* Interview Preview - Show meeting link if exists */}
                {applicant.interviews &&
                  applicant.interviews.length > 0 &&
                  applicant.interviews[0].meetingLink && (
                    <div className="pt-[8px] border-t border-[#E1E4EA]">
                      {applicant.interviews[0].status === "completed" ? (
                        <button
                          disabled
                          className="inline-flex items-center gap-[6px] px-3 py-2 rounded-[8px] bg-[#D1FAE5] text-[#076046] text-[12px] font-medium cursor-not-allowed"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Meeting Completed
                        </button>
                      ) : (
                        <a
                          href={applicant.interviews[0].meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-[6px] px-3 py-2 rounded-[8px] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors text-white text-[12px] font-medium"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Join Meeting
                        </a>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Interview Information Section */}
            {applicant.interviews && applicant.interviews.length > 0 ? (
              <>
                {applicant.interviews.map((interview, index) => (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-inter-tight text-[15px] font-semibold text-black leading-normal">
                        Interview Details{" "}
                        {applicant.interviews &&
                          applicant.interviews.length > 1 &&
                          `(${index + 1})`}
                      </h2>
                      <div
                        className="flex items-center justify-center px-[12px] h-[18px] rounded-[50px]"
                        style={{
                          backgroundColor:
                            interview.status === "scheduled"
                              ? "#FEF3C7"
                              : interview.status === "completed"
                                ? "#D1FAE5"
                                : interview.status === "cancelled"
                                  ? "#FEE2E1"
                                  : "#DBE9FE",
                          color:
                            interview.status === "scheduled"
                              ? "#92400D"
                              : interview.status === "completed"
                                ? "#076046"
                                : interview.status === "cancelled"
                                  ? "#991B1B"
                                  : "#5C30FF",
                        }}
                      >
                        <span className="font-inter-tight text-[11px] font-semibold leading-normal capitalize">
                          {interview.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[16px]">
                      {/* Interview Date and Time */}
                      <div className="flex items-start gap-[12px] p-[12px] rounded-[8px] bg-[#F5F5F5] border border-[#E1E4EA]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-0.5 flex-shrink-0"
                        >
                          <path
                            d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z"
                            stroke="#525866"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.666 1.33301V3.99967"
                            stroke="#525866"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.33398 1.33301V3.99967"
                            stroke="#525866"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 6.66699H14"
                            stroke="#525866"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex flex-col gap-[4px]">
                          <p className="font-inter-tight text-[12px] font-medium text-[#525866]">
                            Scheduled Date & Time
                          </p>
                          <p className="font-inter-tight text-[14px] font-semibold text-black">
                            {new Date(
                              interview.scheduledDate,
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(
                              interview.scheduledDate,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Interview Meeting Link */}
                      {interview.meetingLink && (
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-inter-tight text-[12px] font-medium text-[#525866]">
                            Meeting Link
                          </p>
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-[6px] px-3 py-2 rounded-[8px] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors text-white text-[12px] font-medium w-fit"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Join Meeting
                          </a>
                        </div>
                      )}

                      {/* Interview Message/Instructions */}
                      {interview.message && (
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-inter-tight text-[12px] font-medium text-[#525866]">
                            Message / Instructions
                          </p>
                          <div className="p-[12px] rounded-[8px] bg-[#F5F5F5] border border-[#E1E4EA]">
                            <p className="font-inter-tight text-[13px] font-normal text-black leading-[19px] whitespace-pre-line">
                              {interview.message}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reschedule / Cancel Interview Buttons */}
                    {(interview.status === "scheduled" ||
                      interview.status === "rescheduled") && (
                      <div className="flex items-center gap-[10px] pt-[8px]">
                        <button
                          onClick={() => {
                            setSelectedInterview(interview);
                            setIsRescheduleModalOpen(true);
                          }}
                          className="flex items-center gap-1 h-8 px-[14px] py-[12px] rounded-[8px] border border-[#E6E7EA] bg-white hover:bg-gray-50 transition-colors text-[12px] font-medium text-black"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z"
                              stroke="black"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.666 1.33301V3.99967"
                              stroke="black"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.33398 1.33301V3.99967"
                              stroke="black"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 6.66699H14"
                              stroke="black"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Reschedule
                        </button>
                        {(() => {
                          // Check if meeting time + 10 min has passed
                          const scheduledTime = new Date(
                            interview.scheduledDate,
                          ).getTime();
                          const tenMinutesAfter =
                            scheduledTime + 10 * 60 * 1000;
                          const isTimeToComplete =
                            new Date().getTime() > tenMinutesAfter;

                          return isTimeToComplete ? (
                            <button
                              onClick={() =>
                                handleCompleteInterview(
                                  applicant.id,
                                  interview.id,
                                )
                              }
                              className="flex items-center justify-center gap-1 h-8 px-3 py-[12px] rounded-[8px] border border-[#008B47] bg-[#D1FAE5] hover:bg-[#A7F3D0] transition-colors text-[12px] font-medium text-[#008B47]"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                                  stroke="#008B47"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12.75 7.5L8.25 12L6 9.75"
                                  stroke="#008B47"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Completed
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedInterview(interview);
                                setIsCancelModalOpen(true);
                              }}
                              className="flex items-center justify-center gap-1 h-8 px-3 py-[12px] rounded-[8px] border border-[#E6E7EA] bg-white hover:bg-gray-50 transition-colors text-[12px] font-medium text-[#EE4142]"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                                  stroke="#EE4142"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11.25 6.75L6.75 11.25"
                                  stroke="#EE4142"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M6.75 6.75L11.25 11.25"
                                  stroke="#EE4142"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Cancel
                            </button>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : null}

            {/* Proposal Section */}
            <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
              <h2 className="font-inter-tight text-[15px] font-semibold text-black leading-normal">
                Proposal
              </h2>
              <div className="p-[18px_12px] rounded-[8px] border border-[#E1E4EA] bg-[#F5F5F5]">
                <p className="font-inter-tight text-[13px] font-normal text-black leading-[19px] whitespace-pre-line">
                  {applicant.note || "No proposal provided"}
                </p>
              </div>
            </div>

            {/* Attached Projects Section */}
            {projects.length > 0 && (
              <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
                <h2 className="font-inter-tight text-[15px] font-semibold text-black leading-normal">
                  Attach Projects ({projects.length})
                </h2>
                <div className="flex items-center gap-[4px]">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="w-[210px] h-[160px] flex-shrink-0"
                    >
                      <img
                        src={project.url}
                        alt={project.title || `Project ${index + 1}`}
                        className="w-full h-full rounded-[12px] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex flex-col gap-[18px] p-[18px] pt-[23px] rounded-[10px] border border-[#E1E4EA] bg-white">
              <h2 className="font-inter-tight text-[15px] font-semibold text-black leading-normal">
                Actions
              </h2>
              <div className="flex items-center gap-[10px]">
                {/* Hire Talent Button */}
                <button
                  onClick={() => setIsHireModalOpen(true)}
                  disabled={applicant.status === "hired"}
                  className="flex items-center gap-[5px] h-8 px-3 rounded-[8px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a26cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2218_39850)">
                      <path
                        d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.5 3L9 10.5075L6.75 8.2575"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2218_39850">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="font-inter-tight text-[12px] font-medium text-white text-center leading-normal">
                    Hire Talent
                  </span>
                </button>

                {/* Schedule Interview Button */}
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="flex items-center gap-1 h-8 px-[14px_20px_14px_14px] py-[12px] rounded-[8px] border border-[#E6E7EA] bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.666 1.33301V3.99967"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33398 1.33301V3.99967"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 6.66699H14"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-inter-tight text-[12px] font-medium text-black text-center leading-normal">
                    Schedule Interview
                  </span>
                </button>

                {/* Decline Button */}
                <button
                  onClick={() => setIsDeclineModalOpen(true)}
                  className="flex items-center justify-center gap-1 h-8 px-3 py-[12px] rounded-[8px] border border-[#E6E7EA] bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                      stroke="#EE4142"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.25 6.75L6.75 11.25"
                      stroke="#EE4142"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.75 6.75L11.25 11.25"
                      stroke="#EE4142"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-inter-tight text-[12px] font-medium text-[#EE4142] text-center leading-normal">
                    Decline
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {applicant && (
        <>
          <ScheduleInterviewModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            applicantName={applicant.user.talentProfile.fullName}
            jobTitle={applicant.opportunity.title}
            companyName={applicant.opportunity.company}
            applicationId={applicant.id}
            onSchedule={handleScheduleInterview}
          />

          <DeclineApplicationModal
            isOpen={isDeclineModalOpen}
            onClose={() => setIsDeclineModalOpen(false)}
            applicantName={applicant.user.talentProfile.fullName}
            jobTitle={applicant.opportunity.title}
            companyName={applicant.opportunity.company}
            applicationId={applicant.id}
            onDecline={handleDeclineApplicant}
          />

          <HireApplicationModal
            isOpen={isHireModalOpen}
            onClose={() => setIsHireModalOpen(false)}
            applicantName={applicant.user.talentProfile.fullName}
            jobTitle={applicant.opportunity.title}
            companyName={applicant.opportunity.company}
            applicationId={applicant.id}
            onHire={handleHireApplicant}
          />

          {selectedInterview && (
            <>
              <RescheduleInterviewModal
                isOpen={isRescheduleModalOpen}
                onClose={() => {
                  setIsRescheduleModalOpen(false);
                  setSelectedInterview(null);
                }}
                applicantName={applicant.user.talentProfile.fullName}
                jobTitle={applicant.opportunity.title}
                companyName={applicant.opportunity.company}
                interview={selectedInterview}
                applicationId={applicant.id}
                onReschedule={handleRescheduleInterview}
              />

              <CancelInterviewModal
                isOpen={isCancelModalOpen}
                onClose={() => {
                  setIsCancelModalOpen(false);
                  setSelectedInterview(null);
                }}
                applicantName={applicant.user.talentProfile.fullName}
                jobTitle={applicant.opportunity.title}
                interview={selectedInterview}
                applicationId={applicant.id}
                onCancel={handleCancelInterview}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
