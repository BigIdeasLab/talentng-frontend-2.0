"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { JobCardProps } from "@/lib/types/opportunity";

export const JobCard: React.FC<JobCardProps> = ({
  id,
  company,
  logo,
  title,
  location,
  type,
  employmentType,
  talent,
  onShare,
  onApply,
  hasApplied,
  basePath = "/talent/opportunities",
}) => {
  const router = useRouter();
  return (
    <div className="space-y-4">
      {/* Job Card */}
      <div className="p-6 border border-gray-200 rounded-[32px] bg-white space-y-4 shadow-sm">
        <div className="flex items-start gap-4">
          <img
            src={logo}
            alt={company}
            className="w-8 h-8 rounded-3xl object-cover"
          />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`${basePath}/${id}`)}
                  className="text-left"
                >
                  <h4 className="text-base font-geist text-black underline decoration-transparent hover:decoration-black">
                    {company}
                  </h4>
                  <h5 className="text-lg font-bold text-black font-geist">
                    {title}
                  </h5>
                </button>
              </div>
              <p className="text-base text-black font-geist">
                {type}, {employmentType}, {location}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onShare?.(id)}
                className="flex items-center gap-2.5 px-3 py-2 md:px-3.5 md:py-3.5 border border-gray-200 rounded-3xl bg-white text-black font-geist text-sm md:text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Share
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_share)">
                    <path
                      d="M7.44667 2.5C7.32238 2.85493 7.30023 3.23761 7.38274 3.60451C7.46524 3.97141 7.64908 4.30777 7.91333 4.57533C6.92267 5.6 5.976 6.91533 5.436 8.534C5.26953 9.02809 5.30259 9.56765 5.52813 10.0377C5.75366 10.5078 6.15385 10.8712 6.64342 11.0505C7.13298 11.2299 7.67323 11.2109 8.14904 10.9978C8.62484 10.7846 8.9986 10.394 9.19067 9.90933L9.23067 9.79933C9.638 8.576 10.514 7.526 11.512 6.68133C11.9996 6.27158 12.5185 5.90067 13.064 5.572L13.3247 5.41867L13.558 5.288L13.7593 5.18133L14 5.06V13.1667C14.0001 13.5031 13.8731 13.827 13.6443 14.0737C13.4156 14.3204 13.1021 14.4714 12.7667 14.4967L12.6667 14.5H3.33333C2.99695 14.5001 2.67296 14.3731 2.4263 14.1443C2.17965 13.9156 2.02856 13.6021 2.00333 13.2667L2 13.1667V3.83333C1.99989 3.49695 2.12694 3.17296 2.35566 2.9263C2.58439 2.67965 2.8979 2.52856 3.23333 2.50333L3.33333 2.5H7.44667ZM13.0087 2.5C13.4233 2.5 13.6647 2.812 13.7253 3.07067C13.786 3.33 13.7087 3.718 13.3353 3.902L13.0593 4.04267L12.95 4.10133L12.708 4.23533L12.438 4.39267L12.1453 4.57267C11.6907 4.85933 11.172 5.22333 10.6507 5.664C9.548 6.59667 8.47867 7.838 7.966 9.37733C7.91013 9.54513 7.78989 9.68385 7.63173 9.76299C7.47358 9.84213 7.29046 9.85521 7.12267 9.79933C6.95487 9.74346 6.81615 9.62322 6.73701 9.46507C6.65787 9.30691 6.64479 9.12379 6.70067 8.956C7.31933 7.1 8.58267 5.66733 9.79 4.646C10.0773 4.40267 10.3647 4.18067 10.642 3.97933L10.8487 3.83333H9.33333C9.16341 3.83314 8.99998 3.76808 8.87642 3.65143C8.75286 3.53479 8.67851 3.37536 8.66855 3.20574C8.65859 3.03611 8.71378 2.86908 8.82284 2.73878C8.9319 2.60848 9.0866 2.52474 9.25533 2.50467L9.33333 2.5H13.0087Z"
                      fill="#09244B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_share">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button
                onClick={() => onApply?.(id)}
                disabled={hasApplied}
                className="flex items-center gap-2.5 px-3 py-2 md:px-3.5 md:py-3.5 rounded-3xl bg-black text-white font-geist text-sm md:text-base font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                {hasApplied ? "Applied" : "Apply"}
                {!hasApplied && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_briefcase)">
                      <path
                        d="M9.33325 2.5C9.86368 2.5 10.3724 2.71071 10.7475 3.08579C11.1225 3.46086 11.3333 3.96957 11.3333 4.5H13.3333C13.6869 4.5 14.026 4.64048 14.2761 4.89052C14.5261 5.14057 14.6666 5.47971 14.6666 5.83333V13.1667C14.6666 13.5203 14.5261 13.8594 14.2761 14.1095C14.026 14.3595 13.6869 14.5 13.3333 14.5H2.66659C2.31296 14.5 1.97382 14.3595 1.72378 14.1095C1.47373 13.8594 1.33325 13.5203 1.33325 13.1667V5.83333C1.33325 5.47971 1.47373 5.14057 1.72378 4.89052C1.97382 4.64048 2.31296 4.5 2.66659 4.5H4.66658C4.66658 3.96957 4.8773 3.46086 5.25237 3.08579C5.62744 2.71071 6.13615 2.5 6.66658 2.5H9.33325ZM12.6666 7.16667H3.33325C3.16333 7.16686 2.9999 7.23192 2.87634 7.34857C2.75278 7.46521 2.67843 7.62464 2.66847 7.79426C2.65851 7.96389 2.7137 8.13092 2.82276 8.26122C2.93182 8.39152 3.08652 8.47526 3.25525 8.49533L3.33325 8.5H7.33325V9.16667C7.33344 9.33659 7.3985 9.50002 7.51515 9.62358C7.6318 9.74714 7.79122 9.82149 7.96085 9.83145C8.13048 9.84141 8.2975 9.78622 8.42781 9.67716C8.55811 9.5681 8.64185 9.4134 8.66192 9.24467L8.66658 9.16667V8.5H12.6666C12.8365 8.49981 12.9999 8.43475 13.1235 8.3181C13.2471 8.20146 13.3214 8.04203 13.3314 7.8724C13.3413 7.70278 13.2861 7.53575 13.1771 7.40545C13.068 7.27514 12.9133 7.1914 12.7446 7.17133L12.6666 7.16667ZM9.33325 3.83333H6.66658C6.5033 3.83335 6.34569 3.8933 6.22367 4.00181C6.10165 4.11032 6.02369 4.25983 6.00458 4.422L5.99992 4.5H9.99992C9.9999 4.33671 9.93995 4.17911 9.83144 4.05709C9.72294 3.93506 9.57342 3.8571 9.41125 3.838L9.33325 3.83333Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_briefcase">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Talent Info */}
      {talent && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={talent.avatar}
              alt={talent.name}
              className="w-8 h-8 rounded-2xl object-cover"
            />
            {talent.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-gray-500 font-geist">
              {talent.name}
            </span>
            {talent.verified && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-xs">
                ✓
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
