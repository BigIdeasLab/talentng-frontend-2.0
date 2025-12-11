"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./EmptyState";
import { deleteGalleryItem } from "@/lib/api/talent";
import type { GalleryItem } from "@/lib/api/talent";

interface WorksGridProps {
  items?: GalleryItem[];
  isLoading?: boolean;
  onItemClick?: (item: GalleryItem) => void;
  onAddWork?: () => void;
  onItemDeleted?: () => void;
}

export function WorksGrid({
  items = [],
  isLoading = false,
  onItemClick,
  onAddWork,
  onItemDeleted,
}: WorksGridProps) {
  const { toast } = useToast();
  const [displayItems, setDisplayItems] = useState<GalleryItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayItems(items);
  }, [items]);

  const handleDelete = async (
    e: React.MouseEvent,
    itemId: string,
  ) => {
    e.stopPropagation();
    setError(null);

    if (!confirm("Are you sure you want to delete this work?")) {
      return;
    }

    setDeletingId(itemId);
    try {
      await deleteGalleryItem(itemId);
      setDisplayItems((prev) => prev.filter((item) => item.id !== itemId));
      toast({
        title: "Success",
        description: "Work deleted successfully",
      });
      onItemDeleted?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete work";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setDisplayItems(items);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <EmptyState
        title="No work added yet"
        description="Add projects that show what you can do. A strong portfolio helps you get noticed."
        buttonText="Add Work"
        onButtonClick={onAddWork}
      />
    );
  }

  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] auto-rows-max">
        {displayItems.map((item) => (
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
                src={item.url}
                alt={item.key || "Portfolio item"}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => handleDelete(e, item.id)}
              disabled={deletingId === item.id}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
            >
              {deletingId === item.id ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
