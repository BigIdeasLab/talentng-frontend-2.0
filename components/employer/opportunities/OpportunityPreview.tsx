"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export function OpportunityPreview() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/opportunities");
  };

  const handlePost = () => {
    console.log("Posting opportunity...");
    router.push("/opportunities");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1169px] mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 pb-6 border-b border-gray-100 mb-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-inter-tight text-[20px] font-medium text-black">
              Post An Opportunity
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 border border-[#F5F5F5] rounded-full font-inter-tight text-[16px] font-normal text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                className="px-6 py-2.5 bg-[#5C30FF] border border-[#5C30FF] rounded-full font-inter-tight text-[16px] font-normal text-white hover:bg-[#4a26cc] transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-8 lg:gap-9">
          {/* Left Column - Job Details */}
          <div className="flex flex-col gap-12">
            {/* Job Header */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ac611f16c20ce30fd01ad9af988e5821beb576eb?width=180"
                  alt="Company Logo"
                  className="w-[90px] h-[90px] rounded-full object-cover"
                />
                <div className="flex flex-col gap-4">
                  <h2 className="font-inter-tight text-[20px] font-medium text-black leading-5">
                    Mobile App Designer Intern
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="font-inter-tight text-[18px] font-normal text-black/30">
                      Favro
                    </span>
                    <span className="font-inter-tight text-[18px] font-normal text-black/30">
                      •
                    </span>
                    <span className="font-inter-tight text-[18px] font-normal text-black/30">
                      Nov 17
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-3.5 rounded-lg bg-[#008B47]/[0.09] w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#008B47]" />
                  <span className="font-inter-tight text-[14px] font-normal text-[#008B47]">
                    Internship
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {["Mobile App Design", "User Research", "Visual Design", "Wireframing"].map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="font-inter-tight text-[14px] font-normal text-black"
                    >
                      {skill}
                      {index < 3 && (
                        <span className="ml-1.5 text-gray-300">•</span>
                      )}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* About the Internship */}
            <div className="flex flex-col gap-6">
              <h3 className="font-inter-tight text-[18px] font-medium text-black leading-[105%]">
                About the Internship
              </h3>
              <p className="font-inter-tight text-[15px] font-normal text-black leading-[170%]">
                Favro is looking for a creative Mobile App Designer Intern to
                help improve and reimagine core experiences across our shopping
                app. You'll be working with senior designers to explore
                concepts, refine flows, and deliver pixel-perfect screens.
              </p>
            </div>

            {/* What You'll Do */}
            <div className="flex flex-col gap-6">
              <h3 className="font-inter-tight text-[18px] font-medium text-black leading-[105%]">
                What You'll Do
              </h3>
              <div className="font-inter-tight text-[15px] font-normal text-black leading-[170%] whitespace-pre-line">
                {`Basic experience with Figma
Strong interest in mobile UI/UX
Understanding of visual hierarchy and layout
Ability to learn quickly and work with feedback`}
              </div>
            </div>

            {/* Requirements */}
            <div className="flex flex-col gap-6">
              <h3 className="font-inter-tight text-[18px] font-medium text-black leading-[105%]">
                Requirements
              </h3>
              <div className="font-inter-tight text-[15px] font-normal text-black leading-[170%] whitespace-pre-line">
                {`Basic experience with Figma
Strong interest in mobile UI/UX
Understanding of visual hierarchy and layout
Ability to learn quickly and work with feedback`}
              </div>
            </div>

            {/* Tools Needed */}
            <div className="flex flex-col gap-6">
              <h3 className="font-inter-tight text-[18px] font-medium text-black leading-[105%]">
                Tools Needed
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    name: "Figma",
                    icon: "https://api.builder.io/api/v1/image/assets/TEMP/0a2c660d363dc6dd7201ee36e9ceeddd1f726bdd?width=40",
                  },
                  {
                    name: "Rive",
                    icon: "https://api.builder.io/api/v1/image/assets/TEMP/f8c5a221d6ec444ba0283931e0cc6e5bbb3502f6?width=40",
                  },
                  {
                    name: "Webflow",
                    icon: "https://api.builder.io/api/v1/image/assets/TEMP/315e778f2753675e0adddf444221a4bf2e5b1275?width=40",
                  },
                  {
                    name: "Lottie",
                    icon: "https://api.builder.io/api/v1/image/assets/TEMP/04c6a4c6cfe4544abfa760fd941de9a7af534b65?width=40",
                  },
                  {
                    name: "Framer",
                    icon: "https://api.builder.io/api/v1/image/assets/TEMP/77cd743c9e6b1f0fc14e22925b550692f6e2fbdc?width=40",
                  },
                ].map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <div className="flex items-center gap-1.5">
                      <img
                        src={tool.icon}
                        alt={tool.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-inter-tight text-[14px] font-normal text-black">
                        {tool.name}
                      </span>
                    </div>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.75 3.25L3.25044 9.74957M9.74957 9.75L3.25 3.25046"
                        stroke="#606060"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Job Card */}
          <div className="flex flex-col gap-2.5">
            <div className="border border-[#E1E4EA] rounded-[20px] p-6 flex flex-col gap-5">
              {/* Budget */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-inter-tight text-[20px] font-medium text-black">
                    $50 - $70 / hr
                  </span>
                  <span className="font-inter-tight text-[20px] font-medium text-black">
                    •
                  </span>
                  <span className="font-inter-tight text-[20px] font-medium text-black">
                    2 Weeks
                  </span>
                </div>
                <span className="font-inter-tight text-[14px] font-light text-[#525866]">
                  Budget
                </span>
              </div>

              {/* Job Type */}
              <div className="flex items-center gap-2.5">
                <div className="w-[35px] h-[35px] rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
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
                <div className="flex flex-col gap-2.5">
                  <span className="font-inter-tight text-[15px] font-medium text-black">
                    Full - Time
                  </span>
                  <span className="font-inter-tight text-[14px] font-light text-[#525866]">
                    Internship
                  </span>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-center gap-2.5">
                <div className="w-[35px] h-[35px] rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
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
                <div className="flex flex-col gap-2.5">
                  <span className="font-inter-tight text-[15px] font-medium text-black">
                    Nov 18 2025
                  </span>
                  <span className="font-inter-tight text-[14px] font-light text-[#525866]">
                    Start Date
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2.5">
                <div className="w-[35px] h-[35px] rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
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
                <div className="flex flex-col gap-2.5">
                  <span className="font-inter-tight text-[15px] font-medium text-black">
                    Remote
                  </span>
                  <span className="font-inter-tight text-[14px] font-light text-[#525866]">
                    Location
                  </span>
                </div>
              </div>

              {/* Experience Level */}
              <div className="flex items-center gap-2.5">
                <div className="w-[35px] h-[35px] rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
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
                <div className="flex flex-col gap-2.5">
                  <span className="font-inter-tight text-[15px] font-medium text-black">
                    Experience Level
                  </span>
                  <span className="font-inter-tight text-[14px] font-light text-[#525866]">
                    Junior
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-5">
                <button className="flex-1 h-[60px] flex items-center justify-center gap-2 bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[18px] font-normal text-white hover:bg-[#2a2d35] transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Save
                </button>
                <button className="flex-1 h-[60px] flex items-center justify-center gap-2.5 bg-[#5C30FF] border border-[#5C30FF] rounded-full font-inter-tight text-[18px] font-normal text-white hover:bg-[#4a26cc] transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 14L8.5 17.5L19 6.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
