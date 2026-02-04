"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Clock, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock mentor data - Replace with API call
const MOCK_MENTOR_DETAILS = {
  "1": {
    id: "1",
    name: "Johnson Mark",
    title: "UI/UX Designer At Google",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/ce48d9d62f90e73233f228176eca980a1f1d6319?width=524",
    pricePerSession: 150,
    sessionsCompleted: 200,
    mentoringTime: 320,
    about:
      "Hello! I'm a Data Scientist at Microsoft, specializing in machine learning and data visualization. With over 8 years of experience, I've contributed to projects ranging from cloud computing to AI-driven solutions. My expertise includes Python, R, SQL, and tools like TensorFlow and Power BI.\n\nI've led cross-functional teams, mentored junior data scientists, and worked with stakeholders to translate complex data into actionable insights. Whether you're interested in refining your analytical skills, understanding data trends, or need guidance on real-world data applications, I'm here to assist.\n\nPlease note: To provide focused and in-depth consultations, I offer 30–45 minute mentorship sessions at $90 USD. I'm excited to connect, share my knowledge, and help you advance your career in data science.",
    expertise: ["Data Analysis", "Engineering"],
    discipline: "Data Scientist",
    industries: ["AI", "Fintech", "Ecommerce"],
    languages: ["English", "French"],
    availability: [
      { date: "Nov 28", day: "Thur", selected: true },
      { date: "Nov 29", day: "Fri", selected: false },
      { date: "Nov 30", day: "Sat", selected: false },
      { date: "Dec 01", day: "Sun", selected: false },
      { date: "Dec 02", day: "Mon", selected: false },
      { date: "Dec 04", day: "Wed", selected: false },
      { date: "Dec 03", day: "Tue", selected: false },
      { date: "Dec 05", day: "Thu", selected: false },
    ],
    timeSlots: ["9:00 Am", "9:30 Am", "9:45 Am"],
    socialLinks: {
      telegram: "#",
      x: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  "2": {
    id: "2",
    name: "Lee Sarah",
    title: "Frontend Developer At Amazon",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/6a0463719f677585422c40bf7dae63b8ffcd7043?width=524",
    pricePerSession: 120,
    sessionsCompleted: 100,
    mentoringTime: 450,
    about:
      "Hi! I'm a Frontend Developer at Amazon with a passion for creating beautiful, responsive web applications. I specialize in React, TypeScript, and modern CSS frameworks. With 6 years of experience, I've worked on large-scale e-commerce platforms and user-facing applications.\n\nI love mentoring aspiring developers and helping them level up their skills in frontend development, UI/UX design, and web performance optimization.",
    expertise: ["Frontend Development", "UI/UX"],
    discipline: "Frontend Developer",
    industries: ["E-commerce", "Tech", "Retail"],
    languages: ["English", "Korean"],
    availability: [
      { date: "Nov 28", day: "Thur", selected: false },
      { date: "Nov 29", day: "Fri", selected: true },
      { date: "Nov 30", day: "Sat", selected: false },
      { date: "Dec 01", day: "Sun", selected: false },
      { date: "Dec 02", day: "Mon", selected: false },
      { date: "Dec 04", day: "Wed", selected: false },
      { date: "Dec 03", day: "Tue", selected: false },
      { date: "Dec 05", day: "Thu", selected: false },
    ],
    timeSlots: ["10:00 Am", "10:30 Am", "11:00 Am"],
    socialLinks: {
      telegram: "#",
      x: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  "3": {
    id: "3",
    name: "Brown David",
    title: "Data Scientist At Microsoft",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/15e640f5aa424a17f0dfc70f71e49782a71b9b72?width=524",
    pricePerSession: 90,
    sessionsCompleted: 50,
    mentoringTime: 510,
    about:
      "Hello! I'm a Data Scientist at Microsoft, specializing in machine learning and data visualization. With over 8 years of experience, I've contributed to projects ranging from cloud computing to AI-driven solutions. My expertise includes Python, R, SQL, and tools like TensorFlow and Power BI.\n\nI've led cross-functional teams, mentored junior data scientists, and worked with stakeholders to translate complex data into actionable insights. Whether you're interested in refining your analytical skills, understanding data trends, or need guidance on real-world data applications, I'm here to assist.\n\nPlease note: To provide focused and in-depth consultations, I offer 30–45 minute mentorship sessions at $90 USD. I'm excited to connect, share my knowledge, and help you advance your career in data science.",
    expertise: ["Data Analysis", "Engineering"],
    discipline: "Data Scientist",
    industries: ["AI", "Fintech", "Ecommerce"],
    languages: ["English", "French"],
    availability: [
      { date: "Nov 28", day: "Thur", selected: true },
      { date: "Nov 29", day: "Fri", selected: false },
      { date: "Nov 30", day: "Sat", selected: false },
      { date: "Dec 01", day: "Sun", selected: false },
      { date: "Dec 02", day: "Mon", selected: false },
      { date: "Dec 04", day: "Wed", selected: false },
      { date: "Dec 03", day: "Tue", selected: false },
      { date: "Dec 05", day: "Thu", selected: false },
    ],
    timeSlots: ["9:00 Am", "9:30 Am", "9:45 Am"],
    socialLinks: {
      telegram: "#",
      x: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
};

type TabType = "Overview" | "Reviews" | "Session";

export default function MentorDetailPage() {
  const params = useParams();
  const mentorId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);

  const mentor =
    MOCK_MENTOR_DETAILS[mentorId as keyof typeof MOCK_MENTOR_DETAILS];

  if (!mentor) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Mentor not found</p>
          <Link
            href="/mentorship"
            className="px-4 py-2 bg-[#181B25] text-white rounded-lg hover:bg-[#252831]"
          >
            Back to Mentorship
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Back Button */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#E1E4EA]">
        <Link
          href="/mentorship"
          className="flex items-center gap-2 text-[#A3A3A3] hover:text-black transition-colors w-fit"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.783 11.7826C9.71332 11.8525 9.63053 11.9079 9.53937 11.9458C9.4482 11.9837 9.35046 12.0031 9.25175 12.0031C9.15304 12.0031 9.0553 11.9837 8.96414 11.9458C8.87297 11.9079 8.79018 11.8525 8.7205 11.7826L5.7205 8.78255C5.65058 8.71287 5.5951 8.63008 5.55725 8.53891C5.5194 8.44775 5.49991 8.35001 5.49991 8.2513C5.49991 8.15259 5.5194 8.05485 5.55725 7.96369C5.5951 7.87252 5.65058 7.78973 5.7205 7.72005L8.7205 4.72005C8.8614 4.57915 9.0525 4.5 9.25175 4.5C9.45101 4.5 9.64211 4.57915 9.783 4.72005C9.9239 4.86095 10.0031 5.05204 10.0031 5.2513C10.0031 5.45056 9.9239 5.64165 9.783 5.78255L7.31488 8.25193L9.78488 10.7213C9.85449 10.7911 9.90966 10.8739 9.94724 10.965C9.98482 11.0561 10.0041 11.1538 10.0039 11.2523C10.0037 11.3509 9.98413 11.4484 9.94623 11.5394C9.90832 11.6304 9.85286 11.713 9.783 11.7826Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-inter-tight text-[13px] font-normal">
            Back to Mentorship
          </span>
        </Link>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[342px] flex-shrink-0 border-r border-[#E1E4EA] bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
          <div className="flex flex-col gap-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-[113px] h-[113px] rounded-full overflow-hidden bg-gradient-to-b from-purple-400 to-purple-600">
                <Image
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-2.5">
                <h1 className="font-inter-tight text-[17px] font-semibold text-black text-center">
                  {mentor.name}
                </h1>
                <p className="font-inter-tight text-[13px] font-normal text-[#A3A3A3] text-center">
                  {mentor.title}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <DollarCircleIcon className="w-4 h-4 text-[#525866]" />
                <span className="font-inter-tight text-[13px] font-normal text-[#525866]">
                  ${mentor.pricePerSession} / Session
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckDoubleIcon className="w-4 h-4 text-[#525866]" />
                <span className="font-inter-tight text-[13px] font-normal text-[#525866]">
                  {mentor.sessionsCompleted} Session Completed
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#525866]" strokeWidth={1.125} />
                <span className="font-inter-tight text-[13px] font-normal text-[#525866]">
                  {mentor.mentoringTime} mins mentoring time
                </span>
              </div>
            </div>

            {/* Book Session Button */}
            <button className="w-full h-[48px] rounded-full bg-[#181B25] text-white font-inter-tight text-[13px] font-medium hover:bg-[#252831] transition-colors">
              Book Session
            </button>

            {/* Availability Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-inter-tight text-[13px] font-medium text-black">
                  Availability
                </h3>
                <button className="font-inter-tight text-[12px] font-normal text-[#5C30FF] hover:underline">
                  View All
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-4 gap-2">
                {mentor.availability.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`flex flex-col items-center justify-center gap-1 h-[52px] rounded-lg border transition-colors ${
                      selectedDate === index
                        ? "bg-[#5C30FF] border-[#5C30FF]"
                        : "bg-white border-[#E1E4EA] hover:border-[#5C30FF]"
                    }`}
                  >
                    <span
                      className={`font-inter-tight text-[10px] font-normal ${
                        selectedDate === index ? "text-white/70" : "text-[#A3A3A3]"
                      }`}
                    >
                      {slot.day}
                    </span>
                    <span
                      className={`font-inter-tight text-[13px] font-medium ${
                        selectedDate === index ? "text-white" : "text-black"
                      }`}
                    >
                      {slot.date.split(" ")[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Time Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-inter-tight text-[13px] font-medium text-black">
                  Select Time
                </h3>
                <button className="font-inter-tight text-[12px] font-normal text-[#5C30FF] hover:underline">
                  View All
                </button>
              </div>

              {/* Time Slots */}
              <div className="flex items-center gap-2">
                {mentor.timeSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(index)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border font-inter-tight text-[13px] font-normal transition-colors ${
                      selectedTime === index
                        ? "bg-[#5C30FF] border-[#5C30FF] text-white"
                        : "bg-white border-[#E1E4EA] text-black hover:border-[#5C30FF]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Links Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-inter-tight text-[13px] font-medium text-black">
                Social Links
              </h3>

              <div className="flex flex-col gap-2">
                <Link
                  href={mentor.socialLinks.telegram}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <TelegramIcon className="w-4 h-4" />
                    <span className="font-inter-tight text-[13px] font-normal text-black">
                      Telegram
                    </span>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-[#B2B2B2] group-hover:text-black transition-colors" />
                </Link>

                <Link
                  href={mentor.socialLinks.x}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <XIcon className="w-4 h-4" />
                    <span className="font-inter-tight text-[13px] font-normal text-black">
                      X
                    </span>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-[#B2B2B2] group-hover:text-black transition-colors" />
                </Link>

                <Link
                  href={mentor.socialLinks.instagram}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <InstagramIcon className="w-4 h-4" />
                    <span className="font-inter-tight text-[13px] font-normal text-black">
                      Instagram
                    </span>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-[#B2B2B2] group-hover:text-black transition-colors" />
                </Link>

                <Link
                  href={mentor.socialLinks.linkedin}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#F5F5F5] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <LinkedInIcon className="w-4 h-4" />
                    <span className="font-inter-tight text-[13px] font-normal text-black">
                      LinkedIn
                    </span>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-[#B2B2B2] group-hover:text-black transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-[#E1E4EA] bg-white px-8 pt-6">
          <div className="flex items-center gap-8">
            {(["Overview", "Reviews", "Session"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-inter-tight text-[15px] font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-black text-black"
                    : "border-transparent text-[#A3A3A3] hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-6">
          {activeTab === "Overview" && (
            <div className="max-w-[700px] flex flex-col gap-8">
              {/* About Brown Section */}
              <div className="flex flex-col gap-4">
                <h2 className="font-inter-tight text-[20px] font-bold text-black">
                  About {mentor.name.split(" ")[0]}
                </h2>
                <p className="font-inter-tight text-[15px] font-normal text-black leading-[24px] whitespace-pre-line">
                  {mentor.about}
                </p>
              </div>

              {/* Background Section */}
              <div className="flex flex-col gap-5">
                <h2 className="font-inter-tight text-[20px] font-bold text-black">
                  Background
                </h2>

                {/* Expertise */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter-tight text-[15px] font-normal text-black">
                    Expertise
                  </h3>
                  <div className="flex items-center gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-[#F5F5F5] font-inter-tight text-[13px] font-normal text-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Discipline */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter-tight text-[15px] font-normal text-black">
                    Discipline
                  </h3>
                  <div className="flex items-center">
                    <span className="px-4 py-2 rounded-full bg-[#F5F5F5] font-inter-tight text-[13px] font-normal text-black">
                      {mentor.discipline}
                    </span>
                  </div>
                </div>

                {/* Industries */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter-tight text-[15px] font-normal text-black">
                    Industries
                  </h3>
                  <div className="flex items-center gap-2">
                    {mentor.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-[#F5F5F5] font-inter-tight text-[13px] font-normal text-black"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter-tight text-[15px] font-normal text-black">
                    Language
                  </h3>
                  <div className="flex items-center gap-2">
                    {mentor.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-[#F5F5F5] font-inter-tight text-[13px] font-normal text-black"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="max-w-[700px]">
              <p className="text-gray-500 text-center py-8">
                No reviews available yet
              </p>
            </div>
          )}

          {activeTab === "Session" && (
            <div className="max-w-[700px]">
              <p className="text-gray-500 text-center py-8">
                No sessions scheduled yet
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

// Icon Components
function DollarCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
        stroke="currentColor"
        strokeWidth="1.125"
      />
      <path
        d="M11.0326 7.54533C10.9583 6.97334 10.3015 6.04917 9.1206 6.04915C7.7484 6.04913 7.17102 6.8091 7.05386 7.18909C6.87108 7.69736 6.90764 8.74233 8.51602 8.85626C10.5265 8.99876 11.332 9.23606 11.2295 10.4665C11.127 11.6969 10.0063 11.9628 9.1206 11.9342C8.23485 11.9058 6.78573 11.4989 6.72949 10.4045M8.98005 5.24805V6.05187M8.98005 11.9268V12.748"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckDoubleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.875 10.375L4.5 13.125L5.26802 12.3204M12.375 4.875L7.82775 9.63877"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.625 10.375L8.25 13.125L16.125 4.875"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 1.5L7 9M14.5 1.5L10 14.5L7 9M14.5 1.5L1.5 6L7 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 1.5H14.5L9.5 7.5L15.5 14.5H11L7.5 10L3.5 14.5H1.5L6.5 8L1 1.5H5.5L8.5 5.5L12.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="4" r="0.5" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 6.5V11.5M4.5 4.5V4.51M7.5 11.5V6.5M7.5 6.5V8.5C7.5 9.5 8.5 10.5 10 10.5C11 10.5 11.5 10 11.5 9V6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
