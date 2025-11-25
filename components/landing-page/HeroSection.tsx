"use client";

import React, { useState } from "react";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"recruiting" | "freelancers">(
    "recruiting",
  );

  return (
    <section className="w-full max-w-[1008px] mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col items-center gap-8">
        {/* Toggle Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("recruiting")}
            className={`text-lg md:text-xl font-medium font-geist transition-colors ${
              activeTab === "recruiting" ? "text-black" : "text-gray-400"
            }`}
          >
            For Recruiting
          </button>

          <button
            onClick={() =>
              setActiveTab(
                activeTab === "recruiting" ? "freelancers" : "recruiting",
              )
            }
            className="relative"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 md:w-16 md:h-16"
            >
              <g clipPath="url(#clip0_toggle)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.6665 16C14.423 16 10.3534 17.6857 7.3528 20.6863C4.35221 23.6869 2.6665 27.7565 2.6665 32C2.6665 36.2435 4.35221 40.3131 7.3528 43.3137C10.3534 46.3143 14.423 48 18.6665 48H45.3332C49.5766 48 53.6463 46.3143 56.6469 43.3137C59.6475 40.3131 61.3332 36.2435 61.3332 32C61.3332 27.7565 59.6475 23.6869 56.6469 20.6863C53.6463 17.6857 49.5766 16 45.3332 16H18.6665ZM18.6665 42.6667C21.4955 42.6667 24.2086 41.5429 26.209 39.5425C28.2094 37.5421 29.3332 34.829 29.3332 32C29.3332 29.171 28.2094 26.4579 26.209 24.4575C24.2086 22.4571 21.4955 21.3333 18.6665 21.3333C15.8375 21.3333 13.1244 22.4571 11.124 24.4575C9.12364 26.4579 7.99984 29.171 7.99984 32C7.99984 34.829 9.12364 37.5421 11.124 39.5425C13.1244 41.5429 15.8375 42.6667 18.6665 42.6667Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_toggle">
                  <rect width="64" height="64" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>

          <button
            onClick={() => setActiveTab("freelancers")}
            className={`text-lg md:text-xl font-normal font-geist transition-colors ${
              activeTab === "freelancers" ? "text-black" : "text-gray-400"
            }`}
          >
            For Freelancers
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-black text-center font-geist text-3xl md:text-4xl lg:text-[56px] font-medium leading-[120%] max-w-full">
              Unlock Your Potential with Talent.ng
            </h1>
            <p className="text-gray-500 text-center font-geist text-base md:text-xl font-light leading-[160%] tracking-[0.2px] max-w-full">
              At Talent.ng 🇳🇬, we connect individuals with opportunities,
              helping you showcase your skills and collaborate with top
              independent creatives and clients.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between w-full max-w-[900px] p-4 rounded-[44px] border border-gray-300 bg-white shadow-[0_4px_8px_0_rgba(224,224,224,0.25)]">
            <input
              type="text"
              placeholder="How can I assist you today?"
              className="flex-1 text-gray-700 font-geist text-lg md:text-xl font-normal bg-transparent border-none outline-none placeholder:text-gray-700"
            />
            <button className="flex items-center justify-center p-2 rounded-3xl bg-black hover:bg-gray-800 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_search)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 10.5C2.00012 9.1446 2.32436 7.80887 2.94569 6.60427C3.56702 5.39966 4.46742 4.3611 5.57175 3.57525C6.67609 2.78939 7.95235 2.27902 9.29404 2.08672C10.6357 1.89442 12.004 2.02576 13.2846 2.46979C14.5652 2.91382 15.7211 3.65766 16.6557 4.63925C17.5904 5.62084 18.2768 6.81171 18.6576 8.11252C19.0384 9.41333 19.1026 10.7864 18.8449 12.117C18.5872 13.4477 18.015 14.6975 17.176 15.762L20.828 19.414C21.0102 19.6026 21.111 19.8552 21.1087 20.1174C21.1064 20.3796 21.0012 20.6304 20.8158 20.8158C20.6304 21.0012 20.3796 21.1064 20.1174 21.1087C19.8552 21.111 19.6026 21.0102 19.414 20.828L15.762 17.176C14.5086 18.164 13.0024 18.7792 11.4157 18.9511C9.82905 19.123 8.22602 18.8448 6.79009 18.1482C5.35417 17.4517 4.14336 16.3649 3.29623 15.0123C2.44911 13.6597 1.99989 12.096 2 10.5ZM10.5 6.00001C10.2348 6.00001 9.98043 6.10537 9.79289 6.2929C9.60536 6.48044 9.5 6.73479 9.5 7.00001C9.5 7.26523 9.60536 7.51958 9.79289 7.70712C9.98043 7.89465 10.2348 8.00001 10.5 8.00001C11.163 8.00001 11.7989 8.2634 12.2678 8.73224C12.7366 9.20108 13 9.83697 13 10.5C13 10.7652 13.1054 11.0196 13.2929 11.2071C13.4804 11.3947 13.7348 11.5 14 11.5C14.2652 11.5 14.5196 11.3947 14.7071 11.2071C14.8946 11.0196 15 10.7652 15 10.5C15 9.30654 14.5259 8.16194 13.682 7.31803C12.8381 6.47412 11.6935 6.00001 10.5 6.00001Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_search">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>

        {/* Suggested Tags */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-black text-center font-geist text-base font-normal">
            Suggested:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="px-2 py-2 rounded-2xl border border-gray-300 bg-gray-50 text-black text-center font-geist text-base font-normal hover:bg-gray-100 transition-colors">
              Product Designer
            </button>
            <button className="px-2 py-2 rounded-2xl border border-gray-300 bg-gray-50 text-black text-center font-geist text-base font-normal hover:bg-gray-100 transition-colors">
              Website Designs
            </button>
            <button className="px-2 py-2 rounded-2xl border border-gray-300 bg-gray-50 text-black text-center font-geist text-base font-normal hover:bg-gray-100 transition-colors">
              Brand Designers
            </button>
            <button className="px-2 py-2 rounded-2xl border border-gray-300 bg-gray-50 text-black text-center font-geist text-base font-normal hover:bg-gray-100 transition-colors">
              Website Development
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
