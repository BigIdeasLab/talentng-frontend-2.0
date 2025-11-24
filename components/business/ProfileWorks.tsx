"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";

const tabs = [
  { id: "works", label: "My Works" },
  { id: "services", label: "Services" },
  { id: "recommendation", label: "Recommendation" },
  { id: "saved", label: "Saved Opportunities" },
];

const workImages = [
  "https://api.builder.io/api/v1/image/assets/TEMP/8e47aeb4bf8eb4252a294ad2ecc824642c0cfa73?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/a2ace60a3af9adf213b81ceface0c1a1bf65b543?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/24d5c21ec2ebd17e6189e657f3446157c2266c75?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/d51023dfbd4c356b257c150304a020d0089bae2f?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/3764c0e5491c2e760086d695d4e3000de60a6654?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/475942973937d9661cc8dc7b4b2255602469cb95?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/bfbbd4fd1ce22967b4ac9bd719ef245856441a5d?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/527dc1da900b1360812b6c1d26ee8de85d6bcc09?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/3290a5f00028b619afafebe0426a29d08013587e?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/2bdfe1e052f4c7bacc79ae2f9f71f7ab9275e8a1?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/f54e6f2af06a88b4db53b489a0f3095d9efffc1a?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/1bda5a7218351079864215d9ae077d45d8670ef3?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/094de69698afbb6e1415404dc74e95c226b46e88?width=527",
  "https://api.builder.io/api/v1/image/assets/TEMP/ecfd58cb903f5ce87ad615b9723f5cbb381a70d3?width=527",
];

export function ProfileWorks() {
  const [activeTab, setActiveTab] = useState("works");

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="border-b border-[#E1E4EA]">
        <div className="flex items-center justify-between px-0 h-[67px]">
          <div className="flex items-center gap-2.5 h-[55px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-[22px] text-[15px] font-medium font-[Inter_Tight] transition-colors relative ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-black/30"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />
                )}
              </button>
            ))}
          </div>

          <button className="mr-5 flex items-center gap-2 px-[15px] py-[13px] bg-[#5C30FF] border border-[#5C30FF] rounded-[30px] hover:bg-[#5C30FF]/90 transition-colors">
            <Plus className="w-5 h-5 text-white" strokeWidth={1.25} />
            <span className="text-[15px] text-white font-[Inter_Tight]">
              Add New Work
            </span>
          </button>
        </div>
      </div>

      <div className="p-[20px] pl-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[3px] max-w-[796px]">
          {workImages.map((image, index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={image}
                alt={`Work ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
