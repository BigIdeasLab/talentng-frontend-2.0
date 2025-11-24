"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Share2, Briefcase, Building, Search } from "lucide-react";
import {
  getOpportunities,
  getMentors,
  getLearningResources,
  getTalents,
} from "@/lib/api";
import { OpportunitiesList } from "@/components/landing-page/OpportunitiesList";
import { OutstandingMentors } from "@/components/landing-page/OutstandingMentors";
import RecommendedLearningPaths from "@/components/learning/RecommendedLearningPaths";
import { Opportunity } from "@/lib/types/opportunity";
import { Mentor } from "@/lib/types/mentor";
import { LearningResource } from "@/lib/types/learning";
import { Talent } from "@/lib/types/talent";
import TalentCard from "@/components/TalentCard";

const VerificationBadge = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.4291 0.760641C13.2504 0.475024 12.9871 0.252243 12.6758 0.12331C12.3645 -0.00562305 12.0208 -0.0342933 11.6924 0.0412909L9.36216 0.576591C9.12335 0.631484 8.87519 0.631484 8.63638 0.576591L6.3061 0.0412909C5.97776 -0.0342933 5.63403 -0.00562305 5.32276 0.12331C5.01148 0.252243 4.74814 0.475024 4.5694 0.760641L3.29928 2.78778C3.16967 2.99516 2.99471 3.17014 2.78734 3.30105L0.760332 4.57125C0.475225 4.74985 0.252786 5.01277 0.123889 5.32354C-0.00500796 5.63431 -0.0339682 5.97749 0.0410279 6.30547L0.576293 8.63849C0.630984 8.87691 0.630984 9.12461 0.576293 9.36303L0.0410279 11.6948C-0.0342597 12.0229 -0.00544518 12.3664 0.123466 12.6774C0.252376 12.9885 0.474979 13.2516 0.760332 13.4303L2.78734 14.7005C2.99471 14.8301 3.16967 15.0051 3.30057 15.2124L4.5707 17.2396C4.93618 17.8241 5.63345 18.1132 6.3061 17.9589L8.63638 17.4236C8.87519 17.3687 9.12335 17.3687 9.36216 17.4236L11.6937 17.9589C12.0219 18.0342 12.3653 18.0054 12.6763 17.8765C12.9874 17.7476 13.2505 17.525 13.4291 17.2396L14.6993 15.2124C14.8289 15.0051 15.0038 14.8301 15.2112 14.7005L17.2395 13.4303C17.5249 13.2513 17.7474 12.9879 17.8761 12.6766C18.0047 12.3653 18.0332 12.0217 17.9575 11.6935L17.4235 9.36303C17.3687 9.1242 17.3687 8.87603 17.4235 8.6372L17.9588 6.30547C18.0342 5.97744 18.0056 5.63406 17.8769 5.32305C17.7483 5.01203 17.5259 4.74881 17.2408 4.56995L15.2125 3.29975C15.0054 3.1699 14.8304 2.99487 14.7006 2.78778L13.4291 0.760641ZM12.7772 6.10975C12.8574 5.96234 12.8773 5.78958 12.8326 5.62782C12.788 5.46606 12.6824 5.32791 12.538 5.24244C12.3936 5.15697 12.2217 5.13085 12.0584 5.16957C11.8952 5.20828 11.7533 5.30882 11.6626 5.45002L8.27349 11.1867L6.22704 9.22693C6.16633 9.16459 6.09368 9.11512 6.01344 9.08146C5.93319 9.0478 5.84699 9.03065 5.75998 9.03103C5.67296 9.03141 5.58691 9.04931 5.50696 9.08367C5.42702 9.11802 5.35481 9.16813 5.29464 9.231C5.23448 9.29387 5.18759 9.36821 5.15677 9.44959C5.12596 9.53098 5.11185 9.61773 5.11529 9.70469C5.11872 9.79164 5.13964 9.87701 5.17678 9.94454C5.21392 10.0221 5.2664 10.091 5.33091 10.1471L7.82339 12.051C7.9716 12.156 8.14836 12.2134 8.33049 12.2134C8.51262 12.2134 8.68938 12.156 8.83759 12.051L12.7772 9.24434C12.8574 9.09693 12.8773 8.92417 12.8326 8.76241C12.788 8.60065 12.6824 8.4625 12.538 8.37703C12.3936 8.29156 12.2217 8.26544 12.0584 8.30416C11.8952 8.34287 11.7533 8.44341 11.6626 8.58461L8.33049 11.1867L6.88984 9.80163L8.33049 7.46863L12.7772 6.10975Z"
      fill="#0095EC"
    />
  </svg>
);

