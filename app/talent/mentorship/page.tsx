"use client";
import React, { useState } from "react";
import { OutstandingMentors } from "@/components/mentorship/OutstandingMentors";

export default function Mentorship() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top section with title and apply button */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-black font-geist">Mentorship</h1>
        <button className="flex px-[27px] py-2.5 items-center gap-[27px] rounded-[20px] bg-black">
          <span className="text-base font-medium text-white font-geist">
            Apply to be a Mentor
          </span>
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex px-3 py-3 justify-between items-center self-stretch rounded-[44px] border border-[#D0D5DD] bg-white shadow-[0px_4px_8px_0px_rgba(224,224,224,0.25)]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Looking for?"
            className="text-base font-normal text-[#344054] font-geist w-full focus:outline-none"
          />
          <div className="flex px-[6.4px] py-[6.4px] items-center gap-2 rounded-[19.2px] bg-black">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_search)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 8.79942C2.00009 7.7151 2.25949 6.64651 2.75656 5.68283C3.25362 4.71914 3.97393 3.8883 4.8574 3.25961C5.74087 2.63092 6.76188 2.22263 7.83524 2.06879C8.90859 1.91495 10.0032 2.02002 11.0277 2.37524C12.0522 2.73047 12.9768 3.32554 13.7246 4.11081C14.4723 4.89608 15.0214 5.84879 15.3261 6.88943C15.6307 7.93008 15.6821 9.02849 15.4759 10.093C15.2697 11.1576 14.812 12.1574 14.1408 13.009L17.0624 15.9306C17.2081 16.0815 17.2888 16.2836 17.2869 16.4933C17.2851 16.7031 17.201 16.9037 17.0527 17.0521C16.9043 17.2004 16.7037 17.2845 16.4939 17.2864C16.2842 17.2882 16.0821 17.2075 15.9312 17.0618L13.0096 14.1402C12.0069 14.9306 10.8019 15.4228 9.53258 15.5603C8.26324 15.6979 6.98082 15.4753 5.83207 14.918C4.68333 14.3607 3.71468 13.4913 3.03699 12.4093C2.35929 11.3272 1.99991 10.0762 2 8.79942ZM8.8 5.19942C8.58783 5.19942 8.38434 5.28371 8.23431 5.43374C8.08429 5.58377 8 5.78725 8 5.99942C8 6.21159 8.08429 6.41508 8.23431 6.56511C8.38434 6.71514 8.58783 6.79942 8.8 6.79942C9.33043 6.79942 9.83914 7.01014 10.2142 7.38521C10.5893 7.76028 10.8 8.26899 10.8 8.79942C10.8 9.01159 10.8843 9.21508 11.0343 9.36511C11.1843 9.51514 11.3878 9.59942 11.6 9.59942C11.8122 9.59942 12.0157 9.51514 12.1657 9.36511C12.3157 9.21508 12.4 9.01159 12.4 8.79942C12.4 7.84464 12.0207 6.92897 11.3456 6.25384C10.6705 5.57871 9.75478 5.19942 8.8 5.19942Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_search">
                  <rect
                    width="19.2"
                    height="19.2"
                    fill="white"
                    transform="translate(0.399902 0.399902)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <OutstandingMentors />
    </div>
  );
}
