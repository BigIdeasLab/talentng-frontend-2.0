"use client";

import Image from "next/image";
import type { GalleryItem } from "@/lib/api/talent/types";

interface TalentWorksGridProps {
  gallery: GalleryItem[];
  onItemClick?: (item: GalleryItem) => void;
}

export function TalentWorksGrid({
  gallery,
  onItemClick,
}: TalentWorksGridProps) {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <p className="text-gray-500">No portfolio items yet</p>
      </div>
    );
  }

  const itemsWithImages = gallery.filter(
    (item) => (item.images && item.images.length > 0) || (item as any).url,
  );

  if (itemsWithImages.length === 0) {
    return (
      <div className="flex items-center justify-center p-[25px] min-h-[400px]">
        <p className="text-gray-500">No portfolio items yet</p>
      </div>
    );
  }

  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] auto-rows-max">
        {itemsWithImages.map((item) => (
          <div
            key={item.id}
            className="group relative w-full overflow-hidden rounded-lg bg-gray-100"
            style={{
              aspectRatio: "4/3",
            }}
          >
            <button
              onClick={() => onItemClick?.(item)}
              className="relative w-full h-full overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <Image
                src={item.images?.[0] || (item as any).url}
                alt={item.title || "Portfolio item"}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
