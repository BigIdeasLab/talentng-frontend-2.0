import { Bell, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Mentee {
  id: string;
  name: string;
  avatar: string;
}

interface SessionCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  mentees?: Mentee[];
  totalMentees?: number;
}

export function SessionCard({
  title,
  description,
  date,
  duration,
  location,
  mentees = [],
  totalMentees = 0,
}: SessionCardProps) {
  const displayMentees = mentees.slice(0, 5);
  const remainingCount = Math.max(0, totalMentees - displayMentees.length);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#E1E4EA] bg-white p-2.5 lg:px-2.5 lg:py-3">
      <div className="flex flex-col gap-4">
        {/* Title and Description Section */}
        <div className="flex items-start gap-3.5">
          {/* Purple accent bar */}
          <div className="h-auto min-h-[48px] w-1 flex-shrink-0 self-stretch rounded-[48px] bg-[#5C30FF]" />

          {/* Content */}
          <div className="flex flex-1 flex-col gap-3.5">
            {/* Title */}
            <h3 className="font-inter-tight text-[15px] font-semibold leading-normal text-black">
              {title}
            </h3>

            {/* Description */}
            <p className="font-inter-tight text-[13px] font-normal leading-normal text-[#525866]">
              {description}
            </p>
          </div>
        </div>

        {/* Session Details */}
        <div className="flex flex-col gap-3">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6663 1.83398V5.50065M7.33301 1.83398V5.50065"
                stroke="#525866"
                strokeWidth="1.375"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9167 3.66602H10.0833C6.62636 3.66602 4.89789 3.66602 3.82394 4.73995C2.75 5.8139 2.75 7.54238 2.75 10.9993V12.8327C2.75 16.2896 2.75 18.0182 3.82394 19.092C4.89789 20.166 6.62636 20.166 10.0833 20.166H11.9167C15.3736 20.166 17.1022 20.166 18.176 19.092C19.25 18.0182 19.25 16.2896 19.25 12.8327V10.9993C19.25 7.54238 19.25 5.8139 18.176 4.73995C17.1022 3.66602 15.3736 3.66602 11.9167 3.66602Z"
                stroke="#525866"
                strokeWidth="1.375"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.75 9.16602H19.25"
                stroke="#525866"
                strokeWidth="1.375"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.9955 12.834H11.0038M10.9955 16.5007H11.0038M14.6581 12.834H14.6663M7.33301 12.834H7.34123M7.33301 16.5007H7.34123"
                stroke="#525866"
                strokeWidth="1.83333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
              Date: {date}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.67733 2.75C7.48125 2.82327 7.28841 2.90319 7.09908 2.98949M18.9908 14.9427C19.0845 14.7399 19.1708 14.533 19.2496 14.3225M16.9568 17.751C17.1142 17.604 17.2664 17.4516 17.4128 17.2938M13.9961 19.5913C14.174 19.5242 14.3492 19.4517 14.5215 19.3738M11.1426 20.1611C10.9309 20.1684 10.7178 20.1684 10.506 20.1611M7.13794 19.3787C7.30367 19.4532 7.47208 19.523 7.64297 19.5876M4.28274 17.3441C4.40804 17.4769 4.53734 17.6059 4.67045 17.7309M2.41288 14.3591C2.48152 14.5404 2.55585 14.7188 2.63565 14.8943M1.83746 11.4632C1.83151 11.2724 1.83153 11.0805 1.83746 10.8895M2.40624 8.00905C2.47367 7.82985 2.54666 7.65337 2.625 7.47982M4.26759 5.02263C4.4002 4.88138 4.5373 4.74442 4.6787 4.61197"
                stroke="#525866"
                strokeWidth="1.375"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.375 11C12.375 11.7594 11.7594 12.375 11 12.375C10.2406 12.375 9.625 11.7594 9.625 11C9.625 10.2406 10.2406 9.625 11 9.625M12.375 11C12.375 10.2406 11.7594 9.625 11 9.625M12.375 11H14.6667M11 9.625V5.5"
                stroke="#525866"
                strokeWidth="1.375"
                strokeLinecap="round"
              />
              <path
                d="M20.1667 11.0006C20.1667 5.93804 16.0626 1.83398 11 1.83398"
                stroke="#525866"
                strokeWidth="1.375"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
              Duration: {duration}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2087 10.0833C14.2087 11.8552 12.7722 13.2917 11.0003 13.2917C9.22841 13.2917 7.79199 11.8552 7.79199 10.0833C7.79199 8.31142 9.22841 6.875 11.0003 6.875C12.7722 6.875 14.2087 8.31142 14.2087 10.0833Z"
                stroke="#525866"
                strokeWidth="1.375"
              />
              <path
                d="M11 1.83398C15.4647 1.83398 19.25 5.53088 19.25 10.016C19.25 14.5724 15.403 17.77 11.8498 19.9443C11.5908 20.0905 11.2979 20.1673 11 20.1673C10.7021 20.1673 10.4092 20.0905 10.1503 19.9443C6.60357 17.7488 2.75 14.5882 2.75 10.016C2.75 5.53088 6.53532 1.83398 11 1.83398Z"
                stroke="#525866"
                strokeWidth="1.375"
              />
            </svg>
            <span className="font-inter-tight text-[13px] font-normal leading-normal text-black">
              Location: {location}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#E1E4EA]" />

      {/* Bottom Section - Mentees and Actions */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        {/* Mentee Section */}
        {mentees.length > 0 ? (
          <div className="flex items-center gap-1.5">
            {/* Overlapping avatars */}
            <div className="flex items-center -space-x-1.5">
              {displayMentees.map((mentee) => (
                <div
                  key={mentee.id}
                  className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white"
                >
                  <Image
                    src={mentee.avatar}
                    alt={mentee.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F5F5F5]">
                  <span className="font-inter-tight text-xs font-normal text-black">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80"
                alt="Mentee"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-inter-tight text-[13px] font-medium leading-normal text-black">
                Akanbi David
              </span>
              <span className="font-inter-tight text-xs font-light leading-normal text-black/30">
                Mentee
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button className="flex items-center gap-2 rounded-[40px] bg-[#5C30FF] px-3 py-2.5 hover:bg-[#4A26CC]">
            <Bell className="h-4 w-4" strokeWidth={1.375} />
            <span className="font-inter-tight text-xs font-normal leading-5 text-white">
              Remind Me
            </span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-[40px] border-0 bg-[#F5F5F5] px-3 py-2.5 hover:bg-[#E5E5E5]"
          >
            <Clock
              className="h-4 w-4 text-[#525866]"
              strokeWidth={1.375}
            />
            <span className="font-inter-tight text-xs font-normal leading-5 text-[#525866]">
              Reschedule
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
