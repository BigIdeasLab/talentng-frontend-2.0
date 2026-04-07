import Link from "next/link";
import type { OpportunityPublicData } from "@/lib/mock-data/opportunities-detail";
import { TYPE_CONFIG } from "@/lib/types/opportunities";

export interface OpportunityDetailPublicProps {
  data: OpportunityPublicData;
}

export function OpportunityDetailPublic({ data }: OpportunityDetailPublicProps) {
  const config = TYPE_CONFIG[data.type] || TYPE_CONFIG["FullTime"];

  const isVolunteer = data.type?.toLowerCase() === "volunteer";

  const getPaymentTypeAbbr = (paymentType?: string): string => {
    if (!paymentType) return "mo";
    const type = paymentType.toLowerCase();
    if (type === "hourly") return "hr";
    if (type === "weekly") return "wk";
    return "mo";
  };

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: data.title,
    description: data.description,
    datePosted: data.createdAt,
    hiringOrganization: {
      "@type": "Organization",
      name: data.company,
      logo: data.companyLogo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: data.location,
      },
    },
    employmentType: data.type,
    experienceRequirements: {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: data.experienceLevel === "Senior" ? 60 : data.experienceLevel === "Mid-Level" ? 24 : 0,
    },
    skills: data.skills?.join(", "),
    baseSalary:
      data.priceMode === "fixed"
        ? {
            "@type": "MonetaryAmount",
            currency: "NGN",
            value: {
              "@type": "QuantitativeValue",
              value: data.price,
              unitText: data.paymentType === "hourly" ? "HOUR" : data.paymentType === "weekly" ? "WEEK" : "MONTH",
            },
          }
        : {
            "@type": "MonetaryAmount",
            currency: "NGN",
            value: {
              "@type": "QuantitativeValue",
              minValue: data.minBudget,
              maxValue: data.maxBudget,
              unitText: data.paymentType === "hourly" ? "HOUR" : data.paymentType === "weekly" ? "WEEK" : "MONTH",
            },
          },
  };

  return (
    <div className="bg-white pb-24 lg:pb-0">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-5 lg:gap-2">
          {/* Left Column - Opportunity Details */}
          <div className="flex flex-col gap-9 order-2 lg:order-1">
            {/* Job Header */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {/* Company Logo */}
                {data.companyLogo ? (
                  <div className="w-[75px] h-[75px] rounded-full overflow-hidden">
                    <img
                      src={data.companyLogo}
                      alt={data.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-[75px] h-[75px] rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: data.companyLogoBg }}
                  >
                    {data.companyInitials}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <h1 className="font-inter-tight text-[17px] font-medium text-black leading-5">
                    {data.title}
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter-tight text-[15px] font-normal text-black/30">
                      {data.company}
                    </span>
                    <span className="font-inter-tight text-[15px] font-normal text-black/30">
                      •
                    </span>
                    <span className="font-inter-tight text-[15px] font-normal text-black/30">
                      {data.createdAt}
                    </span>
                  </div>
                </div>

                {/* Type Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg w-fit"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: config.dotColor }}
                  />
                  <span
                    className="font-inter-tight text-[12px] font-normal"
                    style={{ color: config.textColor }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {data.skills && data.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: "#5C30FF1A",
                        border: "1px solid #5C30FF",
                      }}
                    >
                      <span
                        className="font-inter-tight text-[12px] font-medium"
                        style={{ color: "#5C30FF" }}
                      >
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About the Role */}
            {data.description && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  About the Role
                </h3>
                <p className="font-inter-tight text-[13px] font-normal text-black leading-[165%]">
                  {data.description}
                </p>
              </div>
            )}

            {/* Key Responsibilities */}
            {data.keyResponsibilities && data.keyResponsibilities.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  Key Responsibilities
                </h3>
                <div className="flex flex-col gap-2">
                  {data.keyResponsibilities.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[14px] flex-shrink-0 pt-0.5 text-[#5C30FF]">
                        •
                      </span>
                      <span className="font-inter-tight text-[13px] font-normal text-black leading-[165%]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {data.requirements && data.requirements.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  Requirements
                </h3>
                <div className="flex flex-col gap-2">
                  {data.requirements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[14px] flex-shrink-0 pt-0.5 text-[#5C30FF]">
                        •
                      </span>
                      <span className="font-inter-tight text-[13px] font-normal text-black leading-[165%]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Needed */}
            {data.tools && data.tools.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-inter-tight text-[15px] font-medium text-black leading-[105%]">
                  Tools Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: "#5C30FF1A",
                        border: "1px solid #5C30FF",
                      }}
                    >
                      <span
                        className="font-inter-tight text-[12px] font-medium"
                        style={{ color: "#5C30FF" }}
                      >
                        {tool}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary Card */}
          <div className="flex flex-col gap-2 order-1 lg:order-2 lg:sticky lg:top-4 h-fit">
            {/* Job Details Card */}
            <div className="border border-[#E1E4EA] rounded-[16px] p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {/* Budget */}
                {!isVolunteer &&
                  ((data.priceMode === "range" && (data.minBudget || data.maxBudget)) ||
                    (data.priceMode === "fixed" && data.price)) && (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-inter-tight text-[17px] font-medium text-black">
                          {data.priceMode === "range" ? (
                            <>
                              ₦{(data.minBudget || 0).toLocaleString()} - ₦{(data.maxBudget || 0).toLocaleString()}
                            </>
                          ) : (
                            <>₦{(data.price || 0).toLocaleString()}</>
                          )}
                          {data.paymentType && (
                            <span>/{getPaymentTypeAbbr(data.paymentType)}</span>
                          )}
                        </span>
                        {data.duration && (
                          <>
                            <span className="font-inter-tight text-[17px] font-medium text-black">
                              •
                            </span>
                            <span className="font-inter-tight text-[17px] font-medium text-black">
                              {data.duration}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                        Budget
                      </span>
                    </div>
                  )}

                {/* Opportunity Type */}
                {data.type && (
                  <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.66602 11.6663C1.66602 9.32559 1.66602 8.15518 2.22778 7.31444C2.47098 6.95047 2.78348 6.63797 3.14745 6.39477C3.98819 5.83301 5.15858 5.83301 7.49935 5.83301H12.4993C14.8401 5.83301 16.0105 5.83301 16.8513 6.39477C17.2152 6.63797 17.5277 6.95047 17.7709 7.31444C18.3327 8.15518 18.3327 9.32559 18.3327 11.6663C18.3327 14.0071 18.3327 15.1775 17.7709 16.0183C17.5277 16.3822 17.2152 16.6947 16.8513 16.9379C16.0105 17.4997 14.8401 17.4997 12.4993 17.4997H7.49935C5.15858 17.4997 3.98819 17.4997 3.14745 16.9379C2.78348 16.6947 2.47098 16.3822 2.22778 16.0183C1.66602 15.1775 1.66602 14.0071 1.66602 11.6663Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.3337 5.83333C13.3337 4.26198 13.3337 3.47631 12.8455 2.98816C12.3573 2.5 11.5717 2.5 10.0003 2.5C8.42899 2.5 7.6433 2.5 7.15515 2.98816C6.66699 3.47631 6.66699 4.26198 6.66699 5.83333"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 9.16699L5.54331 9.33533C8.40425 10.222 11.5957 10.222 14.4567 9.33533L15 9.16699M10 10.0003V11.667"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-inter-tight text-[13px] font-medium text-black">
                        {config.label}
                      </span>
                      <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                        Opportunity Type
                      </span>
                    </div>
                  </div>
                )}

                {/* Start Date */}
                {data.startDate && (
                  <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3337 1.66699V5.00033M6.66699 1.66699V5.00033"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.8333 3.33301H9.16667C6.02397 3.33301 4.45262 3.33301 3.47631 4.30932C2.5 5.28563 2.5 6.85697 2.5 9.99967V11.6663C2.5 14.809 2.5 16.3804 3.47631 17.3567C4.45262 18.333 6.02397 18.333 9.16667 18.333H10.8333C13.976 18.333 15.5474 18.333 16.5237 17.3567C17.5 16.3804 17.5 14.809 17.5 11.6663V9.99967C17.5 6.85697 17.5 5.28563 16.5237 4.30932C15.5474 3.33301 13.976 3.33301 10.8333 3.33301Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 8.33301H17.5"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.99658 11.667H10.0041M9.99658 15.0003H10.0041M13.3262 11.667H13.3337M6.66699 11.667H6.67447M6.66699 15.0003H6.67447"
                          stroke="#606060"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-inter-tight text-[13px] font-medium text-black">
                        {data.startDate}
                      </span>
                      <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                        Start Date
                      </span>
                    </div>
                  </div>
                )}

                {/* Location */}
                {data.location && (
                  <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.9163 9.16667C12.9163 10.7775 11.6105 12.0833 9.99967 12.0833C8.38884 12.0833 7.08301 10.7775 7.08301 9.16667C7.08301 7.55583 8.38884 6.25 9.99967 6.25C11.6105 6.25 12.9163 7.55583 12.9163 9.16667Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                        />
                        <path
                          d="M10 1.66699C14.0588 1.66699 17.5 5.02781 17.5 9.10516C17.5 13.2474 14.0027 16.1542 10.7725 18.1309C10.5371 18.2638 10.2708 18.3337 10 18.3337C9.72917 18.3337 9.46292 18.2638 9.2275 18.1309C6.00325 16.135 2.5 13.2617 2.5 9.10516C2.5 5.02781 5.9412 1.66699 10 1.66699Z"
                          stroke="#606060"
                          strokeWidth="1.25"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-inter-tight text-[13px] font-medium text-black">
                        {data.location}
                      </span>
                      <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                        Location
                      </span>
                    </div>
                  </div>
                )}

                {/* Experience Level */}
                {data.experienceLevel && (
                  <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.07416 12.4987C4.75882 11.7899 4.58301 11.0013 4.58301 10.1703C4.58301 7.08397 7.00813 4.58203 9.99967 4.58203C12.9913 4.58203 15.4163 7.08397 15.4163 10.1703C15.4163 11.0013 15.2405 11.7899 14.9252 12.4987"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 1.66602V2.49935"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.3333 9.99902H17.5"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.50033 9.99902H1.66699"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.892 4.10645L15.3027 4.6957"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.69766 4.69668L4.1084 4.10742"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.0979 16.0875C12.9399 15.8152 13.2776 15.0445 13.3726 14.2694C13.4009 14.0378 13.2104 13.8457 12.9771 13.8457L7.06445 13.8459C6.82312 13.8459 6.6293 14.0507 6.65812 14.2903C6.75116 15.064 6.986 15.6291 7.87829 16.0875M12.0979 16.0875C12.0979 16.0875 8.02517 16.0875 7.87829 16.0875M12.0979 16.0875C11.9967 17.7084 11.5286 18.3503 10.0061 18.3323C8.37758 18.3624 8.00294 17.569 7.87829 16.0875"
                          stroke="#606060"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-inter-tight text-[13px] font-medium text-black">
                        {data.experienceLevel}
                      </span>
                      <span className="font-inter-tight text-[12px] font-light text-[#525866]">
                        Experience Level
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/signup"
                className="w-full h-[48px] flex items-center justify-center rounded-[40px] bg-[#5C30FF] text-white font-inter-tight text-[14px] font-normal hover:bg-[#4a26d4] transition-colors"
              >
                Sign Up to Apply
              </Link>
            </div>

            {/* Company Card */}
            <div className="border border-[#E1E4EA] rounded-[16px] p-4 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                {data.companyLogo ? (
                  <img
                    src={data.companyLogo}
                    alt={data.company}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: data.companyLogoBg }}
                  >
                    {data.companyInitials}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-inter-tight text-[12px] font-medium text-black leading-normal">
                    {data.company}
                  </span>
                  <span className="font-inter-tight text-[11px] font-light text-[#525866] leading-normal capitalize">
                    {data.category || "Company"}
                  </span>
                </div>
              </div>

              {data.description && (
                <p className="font-inter-tight text-[12px] font-normal text-black leading-[160%] line-clamp-3">
                  {data.description}
                </p>
              )}

              <Link
                href="/signup"
                className="w-full flex items-center justify-center py-4 px-4 rounded-[40px] border border-[#F5F5F5] bg-[#F5F5F5] hover:bg-[#e8e8e8] transition-colors"
              >
                <span className="font-inter-tight text-[13px] font-normal text-black leading-normal capitalize">
                  View Company Profile
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0] p-4 z-40">
        <Link
          href="/signup"
          className="w-full h-[48px] flex items-center justify-center rounded-[40px] bg-[#5C30FF] text-white font-inter-tight text-[14px] font-normal hover:bg-[#4a26d4] transition-colors"
        >
          Sign Up to Apply
        </Link>
      </div>
    </div>
  );
}
