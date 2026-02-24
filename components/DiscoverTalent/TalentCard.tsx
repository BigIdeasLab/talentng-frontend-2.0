"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

interface TalentCardProps {
  talent: TalentData;
}

export function TalentCard({ talent }: TalentCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/discover-talent/${talent.userId}`);
  };

  return (
    <div className="p-[12px_10px] flex flex-col gap-[8px] border border-[#E1E4EA] rounded-[16px] bg-white">
      {/* Header */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[5px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[8px]">
              <Image
                src={talent.avatar || "/default-avatar.jpg"}
                alt={talent.fullName}
                width={34}
                height={34}
                className="w-[34px] h-[34px] rounded-full object-cover flex-shrink-0"
                unoptimized
              />
              <div className="flex flex-col gap-[8px]">
                <h3 className="text-[13px] font-medium text-black font-inter-tight">
                  {talent.fullName}
                </h3>
                <p className="text-[12px] font-light text-black/30 font-inter-tight">
                  {talent.headline}
                </p>
              </div>
            </div>
            <Button
              onClick={handleViewProfile}
              className="h-auto px-[8px] py-[12px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] border border-[#181B25] flex-shrink-0"
            >
              <span className="text-[11px] font-normal text-white font-inter-tight w-[60px]">
                View Profile
              </span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-[18px] text-[12px]">
          <div className="flex items-center gap-[6px] flex-shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[15px] h-[15px] flex-shrink-0"
            >
              <path
                d="M10.2133 16.0253C9.88807 16.3298 9.4533 16.5 9.00082 16.5C8.54835 16.5 8.11365 16.3298 7.78838 16.0253C4.80977 13.2195 0.81807 10.0852 2.7647 5.53475C3.81722 3.07437 6.34375 1.5 9.00082 1.5C11.6579 1.5 14.1845 3.07437 15.237 5.53475C17.1812 10.0795 13.1992 13.2292 10.2133 16.0253Z"
                stroke="#525866"
                strokeWidth="1.125"
              />
              <path
                d="M11.625 8.25C11.625 9.69975 10.4497 10.875 9 10.875C7.55025 10.875 6.375 9.69975 6.375 8.25C6.375 6.80025 7.55025 5.625 9 5.625C10.4497 5.625 11.625 6.80025 11.625 8.25Z"
                stroke="#525866"
                strokeWidth="1.125"
              />
            </svg>
            <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
              {talent.location}
            </span>
          </div>
          <div className="flex items-center gap-[6px] flex-shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[15px] h-[15px] flex-shrink-0"
            >
              <path
                d="M1.5 10.5C1.5 8.39333 1.5 7.33996 2.00559 6.58329C2.22447 6.25572 2.50572 5.97447 2.83329 5.75559C3.58996 5.25 4.64331 5.25 6.75 5.25H11.25C13.3567 5.25 14.41 5.25 15.1667 5.75559C15.4942 5.97447 15.7755 6.25572 15.9944 6.58329C16.5 7.33996 16.5 8.39333 16.5 10.5C16.5 12.6067 16.5 13.6601 15.9944 14.4167C15.7755 14.7443 15.4942 15.0255 15.1667 15.2444C14.41 15.75 13.3567 15.75 11.25 15.75H6.75C4.64331 15.75 3.58996 15.75 2.83329 15.2444C2.50572 15.0255 2.22447 14.7443 2.00559 14.4167C1.5 13.6601 1.5 12.6067 1.5 10.5Z"
                stroke="#525866"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5.25C12 3.83578 12 3.12868 11.5606 2.68934C11.1213 2.25 10.4142 2.25 9 2.25C7.5858 2.25 6.87868 2.25 6.43934 2.68934C6 3.12868 6 3.83578 6 5.25"
                stroke="#525866"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.5 8.25L4.98898 8.4015C7.56382 9.1995 10.4362 9.1995 13.011 8.4015L13.5 8.25M9 9V10.5"
                stroke="#525866"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
              {talent.timesHired}X Hired
            </span>
          </div>
          <div className="flex items-center gap-[6px] flex-shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[15px] h-[15px] flex-shrink-0"
            >
              <path
                d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
                stroke="#525866"
                strokeWidth="1.125"
              />
              <path
                d="M11.0326 7.54582C10.9583 6.97383 10.3015 6.04966 9.1206 6.04964C7.7484 6.04962 7.17102 6.80959 7.05386 7.18958C6.87108 7.69785 6.90764 8.74282 8.51602 8.85675C10.5265 8.99925 11.332 9.23655 11.2295 10.467C11.127 11.6974 10.0063 11.9632 9.1206 11.9347C8.23485 11.9062 6.78573 11.4994 6.72949 10.405M8.98005 5.24854V6.05236M8.98005 11.9273V12.7485"
                stroke="#525866"
                strokeWidth="1.125"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
              ${talent.earnings.toLocaleString()} Earned
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex items-center gap-[7px] overflow-x-auto scrollbar-hidden">
          {talent.gallery.filter(Boolean).map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              width={147}
              height={147}
              className="h-[147px] w-[147px] object-cover rounded flex-shrink-0"
              unoptimized
            />
          ))}
        </div>

        {/* Skills & Stack */}
        <div className="flex flex-col gap-[8px]">
          {talent.stack.length > 0 && (
            <div className="flex flex-wrap gap-[4px] items-start">
              {talent.stack.map((item, idx) => (
                <div
                  key={idx}
                  className="px-[11px] py-[9px] flex justify-center items-center rounded-full bg-[#EEF2FF] border border-[#E0E7FF]"
                >
                  <span className="text-[11px] font-medium text-[#4338CA] font-inter-tight leading-[105%]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-[4px] items-start">
            {talent.skills.map((skill, idx) => (
              <div
                key={idx}
                className="px-[11px] py-[9px] flex justify-center items-center rounded-full bg-[#F5F5F5]"
              >
                <span className="text-[11px] font-normal text-black font-inter-tight leading-[105%]">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
