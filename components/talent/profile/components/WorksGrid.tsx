"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MoreVertical, Loader } from "lucide-react";
import { useToast } from "@/hooks";
import { EmptyState } from "./EmptyState";
import { WorkDetailView } from "./WorkDetailView";
import { deleteGalleryItem, getGalleryItems } from "@/lib/api/talent";
import type { GalleryItem } from "@/lib/api/talent";

interface WorksGridProps {
  onItemClick?: (item: GalleryItem) => void;
  onAddWork?: () => void;
  onItemDeleted?: () => void;
  onEditWork?: (item: GalleryItem) => void;
  refreshTrigger?: number;
  cachedItems?: GalleryItem[];
  onItemsLoaded?: (items: GalleryItem[]) => void;
}

export function WorksGrid({
  onItemClick,
  onAddWork,
  onItemDeleted,
  onEditWork,
  refreshTrigger,
  cachedItems = [],
  onItemsLoaded,
}: WorksGridProps) {
  const { toast } = useToast();
  const [displayItems, setDisplayItems] = useState<GalleryItem[]>(cachedItems);
  const [loading, setLoading] = useState(cachedItems.length === 0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchGallery = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const gallery = await getGalleryItems();
      console.log("[WorksGrid] fetched gallery:", gallery);
      setDisplayItems(gallery);
      onItemsLoaded?.(gallery);
    } catch (err) {
      console.error("[WorksGrid] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cachedItems.length > 0) {
      // Have cache — refresh silently in the background
      fetchGallery(false);
    } else {
      fetchGallery(true);
    }
  }, [refreshTrigger]);

  const handleDelete = async (itemId: string) => {
    setError(null);
    setOpenMenuId(null);

    if (!confirm("Are you sure you want to delete this work?")) {
      return;
    }

    setDeletingId(itemId);
    try {
      await deleteGalleryItem(itemId);
      await fetchGallery();
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

  const handleViewWork = (item: GalleryItem) => {
    setSelectedItem(item);
    setOpenMenuId(null);
  };

  if (loading) {
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
              fetchGallery();
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
    <>
      <div className="w-full px-[15px] py-[15px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[10px] gap-y-[20px]">
          {displayItems.map((item) => {
            const imageUrl = item.images?.[0] || (item as any).url;
            if (!imageUrl) return null;

            return (
              <div key={item.id} className="group flex flex-col">
                <div
                  className="relative w-full overflow-hidden rounded-lg bg-gray-100"
                  style={{ aspectRatio: "4/3" }}
                >
                  {/* Card Content - Clickable to view details */}
                  <button
                    onClick={() => handleViewWork(item)}
                    className="relative w-full h-full overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    <Image
                      src={imageUrl}
                      alt={item.title || "Portfolio item"}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </button>

                  {/* 3-Dot Menu Button */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === item.id ? null : item.id)
                      }
                      className="p-2 bg-white text-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === item.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white rounded shadow-lg border border-gray-200 z-40 min-w-[120px]">
                        <button
                          onClick={() => handleViewWork(item)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            onEditWork?.(item);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {deletingId === item.id ? (
                            <>
                              <Loader className="w-3 h-3 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Title */}
                {item.title && (
                  <p className="text-[14px] font-medium font-inter-tight text-black mt-2 truncate">
                    {item.title}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Work Detail Modal */}
      {selectedItem && (
        <WorkDetailView
          work={{
            id: selectedItem.id,
            title: selectedItem.title || "Untitled Work",
            description: selectedItem.description || "",
            images:
              selectedItem.images ||
              [(selectedItem as any).url].filter(Boolean),
            createdAt: selectedItem.createdAt,
          }}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
