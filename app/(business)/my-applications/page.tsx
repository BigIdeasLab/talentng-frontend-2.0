"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, Users, Search, X, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks";
import { getApplicationsWithFilters } from "@/lib/api/applications/index";
import { getRequests } from "@/lib/api/mentorship";
import type { Application } from "@/lib/api/applications/types";
import type { MentorshipRequest } from "@/lib/api/mentorship/types";
import {
  JobApplicationCard,
  MentorshipRequestCard,
  MyApplicationsSkeleton,
} from "@/components/talent/applications";
import { EmptyState } from "@/components/ui/empty-state";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

type TabType = "jobs" | "mentorship";

const JOB_STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "applied", label: "Applied" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

const MENTORSHIP_STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
];

const JOB_STATUS_MAP: Record<string, string> = {
  invited: "applied",
  applied: "applied",
  shortlisted: "shortlisted",
  hired: "hired",
  rejected: "rejected",
};

export default function MyApplicationsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("jobs");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [mentorshipStatusFilter, setMentorshipStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getApplicationsWithFilters({});
      console.log(
        "[MyApplications] Full API response:",
        JSON.stringify(data, null, 2),
      );
      setJobApplications(data || []);
    } catch (error) {
      console.error("Failed to load job applications:", error);
      setJobApplications([]);
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchMentorshipRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getRequests({ role: "sent" });
      const data = Array.isArray(response) ? response : response?.data || [];
      setMentorshipRequests(data);
    } catch (error) {
      console.error("Failed to load mentorship requests:", error);
      setMentorshipRequests([]);
      toast({
        title: "Error",
        description: "Failed to load mentorship requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === "jobs") {
      fetchJobApplications();
    } else {
      fetchMentorshipRequests();
    }
  }, [activeTab, fetchJobApplications, fetchMentorshipRequests]);

  const filteredJobApplications = jobApplications.filter((app) => {
    const matchesStatus =
      jobStatusFilter === "all" ||
      (jobStatusFilter === "interview"
        ? app.status === "shortlisted" // Treat shortlisted as interview stage for talent
        : JOB_STATUS_MAP[app.status] === jobStatusFilter);
    const matchesSearch =
      searchQuery === "" ||
      app.opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.opportunity.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredMentorshipRequests = mentorshipRequests.filter((req) => {
    const matchesStatus =
      mentorshipStatusFilter === "all" || req.status === mentorshipStatusFilter;
    const matchesSearch =
      searchQuery === "" ||
      req.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.mentor.fullName || req.mentor.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusTabs =
    activeTab === "jobs" ? JOB_STATUS_TABS : MENTORSHIP_STATUS_TABS;
  const currentStatusFilter =
    activeTab === "jobs" ? jobStatusFilter : mentorshipStatusFilter;
  const setStatusFilter =
    activeTab === "jobs" ? setJobStatusFilter : setMentorshipStatusFilter;

  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
          My Applications
        </h1>

        {/* Top Tab Switch */}
        <div className="flex items-center gap-1 mb-[19px]">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-4 py-2 h-10 rounded-[8px] transition-colors ${
              activeTab === "jobs"
                ? "bg-[#5C30FF] text-white font-medium"
                : "text-[#525866] font-normal hover:text-black hover:bg-gray-50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-[13px] font-inter-tight">
              Job Applications
            </span>
          </button>
          <button
            onClick={() => setActiveTab("mentorship")}
            className={`flex items-center gap-2 px-4 py-2 h-10 rounded-[8px] transition-colors ${
              activeTab === "mentorship"
                ? "bg-[#5C30FF] text-white font-medium"
                : "text-[#525866] font-normal hover:text-black hover:bg-gray-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[13px] font-inter-tight">
              Mentorship Requests
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
            <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "jobs" ? "jobs" : "mentorship requests"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex-shrink-0 text-[#B2B2B2] hover:text-black transition-colors"
              >
                <X className="w-[15px] h-[15px]" />
              </button>
            )}
          </div>

          <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] flex-shrink-0 hover:bg-gray-100 transition-colors">
            <SlidersHorizontal className="w-[15px] h-[15px] text-black" />
            <span className="text-[13px] font-normal text-black font-inter-tight">
              Filter
            </span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
                currentStatusFilter === tab.id
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              <span className="text-[13px] font-inter-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <MyApplicationsSkeleton type={activeTab} />
          ) : activeTab === "jobs" ? (
            filteredJobApplications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No job applications yet"
                description="Start applying to jobs to see your applications here"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
                {filteredJobApplications.map((application) => (
                  <JobApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            )
          ) : filteredMentorshipRequests.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No mentorship requests yet"
              description="Find mentors and send request to see them here"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
              {filteredMentorshipRequests.map((request) => (
                <MentorshipRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
