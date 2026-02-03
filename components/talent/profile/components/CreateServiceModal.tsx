"use client";

import { useState, useRef } from "react";
import { X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateService, useMyServices } from "@/hooks/useTalentApi";
import type { CreateServiceInput, Service } from "@/lib/api/talent-service";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message?: string, services?: Service[]) => void;
}

const COMMON_TAGS = [
  "UI Design",
  "UX Design",
  "Web Design",
  "Mobile Design",
  "Branding",
  "Logo Design",
  "Figma",
  "React",
  "JavaScript",
  "Frontend",
  "Responsive Design",
  "Wireframing",
  "Prototyping",
  "Design Systems",
];

export function CreateServiceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    about: "",
    price: "",
  });

  const createServiceMutation = useCreateService();
  const { refetch } = useMyServices();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = (file: File) => {
    if (images.length >= 5) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => handleAddImage(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          handleAddImage(file);
        }
      });
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setError(null);

    if (!formData.title.trim()) {
      setError("Service title is required");
      return;
    }

    if (!formData.about.trim()) {
      setError("Service description is required");
      return;
    }

    setIsLoading(true);
    try {
      const serviceData: CreateServiceInput = {
        title: formData.title,
        about: formData.about,
        price: formData.price || undefined,
        images: images.length > 0 ? images : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      await createServiceMutation.mutateAsync(serviceData);

      const { data: updatedServices } = await refetch();

      setFormData({ title: "", about: "", price: "" });
      setImages([]);
      setSelectedTags([]);
      setNewTag("");
      onClose();
      onSuccess?.(
        `Service ${isDraft ? "saved as draft" : "published"} successfully!`,
        updatedServices,
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create service";
      setError(errorMessage);
      console.error("Error creating service:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/15 flex items-center justify-center p-3">
      <div className="bg-white rounded-[16px] shadow-[0_0_12px_0_rgba(0,0,0,0.12)] w-full max-w-[880px] h-screen max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E1E4EA] flex-shrink-0">
          <h2 className="text-xl font-semibold font-inter-tight text-black capitalize leading-4">
            New Service
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"
                stroke="#606060"
                strokeWidth="2.11067"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
            {/* Left Column - Image Upload */}
            <div className="w-full md:w-[360px] p-4 flex-shrink-0">
              <div className="flex flex-col gap-4">
                {/* Upload Area */}
                <div
                  className={`relative bg-[#F5F5F5] rounded-[8px] h-[260px] flex items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? "bg-[#E5E5FF]" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {images.length === 0 ? (
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25 15C19.4844 15 15 19.4844 15 25V75C15 80.5156 19.4844 85 25 85H75C80.5156 85 85 80.5156 85 75V25C85 19.4844 80.5156 15 75 15H25ZM35 27.5C39.1406 27.5 42.5 30.8594 42.5 35C42.5 39.1406 39.1406 42.5 35 42.5C30.8594 42.5 27.5 39.1406 27.5 35C27.5 30.8594 30.8594 27.5 35 27.5ZM57.5 45C58.8125 45 60.0156 45.6875 60.7031 46.7969L74.4531 69.2969C75.1562 70.4531 75.1875 71.9062 74.5312 73.0938C73.875 74.2812 72.6094 75 71.25 75H28.75C27.3594 75 26.0625 74.2188 25.4219 72.9844C24.7812 71.75 24.875 70.25 25.6719 69.1094L34.4219 56.6094C35.125 55.6094 36.2656 55.0156 37.5 55.0156C38.7344 55.0156 39.875 55.6094 40.5781 56.6094L44.7031 62.5156L54.2969 46.8125C54.9844 45.7031 56.1875 45.0156 57.5 45.0156V45Z"
                        fill="black"
                        fillOpacity="0.3"
                      />
                    </svg>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 p-2 w-full h-full overflow-y-auto">
                      {images.map((image, idx) => (
                        <div key={idx} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover rounded-[6px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    disabled={isLoading || images.length >= 5}
                    className="hidden"
                  />
                </div>

                {/* Upload Instructions */}
                <div className="flex flex-col gap-3">
                  <div className="font-inter-tight text-base leading-normal">
                    <span className="text-[#525866]">
                      Drag and drop to upload or{" "}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#5C30FF] underline hover:no-underline"
                      disabled={isLoading || images.length >= 5}
                    >
                      browse
                    </button>
                  </div>
                  <p className="text-sm font-inter-tight text-black/30 leading-normal">
                    Min 1, Max 5 (5MB each)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="flex-1 p-4 md:px-6 md:py-5 overflow-y-auto">
              <div className="flex flex-col gap-6 max-w-[480px]">
                {/* Error Message */}
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-[8px]">
                    <p className="text-xs text-red-600 font-inter-tight">
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Service Title */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="title"
                      className="text-[14px] font-inter-tight text-[#525866] leading-normal"
                    >
                      Service Title
                    </label>
                    <div className="flex px-3 py-3.5 items-start gap-2 rounded-[8px] border border-[#E1E4EA]">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        disabled={isLoading}
                        className="flex-1 text-[14px] font-inter-tight text-black placeholder:text-black/30 leading-normal outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="about"
                      className="text-[14px] font-inter-tight text-[#525866] leading-normal"
                    >
                      Service Description
                    </label>
                    <div className="flex px-3 py-3 items-start gap-2 rounded-[8px] border border-[#E1E4EA] h-[145px]">
                      <textarea
                        id="about"
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        placeholder="Type Here"
                        disabled={isLoading}
                        className="flex-1 h-full text-[14px] font-inter-tight text-black placeholder:text-black/30 leading-[20px] outline-none bg-transparent resize-none"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="price"
                      className="text-[14px] font-inter-tight text-[#525866] leading-normal"
                    >
                      Pricing
                    </label>
                    <div className="flex px-3 py-3.5 items-start gap-2 rounded-[8px] border border-[#E1E4EA]">
                      <input
                        id="price"
                        name="price"
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="$"
                        disabled={isLoading}
                        className="flex-1 text-[14px] font-inter-tight text-black placeholder:text-black/30 leading-normal outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Add Tags */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="tags"
                      className="text-[14px] font-inter-tight text-[#525866] leading-normal"
                    >
                      Add Tags
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {/* Selected Tags */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 px-3 py-2 rounded-[8px] border border-[#E1E4EA]">
                          {selectedTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#5C30FF]/10 text-[#5C30FF] rounded-full text-xs font-inter-tight"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                disabled={isLoading}
                                className="hover:bg-[#5C30FF]/20 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tag Input */}
                      <div className="flex px-3 py-3.5 items-start gap-2 rounded-[8px] border border-[#E1E4EA]">
                        <input
                          id="tags"
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(newTag);
                            }
                          }}
                          placeholder="Add Tags"
                          disabled={isLoading}
                          className="flex-1 text-[14px] font-inter-tight text-black placeholder:text-black/30 leading-normal outline-none bg-transparent"
                        />
                      </div>

                      {/* Suggested Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_TAGS.filter(
                          (tag) => !selectedTags.includes(tag),
                        )
                          .slice(0, 6)
                          .map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleAddTag(tag)}
                              disabled={isLoading}
                              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 font-inter-tight"
                            >
                              + {tag}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 mt-auto pt-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-[60px] border border-[#F5F5F5] bg-[#F5F5F5] text-[16px] font-inter-tight text-[#525866] leading-normal transition-colors hover:bg-[#EBEBEB] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-[60px] border border-[#5C30FF] bg-[#5C30FF] text-[16px] font-inter-tight text-white leading-normal transition-colors hover:bg-[#4a26cc] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
