"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface WorkItem {
  id: string;
  url: string;
  title?: string;
  mime?: string;
}

interface WorksGridProps {
  items?: WorkItem[];
  isLoading?: boolean;
  onItemClick?: (item: WorkItem) => void;
}

const placeholderImages = [
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
  "https://api.builder.io/api/v1/image/assets/TEMP/ecfd58cb903f5ce81d615b9723f5cbb381a70d3?width=527",
];

export function WorksGrid({
  items = [],
  isLoading = false,
  onItemClick,
}: WorksGridProps) {
  const [displayItems, setDisplayItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      // Use placeholder images for demo
      const demoItems = placeholderImages.map((url, idx) => ({
        id: `placeholder-${idx}`,
        url,
        title: `Work ${idx + 1}`,
      }));
      setDisplayItems(demoItems);
    } else {
      setDisplayItems(items);
    }
  }, [items]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading portfolio...</div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">No works yet</p>
          <p className="text-sm">Start by uploading your first project</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] auto-rows-max">
        {displayItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="group relative w-full overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-all duration-200"
            style={{
              aspectRatio: "4/3",
            }}
          >
            <Image
              src={item.url}
              alt={item.title || "Portfolio item"}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
}
