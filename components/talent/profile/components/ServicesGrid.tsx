"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Briefcase, Star, MoreVertical, Loader } from "lucide-react";
import { useToast } from "@/hooks";
import { EmptyState } from "./EmptyState";
import { useMyServices } from "@/hooks/useTalentApi";
import { deleteService } from "@/lib/api/talent";
import type { Service } from "@/lib/api/talent";

interface ServicesGridProps {
  onServiceClick?: (service: Service) => void;
  onAddService?: () => void;
  onEditService?: (service: Service) => void;
  onServiceDeleted?: () => void;
  refreshTrigger?: number;
  cachedServices?: Service[];
  onServicesLoaded?: (services: Service[]) => void;
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

const PLACEHOLDER_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/006e1249db9b7d609ae3b3246ecaa7c825dfa329?width=518";

export function ServicesGrid({
  onServiceClick,
  onAddService,
  onEditService,
  onServiceDeleted,
  refreshTrigger,
  cachedServices = [],
  onServicesLoaded,
  isLoading: parentIsLoading = false,
  onLoadingChange,
}: ServicesGridProps) {
  const { toast } = useToast();
  const {
    data: hookServices,
    isLoading: hookIsLoading,
    error: hookError,
  } = useMyServices();
  const [services, setServices] = useState<Service[]>(cachedServices);
  const [isLoading, setIsLoading] = useState(
    parentIsLoading && cachedServices.length === 0,
  );
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (serviceId: string) => {
    setOpenMenuId(null);

    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setDeletingId(serviceId);
    try {
      await deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast({
        title: "Service deleted",
        description: "The service has been removed.",
      });
      onServiceDeleted?.();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete service",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (hookServices) {
      setServices(hookServices);
      onServicesLoaded?.(hookServices);
      setError(null);
    }
    if (hookIsLoading) {
      setIsLoading(true);
      onLoadingChange?.(true);
    } else {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
    if (hookError) {
      const errorStatus = (hookError as Error & { status?: number })?.status;
      let errorMessage = "";

      if (errorStatus === 404) {
        // Services endpoint may not exist yet or talent profile not found
        setServices([]);
        onServicesLoaded?.([]);
        setError(null);
        return;
      } else if (errorStatus === 401) {
        errorMessage = "Please log in to view your services";
      } else if (errorStatus === 403) {
        errorMessage = "You don't have permission to view these services";
      } else {
        errorMessage =
          hookError instanceof Error
            ? hookError.message
            : "Failed to load services";
      }
      setError(errorMessage);
      setServices([]);
    }
  }, [
    hookServices,
    hookIsLoading,
    hookError,
    onLoadingChange,
    onServicesLoaded,
  ]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading services...</div>
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
              setServices(cachedServices);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <EmptyState
        title="No services added yet"
        description="Add services that showcase your expertise. Clear service offerings help clients find you."
        buttonText="Add Service"
        onButtonClick={onAddService}
      />
    );
  }

  return (
    <div className="w-full px-[15px] py-[15px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[10px] gap-y-[20px]">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative flex flex-col items-start gap-[8px] text-left"
          >
            {/* Service Image */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              <button
                onClick={() => onServiceClick?.(service)}
                className="relative w-full h-full"
              >
                <Image
                  src={service.images?.[0] || PLACEHOLDER_IMAGE}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </button>

              {/* 3-Dot Menu Button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === service.id ? null : service.id)
                  }
                  className="p-2 bg-white text-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === service.id && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded shadow-lg border border-gray-200 z-40 min-w-[120px]">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onServiceClick?.(service);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        onEditService?.(service);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {deletingId === service.id ? (
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

            {/* Service Details */}
            <button
              onClick={() => onServiceClick?.(service)}
              className="flex flex-col items-start gap-[12px] w-full hover:opacity-80 transition-opacity"
            >
              {/* Title */}
              <h3 className="text-[15px] font-medium leading-normal font-inter-tight text-black">
                {service.title}
              </h3>

              {/* Price */}
              {service.price && (
                <div className="flex items-center gap-[4px]">
                  <Briefcase
                    className="w-[16px] h-[16px]"
                    strokeWidth={1.2}
                    color="rgba(0, 0, 0, 0.3)"
                  />
                  <span className="text-[13px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)]">
                    ₦{Number(service.price).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-[4px]">
                  {service.tags.slice(0, 3).map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex px-[10px] py-[8px] justify-center items-center rounded-[30px] bg-[#F5F5F5]"
                    >
                      <span className="text-[11px] font-normal leading-[105%] font-inter-tight text-black">
                        {tag}
                      </span>
                    </div>
                  ))}
                  {service.tags.length > 3 && (
                    <div className="flex px-[10px] py-[8px] justify-center items-center rounded-[30px] bg-[#F5F5F5]">
                      <span className="text-[11px] font-normal leading-[105%] font-inter-tight text-black">
                        +{service.tags.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Rating */}
              {service.totalReviews > 0 && (
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-[13px] font-medium text-black">
                      {service.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-500">
                    ({service.totalReviews} reviews)
                  </span>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
