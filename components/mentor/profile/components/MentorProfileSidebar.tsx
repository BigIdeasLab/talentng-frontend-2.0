"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface MentorProfileSidebarProps {
  mentor: {
    name: string;
    title: string;
    profileImage?: string;
    sessionsCompleted: number;
    mentoringTime: number;
  };
  stack?: string[];
  socialLinks?: {
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  profileCompleteness?: number | null;
  avgRating?: number | null;
  views?: number;
  visibility?: "public" | "private";
  onToggleVisibility?: () => void;
  onEditProfile?: () => void;
}

export function MentorProfileSidebar({
  mentor,
  stack = [],
  socialLinks,
  profileCompleteness = null,
  avgRating = null,
  views = 0,
  visibility = "public",
  onToggleVisibility,
  onEditProfile,
}: MentorProfileSidebarProps) {
  const displayedStack = stack.slice(0, 5);
  const stackRemaining = Math.max(0, stack.length - 5);

  const completeness = profileCompleteness ?? 0;
  const ringSize = 104;
  const strokeWidth = 3;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completeness / 100) * circumference;
  const ringColor =
    completeness >= 100
      ? "#22C55E"
      : completeness >= 70
        ? "#F59E0B"
        : completeness >= 40
          ? "#F97316"
          : "#EF4444";

  return (
    <div className="w-full lg:w-[350px] bg-white lg:border-r border-[#E1E4EA] flex flex-col px-4 py-7 gap-5 overflow-y-auto lg:h-screen scrollbar-hidden">
      {/* User Profile */}
      <div className="flex flex-col items-center gap-5">
        {/* Profile Picture with Completeness Ring */}
        <div className="relative flex-shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg
            width={ringSize}
            height={ringSize}
            className="absolute inset-0 -rotate-90"
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="#E1E4EA"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          <div
            className="absolute rounded-full bg-cover bg-center"
            style={{
              top: (ringSize - 90) / 2,
              left: (ringSize - 90) / 2,
              width: 90,
              height: 90,
              backgroundImage: `url(${mentor.profileImage || "/default.png"})`,
            }}
          />
          {profileCompleteness !== null && (
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white font-inter-tight"
              style={{ backgroundColor: ringColor }}
            >
              {completeness}%
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-col items-center gap-3 w-[200px]">
          {/* Name */}
          <h2 className="text-[16px] font-medium text-black font-inter-tight text-center">
            {mentor.name}
          </h2>

          {/* Title */}
          <p className="text-[14px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight text-center">
            {mentor.title}
          </p>
        </div>

        {/* Details Container */}
        <div className="flex flex-col items-start gap-3 w-full">
          {/* Average Rating */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1.83L13.09 8.26H19.92L14.42 12.24L16.51 18.67L11 14.69L5.49 18.67L7.58 12.24L2.08 8.26H8.91L11 1.83Z" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13px] font-normal text-black font-inter-tight">
                {avgRating !== null && avgRating !== undefined ? avgRating.toFixed(1) : "N/A"} Rating
              </span>
            </div>
          </div>

          {/* Sessions completed */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29166 12.6807L5.49999 16.0418L6.43867 15.0584M15.125 5.9585L9.56724 11.7809"
                  stroke="#525866"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.875 12.6807L10.0833 16.0418L19.7083 5.9585"
                  stroke="#525866"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[13px] font-normal text-black font-inter-tight">
                {mentor.sessionsCompleted} Session Completed
              </span>
            </div>
          </div>

          {/* Mentoring time */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.67767 2.75C7.48159 2.82327 7.28875 2.90319 7.09942 2.98949M18.9911 14.9427C19.0848 14.7399 19.1712 14.533 19.2499 14.3225M16.9571 17.751C17.1145 17.604 17.2667 17.4516 17.4132 17.2938M13.9964 19.5913C14.1743 19.5242 14.3495 19.4517 14.5218 19.3738M11.1429 20.1611C10.9313 20.1684 10.7181 20.1684 10.5064 20.1611M7.13828 19.3787C7.30401 19.4532 7.47242 19.523 7.6433 19.5876M4.28308 17.3441C4.40838 17.4769 4.53767 17.6059 4.67078 17.7309M2.41322 14.3591C2.48186 14.5404 2.55619 14.7188 2.63599 14.8943M1.8378 11.4632C1.83185 11.2724 1.83187 11.0805 1.8378 10.8895M2.40657 8.00904C2.474 7.82985 2.547 7.65337 2.62533 7.47982M4.26793 5.02263C4.40053 4.88138 4.53764 4.74442 4.67903 4.61197"
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
                  d="M20.1667 11.0002C20.1667 5.93755 16.0626 1.8335 11 1.8335"
                  stroke="#525866"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[13px] font-normal text-black font-inter-tight">
                {mentor.mentoringTime} mins mentoring time
              </span>
            </div>
          </div>

          {/* Profile Views */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.83 11C1.83 11 4.58 4.58 11 4.58C17.42 4.58 20.17 11 20.17 11C20.17 11 17.42 17.42 11 17.42C4.58 17.42 1.83 11 1.83 11Z" stroke="#525866" strokeWidth="1.375" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="2.75" stroke="#525866" strokeWidth="1.375"/>
              </svg>
              <span className="text-[13px] font-normal text-black font-inter-tight">
                {views} Profile Views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <Button
        onClick={onEditProfile}
        className="w-full h-auto rounded-[40px] bg-[#181B25] hover:bg-[#2a2f3a] text-white px-16 py-4 font-normal text-[15px]"
      >
        Edit Profile
      </Button>

      {/* Visibility Toggle */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-[13px] font-normal text-black font-inter-tight">
            Profile Visibility
          </span>
          <span className="text-[11px] text-[rgba(0,0,0,0.30)] font-inter-tight">
            {visibility === "public" ? "Visible to everyone" : "Hidden from search"}
          </span>
        </div>
        <Switch
          checked={visibility === "public"}
          onCheckedChange={() => onToggleVisibility?.()}
        />
      </div>

      {/* Stack Section */}
      {displayedStack.length > 0 && (
        <div className="flex flex-col items-start gap-[12px]">
          <h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
            Stack
          </h3>
          <div className="flex flex-wrap gap-[6px] w-full">
            {displayedStack.map((tool, idx) => (
              <div
                key={idx}
                className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5] flex items-center gap-[5px]"
              >
                <div className="w-[16px] h-[16px] rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                <span className="text-[11px] font-normal text-black font-inter-tight">
                  {tool}
                </span>
              </div>
            ))}
            {stackRemaining > 0 && (
              <div className="px-[10px] py-[7px] rounded-full bg-[#F5F5F5]">
                <span className="text-[11px] font-normal text-black font-inter-tight">
                  +{stackRemaining}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="flex flex-col items-start gap-7">
        <div className="flex flex-col items-start gap-4 w-full">
          {/* Header */}
          <h3 className="text-[11px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
            Social Links
          </h3>

          {/* Social Link Items */}
          <div className="flex flex-col gap-2 w-full">
            {/* Telegram */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.9866 14.1243L13.9579 17.5025C15.0587 18.754 15.6092 19.3798 16.1853 19.2274C16.7614 19.0751 16.9591 18.2516 17.3542 16.6043L19.546 7.46707C20.1546 4.93012 20.4588 3.66166 19.7824 3.036C19.1061 2.41035 17.9337 2.87581 15.5889 3.80675L4.71054 8.12578C2.8352 8.87034 1.89752 9.24266 1.83799 9.8824C1.8319 9.94785 1.8318 10.0138 1.83769 10.0792C1.89526 10.7192 2.83179 11.0947 4.70485 11.8454C5.55353 12.1856 5.97787 12.3557 6.28211 12.6815C6.31632 12.7181 6.34921 12.7561 6.38073 12.7952C6.66104 13.1435 6.78068 13.6007 7.01992 14.5149L7.46766 16.2259C7.70047 17.1155 7.81688 17.5604 8.12175 17.6211C8.42663 17.6817 8.69207 17.3128 9.22296 16.5751L10.9866 14.1243ZM10.9866 14.1243L10.6953 13.8207C10.3638 13.4751 10.198 13.3024 10.198 13.0877C10.198 12.873 10.3638 12.7002 10.6953 12.3546L13.9706 8.94125"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-normal text-black font-inter-tight">
                  Telegram
                </span>
              </div>
              {socialLinks?.telegram && (
                <Link
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.8431 3.20458L10.1281 11.9702M18.8431 3.20458C18.3903 2.75119 15.3399 2.79345 14.695 2.80262M18.8431 3.20458C19.296 3.65798 19.2537 6.71231 19.2445 7.35802"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>

            {/* X (Twitter) */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.75 19.25L9.66937 12.3306M9.66937 12.3306L2.75 2.75H7.33333L12.3306 9.66937M9.66937 12.3306L14.6667 19.25H19.25L12.3306 9.66937M19.25 2.75L12.3306 9.66937"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-normal text-black font-inter-tight">
                  X
                </span>
              </div>
              {socialLinks?.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.8431 3.20458L10.1281 11.9702M18.8431 3.20458C18.3903 2.75119 15.3399 2.79345 14.695 2.80262M18.8431 3.20458C19.296 3.65798 19.2537 6.71231 19.2445 7.35802"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>

            {/* Instagram */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.29166 10.9998C2.29166 6.89469 2.29166 4.84212 3.56696 3.56681C4.84227 2.2915 6.89484 2.2915 11 2.2915C15.1051 2.2915 17.1577 2.2915 18.4331 3.56681C19.7083 4.84212 19.7083 6.89469 19.7083 10.9998C19.7083 15.1049 19.7083 17.1575 18.4331 18.4329C17.1577 19.7082 15.1051 19.7082 11 19.7082C6.89484 19.7082 4.84227 19.7082 3.56696 18.4329C2.29166 17.1575 2.29166 15.1049 2.29166 10.9998Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.125 11C15.125 13.2782 13.2782 15.125 11 15.125C8.72183 15.125 6.875 13.2782 6.875 11C6.875 8.72183 8.72183 6.875 11 6.875C13.2782 6.875 15.125 8.72183 15.125 11Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                  />
                  <path
                    d="M16.0498 5.9585H16.0408"
                    stroke="#525866"
                    strokeWidth="1.83333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-normal text-black font-inter-tight">
                  Instagram
                </span>
              </div>
              {socialLinks?.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.8431 3.20458L10.1281 11.9702M18.8431 3.20458C18.3903 2.75119 15.3399 2.79345 14.695 2.80262M18.8431 3.20458C19.296 3.65798 19.2537 6.71231 19.2445 7.35802"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.12501 8.7085H3.66668C2.80243 8.7085 2.37032 8.7085 2.10183 8.97698C1.83334 9.24548 1.83334 9.6776 1.83334 10.5418V18.3335C1.83334 19.1977 1.83334 19.6298 2.10183 19.8983C2.37032 20.1668 2.80243 20.1668 3.66668 20.1668H4.12501C4.98925 20.1668 5.42137 20.1668 5.68986 19.8983C5.95834 19.6298 5.95834 19.1977 5.95834 18.3335V10.5418C5.95834 9.6776 5.95834 9.24548 5.68986 8.97698C5.42137 8.7085 4.98925 8.7085 4.12501 8.7085Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                  />
                  <path
                    d="M5.95834 3.896C5.95834 5.03508 5.03493 5.9585 3.89584 5.9585C2.75676 5.9585 1.83334 5.03508 1.83334 3.896C1.83334 2.75691 2.75676 1.8335 3.89584 1.8335C5.03493 1.8335 5.95834 2.75691 5.95834 3.896Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                  />
                  <path
                    d="M11.2988 8.7085H10.5417C9.67744 8.7085 9.24533 8.7085 8.97683 8.97698C8.70834 9.24548 8.70834 9.6776 8.70834 10.5418V18.3335C8.70834 19.1977 8.70834 19.6298 8.97683 19.8983C9.24533 20.1668 9.67744 20.1668 10.5417 20.1668H11C11.8642 20.1668 12.2964 20.1668 12.5649 19.8983C12.8333 19.6298 12.8333 19.1977 12.8333 18.3335L12.8334 15.1253C12.8334 13.6065 13.3174 12.3753 14.7473 12.3753C15.4621 12.3753 16.0417 12.9909 16.0417 13.7503V17.8753C16.0417 18.7395 16.0417 19.1716 16.3102 19.4401C16.5786 19.7086 17.0108 19.7086 17.875 19.7086H18.3322C19.1962 19.7086 19.6282 19.7086 19.8967 19.4402C20.1652 19.1718 20.1653 18.7398 20.1655 17.8757L20.1668 12.8337C20.1668 10.5556 18 8.70872 15.8554 8.70872C14.6345 8.70872 13.5453 9.30717 12.8334 10.243C12.8333 9.6654 12.8333 9.37665 12.7079 9.16225C12.6285 9.02645 12.5154 8.9134 12.3796 8.83396C12.1652 8.7085 11.8764 8.7085 11.2988 8.7085Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-normal text-black font-inter-tight">
                  LinkendIn
                </span>
              </div>
              {socialLinks?.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1739 2.75C6.82897 2.75602 5.0774 2.83816 3.95801 3.95773C2.75 5.16593 2.75 7.11051 2.75 10.9996C2.75 14.8888 2.75 16.8334 3.95801 18.0415C5.16601 19.2498 7.11028 19.2498 10.9989 19.2498C14.8873 19.2498 16.8316 19.2498 18.0396 18.0415C19.1589 16.922 19.2411 15.1701 19.2471 11.8247"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.8431 3.20458L10.1281 11.9702M18.8431 3.20458C18.3903 2.75119 15.3399 2.79345 14.695 2.80262M18.8431 3.20458C19.296 3.65798 19.2537 6.71231 19.2445 7.35802"
                      stroke="#525866"
                      strokeWidth="1.375"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
