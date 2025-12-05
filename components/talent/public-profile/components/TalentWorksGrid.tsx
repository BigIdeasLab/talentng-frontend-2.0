"use client";

import type { GalleryItem } from "@/lib/api/talent/types";

interface TalentWorksGridProps {
  gallery: GalleryItem[];
}

export function TalentWorksGrid({ gallery }: TalentWorksGridProps) {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-[25px]">
        <p className="text-gray-500">No portfolio items yet</p>
      </div>
    );
  }

  return (
    <div className="p-[25px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer overflow-hidden rounded-[12px] bg-gray-100"
          >
            {/* Image Container */}
            <div className="aspect-square overflow-hidden">
              <img
                src={item.url}
                alt="Portfolio item"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="px-[20px] py-[10px] bg-white text-black rounded-[8px] font-medium text-[14px]">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
