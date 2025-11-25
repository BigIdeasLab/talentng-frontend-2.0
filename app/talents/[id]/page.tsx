import React from "react";
import LandingPageLayout from "@/components/layouts/LandingPageLayout";
import { Sparkles } from "lucide-react";

export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const talentData = {
    name: "Promise Olaifa",
    role: "Senior Product Designer",
    location: "Lagos,Nigeria 🇳🇬",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/62a092bd6bc517738cffbf8ef4fbcb6b9763da78?width=128",
    isOnline: true,
    isVerified: true,
    about:
      "Product Designer & Ux Consultant Product Designer Passionate about how people and technology can create a new and a better world",
    skills: [
      "Mentoring",
      "Giving resume feedback",
      "Conducting mock interviews",
      "Improving interview skills",
      "+4",
    ],
    pastWork: [
      {
        id: 1,
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/dfa102bc1401be52c2532282271f4c67ed19ebac?width=748",
        alt: "Cover image for Daylight Health Brand Identity & Web Design",
      },
      {
        id: 2,
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/208fe1f018432f447630ee8707b8263d38567cd3?width=748",
        alt: "Cover image for Wack•A•Doo Hot Sauce Branding & Packaging",
      },
      {
        id: 3,
        image:
          "https://api.builder.io/api/v1/image/assets/TEMP/2becd35ef0c9d177074c32cb91e5fa940f6a83b0?width=748",
        alt: "Cover image for Okrika Social Media",
      },
    ],
  };

  return (
    <LandingPageLayout>
      <div className="w-full flex flex-col items-center px-4 py-8 md:py-16 gap-8 md:gap-16">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[249px]">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar with Online Status */}
            <div className="relative">
              <img
                src={talentData.avatar}
                alt={talentData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {talentData.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-lg border-[2.682px] border-white bg-[#3AB266]" />
              )}
            </div>

            {/* Name and Role */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-black text-center font-geist text-2xl font-semibold leading-[120%]">
                  {talentData.name}
                </h1>
                {talentData.isVerified && (
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <g clipPath="url(#clip0_2193_2015)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9291 1.26064C13.7504 0.975024 13.4871 0.752243 13.1758 0.62331C12.8645 0.494377 12.5208 0.465707 12.1924 0.541291L9.86216 1.07659C9.62335 1.13148 9.37519 1.13148 9.13638 1.07659L6.8061 0.541291C6.47776 0.465707 6.13403 0.494377 5.82276 0.62331C5.51148 0.752243 5.24814 0.975024 5.0694 1.26064L3.79928 3.28778C3.66967 3.49516 3.49471 3.67014 3.28734 3.80105L1.26033 5.07125C0.975225 5.24985 0.752786 5.51277 0.623889 5.82354C0.494992 6.13431 0.466032 6.47749 0.541028 6.80547L1.07629 9.13849C1.13098 9.37691 1.13098 9.62461 1.07629 9.86303L0.541028 12.1948C0.46574 12.5229 0.494555 12.8664 0.623466 13.1774C0.752376 13.4885 0.974979 13.7516 1.26033 13.9303L3.28734 15.2005C3.49471 15.3301 3.66967 15.5051 3.80057 15.7124L5.0707 17.7396C5.43618 18.3241 6.13345 18.6132 6.8061 18.4589L9.13638 17.9236C9.37519 17.8687 9.62335 17.8687 9.86216 17.9236L12.1937 18.4589C12.5219 18.5342 12.8653 18.5054 13.1763 18.3765C13.4874 18.2476 13.7505 18.025 13.9291 17.7396L15.1993 15.7124C15.3289 15.5051 15.5038 15.3301 15.7112 15.2005L17.7395 13.9303C18.0249 13.7513 18.2474 13.4879 18.3761 13.1766C18.5047 12.8653 18.5332 12.5217 18.4575 12.1935L17.9235 9.86303C17.8687 9.6242 17.8687 9.37603 17.9235 9.1372L18.4588 6.80547C18.5342 6.47744 18.5056 6.13406 18.3769 5.82305C18.2483 5.51203 18.0259 5.24881 17.7408 5.06995L15.7125 3.79975C15.5054 3.6699 15.3304 3.49487 15.2006 3.28778L13.9291 1.26064ZM13.2772 6.60975C13.3574 6.46234 13.3773 6.28958 13.3326 6.12782C13.288 5.96606 13.1824 5.82791 13.038 5.74244C12.8936 5.65697 12.7217 5.63085 12.5584 5.66957C12.3952 5.70828 12.2533 5.80882 12.1626 5.95002L8.77349 11.6867L6.72704 9.72693C6.66633 9.66459 6.59368 9.61512 6.51344 9.58146C6.43319 9.5478 6.34699 9.53065 6.25998 9.53103C6.17296 9.53141 6.08691 9.54931 6.00696 9.58367C5.92702 9.61802 5.85481 9.66813 5.79464 9.731C5.73448 9.79387 5.68759 9.86821 5.65677 9.94959C5.62596 10.031 5.61185 10.1177 5.61529 10.2047C5.61872 10.2916 5.63964 10.377 5.67678 10.4557C5.71392 10.5344 5.76653 10.6048 5.83147 10.6627L8.46762 13.1889C8.53818 13.2564 8.62306 13.307 8.71594 13.3371C8.80881 13.3671 8.90728 13.3758 9.00398 13.3625C9.10068 13.3491 9.19312 13.3141 9.2744 13.2601C9.35568 13.206 9.42369 13.1342 9.47335 13.0502L13.2772 6.60975Z"
                        fill="#0095EC"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2193_2015">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0.5 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
              </div>
              <p className="text-gray-700 text-center font-geist text-base leading-[120%]">
                {talentData.role}
              </p>
              <p className="text-black text-center font-geist text-base leading-[120%]">
                {talentData.location}
              </p>
            </div>
          </div>

          {/* Send Invite Button */}
          <button className="w-full flex items-center justify-center gap-1 py-3.5 px-3.5 rounded-[44px] bg-black hover:bg-gray-900 transition-colors">
            <span className="text-white font-geist text-[13px] font-medium leading-[120%]">
              Send Invite
            </span>
            <Sparkles className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* About and Skills Section */}
        <div className="w-full max-w-[1216px] flex flex-col gap-11">
          {/* About Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-gray-800 font-geist text-xl font-medium leading-[120%]">
                About
              </h2>
              <p className="text-gray-500 font-geist text-xl leading-[160%]">
                {talentData.about}
              </p>
            </div>

            {/* Skilled at Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-gray-800 font-geist text-xl font-medium leading-[120%]">
                Skilled at
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {talentData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-center px-3 py-3 rounded-3xl border border-gray-200 ${
                      skill === "+4" ? "bg-gray-50" : ""
                    }`}
                  >
                    <span className="text-gray-950 font-geist text-base leading-[120%]">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Work Section */}
          <div className="flex flex-col gap-8">
            <h2 className="text-gray-800 font-geist text-xl font-medium leading-[120%]">
              Past Work
            </h2>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {talentData.pastWork.map((work) => (
                <div key={work.id} className="flex flex-col">
                  <img
                    src={work.image}
                    alt={work.alt}
                    className="w-full h-[280px] rounded-[32px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
}
