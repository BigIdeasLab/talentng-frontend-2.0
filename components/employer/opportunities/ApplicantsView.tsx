"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useApplications } from "@/hooks/useApplications";
import { useToast } from "@/hooks/use-toast";
import { ApplicantsTable } from "./ApplicantsTable";
import { ApplicantsHeader } from "./ApplicantsHeader";
import type { Application } from "@/lib/api/applications";

interface ApplicantsViewProps {
  opportunityId: string;
  applicationCount?: number;
  applicationCap?: number;
  closingDate?: string;
}

export function ApplicantsView({
  opportunityId,
  applicationCount = 0,
  applicationCap,
  closingDate,
}: ApplicantsViewProps) {
  const { toast } = useToast();
  const { getAll, isLoading, error } = useApplications();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [applicants, setApplicants] = useState<Application[]>([]);

  useEffect(() => {
    fetchApplicants();
  }, [opportunityId]);

  const fetchApplicants = async () => {
    try {
      const data = await getAll(opportunityId);
      setApplicants(data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load applicants";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setApplicants([]);
    }
  };

  const getProgressPercentage = () => {
    if (!applicationCap || applicationCap === 0) return 0;
    return Math.min((applicationCount / applicationCap) * 100, 100);
  };

  const getCapStatusText = () => {
    if (!applicationCap) return null;
    const remaining = Math.max(0, applicationCap - applicationCount);
    if (remaining === 0) return "Application cap reached";
    return `${remaining} spot${remaining !== 1 ? "s" : ""} remaining`;
  };

  const formatClosingDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isNearingCap =
    applicationCap && applicationCount >= applicationCap * 0.8;

  return (
    <div className="h-screen bg-white p-4 md:p-6 overflow-hidden flex flex-col">
      <div className="mx-auto w-full flex flex-col flex-shrink-0">
        {/* Back Button */}
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 mb-4 text-black/30 hover:text-black/50 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.78251 11.7826C9.71284 11.8525 9.63004 11.9079 9.53888 11.9458C9.44771 11.9837 9.34997 12.0031 9.25126 12.0031C9.15255 12.0031 9.05481 11.9837 8.96365 11.9458C8.87249 11.9079 8.78969 11.8525 8.72001 11.7826L5.72001 8.78255C5.65009 8.71287 5.59462 8.63008 5.55676 8.53891C5.51891 8.44775 5.49942 8.35001 5.49942 8.2513C5.49942 8.15259 5.51891 8.05485 5.55676 7.96369C5.59462 7.87252 5.65009 7.78973 5.72001 7.72005L8.72001 4.72005C8.86091 4.57915 9.05201 4.5 9.25126 4.5C9.45052 4.5 9.64162 4.57915 9.78251 4.72005C9.92341 4.86095 10.0026 5.05204 10.0026 5.2513C10.0026 5.45056 9.92341 5.64165 9.78251 5.78255L7.31439 8.25193L9.78439 10.7213C9.854 10.7911 9.90917 10.8739 9.94675 10.965C9.98434 11.0561 10.0036 11.1538 10.0034 11.2523C10.0032 11.3509 9.98364 11.4484 9.94574 11.5394C9.90784 11.6304 9.85237 11.713 9.78251 11.7826Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-inter-tight text-[13px] font-normal">
            Back to opportunities
          </span>
        </Link>

        {/* Page Title and Stats */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-inter-tight text-[21px] font-medium text-black">
            Applicants
          </h1>
          <div className="text-right">
            <p className="text-sm font-medium text-black">
              {applicationCount}{" "}
              {applicationCount === 1 ? "applicant" : "applicants"}
            </p>
            {getCapStatusText() && (
              <p
                className={`text-xs ${isNearingCap ? "text-orange-600" : "text-gray-500"}`}
              >
                {getCapStatusText()}
              </p>
            )}
          </div>
        </div>

        {/* Application Cap Progress */}
        {applicationCap && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Application Progress
              </span>
              <span className="text-xs text-gray-600">
                {applicationCount} of {applicationCap}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isNearingCap ? "bg-orange-500" : "bg-blue-500"
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Closing Date Info */}
        {closingDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-700">
              Closes on:{" "}
              <span className="font-semibold">
                {formatClosingDate(closingDate)}
              </span>
            </p>
          </div>
        )}

        {/* Search and Filters */}
        <ApplicantsHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Applicants Table */}
        <div className="mt-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading applicants...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <ApplicantsTable
              searchQuery={searchQuery}
              sortBy={sortBy}
              applicants={applicants}
            />
          )}
        </div>
      </div>
    </div>
  );
}