const Showcase = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [learningResources, setLearningResources] = useState<
    LearningResource[]
  >([]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const opportunitiesData = await getOpportunities({});
        setOpportunities(opportunitiesData);
        const mentorsData = await getMentors("");
        setMentors(mentorsData);
        const learningResourcesData = await getLearningResources({});
        setLearningResources(learningResourcesData);
        const talentsData = await getTalents({});
        setTalents(talentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-11 py-8 md:py-12 px-4">
      <div className="w-full max-w-[1216px] flex flex-col items-start gap-8">
        <button className="flex px-3 py-3 justify-center items-center gap-1 rounded-3xl border border-gray-300 bg-black hover:bg-gray-900 transition-colors">
          <span className="text-white text-center font-geist text-xl leading-[120%]">
            Featured
          </span>
          <ChevronDown className="w-6 h-6 text-white" />
        </button>

        <div className="w-full flex flex-col items-start gap-8 md:gap-11">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h2 className="text-2xl font-medium text-gray-800 font-geist">
                  Outstanding Talents
                </h2>
                <div className="flex items-center justify-between">
                  <p className="text-base text-gray-500 font-geist">
                    Standout talents making waves around the web
                  </p>
                  <a
                    href="/talent/opportunities"
                    className="text-base text-gray-600 underline font-geist hover:text-gray-800 transition-colors"
                  >
                    View more
                  </a>
                </div>
              </div>
              <OpportunitiesList
                initialOpportunities={opportunities}
                limit={3}
                isLoading={loading}
              />
            </div>

            <OutstandingMentors initialMentors={mentors} isLoading={loading} />

            <RecommendedLearningPaths
              resources={learningResources}
              loading={loading}
              error={null}
            />
          </div>

          {/* <div className="w-full flex flex-col items-start gap-6">
            <div className="w-full flex flex-col items-start gap-2.5">
              <h2 className="text-gray-900 font-geist text-2xl font-medium leading-[120%]">
                Find Talents
              </h2>
              <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <p className="text-gray-500 font-geist text-base leading-[120%]">
                  Standout talents making waves around the web
                </p>
                <a
                  href="#"
                  className="text-gray-600 font-geist text-base font-medium leading-[120%] underline hover:text-gray-800"
                >
                  View more
                </a>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {talents.map((talent) => (
                <Link
                  key={talent.id}
                  href={`/talents/${talent.id}`}>
                  <TalentCard
                    coverImage={talent.coverImageUrl || "/placeholder.svg"}
                    coverAlt={talent.headline || "Talent work"}
                    profileImage={talent.profileImageUrl || "/placeholder.svg"}
                    name={talent.fullName || "Talent"}
                    isOnline={talent.availability === "available"}
                    isVerified={talent.user.isVerified}
                  />
                </Link>
              ))}
            </div>
          </div> */}
        </div>

        <button className="flex py-3.5 px-3.5 justify-center items-center gap-2.5 rounded-3xl border border-gray-300 hover:bg-gray-50 transition-colors">
          <span className="text-black text-center font-inter text-xl font-medium leading-[120%]">
            Explore more
          </span>
          <Search className="w-6 h-6 text-[#09244B]" />
        </button>
      </div>
    </div>
  );
};

export default Showcase;
