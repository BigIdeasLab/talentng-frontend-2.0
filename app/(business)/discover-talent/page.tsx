"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Designer",
  "Developer",
  "Writer",
  "Illustrator",
  "Animator",
  "Marketing",
  "Photographer",
  "Music & Audio",
  "Content Creation",
  "Videography",
];

const talentData = [
  {
    id: 1,
    name: "Ifeoma Chijioke",
    role: "UX/UI Designer",
    location: "Lagos, Nigeria",
    timesHired: 3,
    earnings: 2800,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    portfolioImages: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/b8bd95d533bff63223ee7f301c1edda7456768df?width=490",
    ],
    skills: ["Mobile App Design", "User Research", "Visual Design", "Wireframing"],
  },
  {
    id: 2,
    name: "Chijioke Olaniyi",
    role: "Web Designer",
    location: "Abuja, Nigeria",
    timesHired: 4,
    earnings: 4200,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
    portfolioImages: [
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/b8bd95d533bff63223ee7f301c1edda7456768df?width=490",
    ],
    skills: ["Website Design", "SEO Optimization", "Responsive Design", "User Testing"],
  },
  {
    id: 3,
    name: "Oluwatobi Adeyemi",
    role: "Interaction Designer",
    location: "Port Harcourt, Nigeria",
    timesHired: 2,
    earnings: 1900,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04?width=80",
    portfolioImages: [
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/57203417be73ef060acdf909d231697c0fcd461a?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/b8bd95d533bff63223ee7f301c1edda7456768df?width=490",
    ],
    skills: ["Game Design", "Usability Testing", "3D Modeling", "Animation"],
  },
  {
    id: 4,
    name: "Seyi Olufemi",
    role: "Motion Designer",
    location: "Kaduna, Nigeria",
    timesHired: 3,
    earnings: 2400,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    portfolioImages: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/b8bd95d533bff63223ee7f301c1edda7456768df?width=490",
    ],
    skills: ["Animated UI", "Storyboarding", "Visual Effects", "Editing"],
  },
  {
    id: 5,
    name: "Dolapo Ajayi",
    role: "Product Designer",
    location: "Enugu, Nigeria",
    timesHired: 1,
    earnings: 1500,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/83f43b04c90b06f4d1b305dee8b11fc15690f090?width=80",
    portfolioImages: [
      "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=490",
    ],
    skills: ["SaaS Design", "Accessibility Design", "Information Architecture", "Sketching"],
  },
  {
    id: 6,
    name: "Temitope Adebayo",
    role: "Graphic Designer",
    location: "Ibadan, Nigeria",
    timesHired: 5,
    earnings: 3000,
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/059a9dc3d9403eb5fa0f49ed005b8b5282b27e8e?width=80",
    portfolioImages: [
      "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=490",
    ],
    skills: ["Brand Identity", "Illustration", "Typography", "Color Theory"],
  },
];

export default function DiscoverTalentPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header Section */}
      <div className="flex-shrink-0 px-[50px] pt-[25px] pb-[20px] border-b border-[#E1E4EA]">
        {/* Title */}
        <h1 className="text-[20px] font-medium text-black font-inter-tight leading-[20px] mb-[25px]">
          Discover Talent
        </h1>

        {/* Search Bar and Filter */}
        <div className="flex items-center gap-[10px] mb-[25px]">
          <div className="flex-1 max-w-[689px] h-[46px] px-[15px] py-[9px] flex items-center gap-[7px] border border-[#E1E4EA] rounded-[10px]">
            <Search className="w-[18px] h-[18px] text-[#B2B2B2]" />
            <input
              type="text"
              placeholder="Search Talent or Services or Location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-[15px] font-normal font-inter-tight placeholder:text-black/30 placeholder:capitalize border-0 focus:outline-none bg-transparent"
            />
          </div>
          <button className="h-[46px] px-[18px] py-[9px] flex items-center gap-[6px] bg-[#F5F5F5] rounded-[10px]">
            <SlidersHorizontal className="w-[18px] h-[18px] text-black" />
            <span className="text-[15px] font-normal text-black font-inter-tight">
              Filter
            </span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-[10px] overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-[15px] py-[15px] flex justify-center items-center whitespace-nowrap",
                selectedCategory === category
                  ? "text-black font-medium"
                  : "text-black/30 font-medium"
              )}
            >
              <span className="text-[15px] font-inter-tight">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Talent Grid */}
      <div className="flex-1 overflow-y-auto px-[50px] py-[20px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[9px] pb-8">
          {talentData.map((talent) => (
            <div
              key={talent.id}
              className="p-[15px_12px] flex flex-col gap-[10px] border border-[#E1E4EA] rounded-[20px] bg-white"
            >
              {/* Header */}
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[10px]">
                      <img
                        src={talent.avatar}
                        alt={talent.name}
                        className="w-[40px] h-[40px] rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-[10px]">
                        <h3 className="text-[15px] font-medium text-black font-inter-tight">
                          {talent.name}
                        </h3>
                        <p className="text-[14px] font-light text-black/30 font-inter-tight">
                          {talent.role}
                        </p>
                      </div>
                    </div>
                    <Button className="h-auto px-[10px] py-[15px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] border border-[#181B25]">
                      <span className="text-[13px] font-normal text-white font-inter-tight w-[71px]">
                        View Profile
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-[25px]">
                  <div className="flex items-center gap-[8px]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span className="text-[14px] font-normal text-[#525866] font-inter-tight leading-[20px]">
                      {talent.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span className="text-[14px] font-normal text-[#525866] font-inter-tight leading-[20px]">
                      {talent.timesHired}X Hired
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span className="text-[14px] font-normal text-[#525866] font-inter-tight leading-[20px]">
                      ${talent.earnings.toLocaleString()} Earned
                    </span>
                  </div>
                </div>

                {/* Portfolio Images */}
                <div className="flex flex-col gap-[14px]">
                  <div className="flex items-center gap-[9px]">
                    {talent.portfolioImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Portfolio ${idx + 1}`}
                        className="flex-1 h-[184px] object-cover rounded"
                      />
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-[5px] items-start">
                    {talent.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-[13px] py-[12px] flex justify-center items-center rounded-full bg-[#F5F5F5]"
                      >
                        <span className="text-[14px] font-normal text-black font-inter-tight leading-[105%]">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
