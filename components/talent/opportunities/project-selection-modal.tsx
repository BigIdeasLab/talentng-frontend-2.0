"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Loader, Upload } from "lucide-react";
import { useRoleColors } from "@/lib/theme/RoleColorContext";
import { getCurrentProfile, uploadGalleryImages } from "@/lib/api/talent";
import type { GalleryItem } from "@/lib/api/talent";
import type { Project } from "./application-modal";

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProjects: Project[];
  onProjectsSelected: (projects: Project[], fullGalleryItems?: any[]) => void;
  onWorkUploaded?: (newWork: GalleryItem) => void;
}

export function ProjectSelectionModal({
  isOpen,
  onClose,
  selectedProjects,
  onProjectsSelected,
  onWorkUploaded,
}: ProjectSelectionModalProps) {
  const { primary } = useRoleColors();
  const [tempSelected, setTempSelected] = useState<Project[]>(selectedProjects);
  const [projects, setProjects] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ title: "", description: "" });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempSelected(selectedProjects);
  }, [selectedProjects, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCurrentProfile();
        // API returns { profile: { gallery: [...] } } wrapper
        const profile = (response as any).profile || response;
        setProjects(profile.gallery || []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load your works";
        setError(message);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleProject = (galleryItem: GalleryItem) => {
    const isSelected = tempSelected.some((p) => p.id === galleryItem.id);
    const project: Project = {
      id: galleryItem.id,
      title: galleryItem.title,
      image: galleryItem.images?.[0] || (galleryItem as any).url || "",
      tags: galleryItem.description ? [galleryItem.description] : [],
    };

    if (isSelected) {
      setTempSelected(tempSelected.filter((p) => p.id !== galleryItem.id));
    } else {
      if (tempSelected.length < 3) {
        setTempSelected([...tempSelected, project]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const previews: string[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("Please select only image or video files");
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setUploadPreviews(previews);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !uploadData.title.trim()) {
      setError("Please provide a title and select at least one file");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadGalleryImages(
        selectedFiles,
        uploadData.title,
        uploadData.description,
      );

      // Add the newly uploaded gallery item (ONE item with multiple images)
      if (result.gallery && result.gallery.length > 0) {
        const newItem = result.gallery[result.gallery.length - 1]; // Get the last item (newly created)
        setProjects((prev) => [...prev, newItem]);

        // Notify parent about uploaded work
        onWorkUploaded?.(newItem);

        // Auto-select the uploaded work (if space available)
        const newProject: Project = {
          id: newItem.id,
          title: newItem.title,
          image: newItem.images?.[0] || "", // Use first image as thumbnail
          tags: newItem.description ? [newItem.description] : [],
        };

        if (tempSelected.length < 3) {
          setTempSelected((prev) => [...prev, newProject]);
        }
      }

      // Reset upload form
      setSelectedFiles([]);
      uploadPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setUploadPreviews([]);
      setUploadData({ title: "", description: "" });
      setShowUploadForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload work";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    onProjectsSelected(tempSelected, projects);
  };

  const handleClose = () => {
    setTempSelected(selectedProjects); // Reset to original selection
    setShowUploadForm(false);
    setSelectedFiles([]);
    uploadPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setUploadPreviews([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[17px] w-full max-w-[515px] mx-4 max-h-[95vh] shadow-[0_0_15px_0_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[16px] pt-[20px] pb-[16px] flex-shrink-0">
          <button
            onClick={handleClose}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 12.002H19"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195"
                stroke="#141B34"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center gap-[4px]">
            <h2 className="text-black text-center font-inter-tight text-[15px] font-medium leading-[15px] capitalize">
              Select Up to 3 Projects
            </h2>
            <p className="text-[#99A0AE] text-center font-inter-tight text-[11px] font-normal">
              Upload more works here if needed
            </p>
          </div>
          <div className="w-[20px]" /> {/* Spacer for centering */}
        </div>

        {/* Upload Section */}
        {!showUploadForm && (
          <div className="px-[16px] pt-[16px] pb-[16px] flex-shrink-0">
            <button
              onClick={() => setShowUploadForm(true)}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-[8px] px-[12px] py-[12px] border border-dashed rounded-[8px] hover:opacity-80 transition-colors disabled:opacity-50"
              style={{ borderColor: primary }}
            >
              <Upload size={16} style={{ color: primary }} />
              <span
                className="font-inter-tight text-[13px] font-medium"
                style={{ color: primary }}
              >
                {projects.length === 0 ? "Upload Work" : "Upload More Works"}
              </span>
            </button>
          </div>
        )}

        {showUploadForm && (
          <form
            onSubmit={handleUpload}
            className="px-[16px] pt-[16px] pb-[16px] flex-shrink-0 border-b border-[#E1E4EA]"
          >
            <div className="flex flex-col gap-[18px]">
              {uploadPreviews.length > 0 && (
                <div className="w-full flex gap-[8px] overflow-x-auto">
                  {uploadPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-[100px] h-[100px] flex-shrink-0 rounded-[8px] overflow-hidden bg-gray-200"
                    >
                      <img
                        src={preview}
                        alt={`preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = selectedFiles.filter(
                            (_, i) => i !== index,
                          );
                          const newPreviews = uploadPreviews.filter(
                            (_, i) => i !== index,
                          );
                          URL.revokeObjectURL(uploadPreviews[index]);
                          setSelectedFiles(newFiles);
                          setUploadPreviews(newPreviews);
                        }}
                        disabled={isUploading}
                        className="absolute top-1 right-1 w-[20px] h-[20px] bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.7213 3.57324L3.5747 10.7198M10.7208 10.7203L3.57422 3.57375"
                            stroke="#525866"
                            strokeWidth="1.90588"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full px-[12px] py-[16px] border border-[#E1E4EA] rounded-[8px] text-[14px] text-[#525866] hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                  : "Select Files"}
              </button>
              <div className="flex flex-col gap-[10px]">
                <label className="text-[#525866] font-inter-tight text-[14px] font-normal">
                  Work Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter work title (applies to all selected files)"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  disabled={isUploading}
                  className="w-full px-[12px] py-[12px] border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[14px] text-black placeholder:text-[#99A0AE] focus:outline-none disabled:bg-gray-50"
                  onFocus={(e) => (e.currentTarget.style.borderColor = primary)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E1E4EA")
                  }
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label className="text-[#525866] font-inter-tight text-[14px] font-normal">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  placeholder="Add a description"
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={isUploading}
                  maxLength={100}
                  className="w-full px-[12px] py-[12px] pb-[60px] border border-[#E1E4EA] rounded-[8px] font-inter-tight text-[14px] text-black placeholder:text-[#99A0AE] resize-none focus:outline-none disabled:bg-gray-50"
                  onFocus={(e) => (e.currentTarget.style.borderColor = primary)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E1E4EA")
                  }
                />
              </div>
              <div className="flex gap-[12px]">
                <button
                  type="submit"
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-1 py-[16px] text-white rounded-[20px] font-inter-tight text-[13px] font-normal hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-[6px]"
                  style={{ backgroundColor: primary }}
                >
                  {isUploading ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `Upload as 1 Work ${selectedFiles.length > 1 ? `(${selectedFiles.length} files)` : ""}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setSelectedFiles([]);
                    uploadPreviews.forEach((preview) =>
                      URL.revokeObjectURL(preview),
                    );
                    setUploadPreviews([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isUploading}
                  className="flex-1 py-[16px] border border-[#E1E4EA] rounded-[20px] text-[#525866] font-inter-tight text-[13px] font-normal hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-[16px] pb-[16px] min-h-[350px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader
                className="w-5 h-5 animate-spin"
                style={{ color: primary }}
              />
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && projects.length === 0 && !showUploadForm && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-[#525866]">No works added yet</p>
            </div>
          )}

          {!isLoading && !error && projects.length > 0 && (
            <div className="flex flex-col gap-[8px]">
              {projects.map((galleryItem) => {
                const isSelected = tempSelected.some(
                  (p) => p.id === galleryItem.id,
                );
                const displayImages = galleryItem.images?.slice(0, 3) || [];
                const hasMoreImages = (galleryItem.images?.length || 0) > 3;

                return (
                  <button
                    key={galleryItem.id}
                    onClick={() => handleToggleProject(galleryItem)}
                    className={`p-[12px] border rounded-[8px] transition-all ${
                      isSelected ? "" : "border-[#E1E4EA] hover:opacity-80"
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: primary,
                            backgroundColor: `${primary}1A`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-start gap-[12px]">
                      {/* Project Images */}
                      <div className="flex-shrink-0">
                        {displayImages.length === 1 ? (
                          // Single image - show larger
                          <img
                            src={displayImages[0]}
                            alt={galleryItem.title}
                            className="w-[124px] h-[93px] object-cover rounded-[7px]"
                          />
                        ) : (
                          // Multiple images - show grid
                          <div className="w-[124px] h-[93px] grid grid-cols-2 gap-[2px]">
                            {displayImages.map((img, idx) => (
                              <div
                                key={idx}
                                className={`relative overflow-hidden rounded-[4px] ${
                                  displayImages.length === 2
                                    ? "col-span-1"
                                    : idx === 0
                                      ? "col-span-2"
                                      : "col-span-1"
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`${galleryItem.title} ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {/* Show count badge on last image if more exist */}
                                {idx === displayImages.length - 1 &&
                                  hasMoreImages && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                      <span className="text-white font-inter-tight text-[11px] font-semibold">
                                        +{galleryItem.images!.length - 3}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Project Details */}
                      <div className="flex-1 flex flex-col items-start gap-[12px] min-w-0">
                        <h3 className="text-black font-inter-tight text-[15px] font-medium text-left line-clamp-2">
                          {galleryItem.title}
                        </h3>

                        {/* Description as tag */}
                        {galleryItem.description && (
                          <div className="flex flex-wrap items-start gap-x-[4px] gap-y-[5px]">
                            <div className="px-[10px] py-[9px] bg-[#F5F5F5] rounded-[24px]">
                              <span className="text-black text-center font-inter-tight text-[11px] font-normal leading-[105%] line-clamp-1">
                                {galleryItem.description}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Image count indicator */}
                        {(galleryItem.images?.length || 0) > 1 && (
                          <div className="flex items-center gap-[4px]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5 3.75V8.25C10.5 9.075 9.825 9.75 9 9.75H3C2.175 9.75 1.5 9.075 1.5 8.25V3.75C1.5 2.925 2.175 2.25 3 2.25H9C9.825 2.25 10.5 2.925 10.5 3.75Z"
                                stroke="#99A0AE"
                                strokeWidth="0.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M4.125 5.25C4.53921 5.25 4.875 4.91421 4.875 4.5C4.875 4.08579 4.53921 3.75 4.125 3.75C3.71079 3.75 3.375 4.08579 3.375 4.5C3.375 4.91421 3.71079 5.25 4.125 5.25Z"
                                fill="#99A0AE"
                              />
                              <path
                                d="M10.5 6.75L8.25 4.5L3 9.75"
                                stroke="#99A0AE"
                                strokeWidth="0.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-[#99A0AE] font-inter-tight text-[11px]">
                              {galleryItem.images?.length || 0} image
                              {(galleryItem.images?.length || 0) !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with selection info */}
        <div className="px-[16px] pb-[20px] pt-[12px] border-t border-[#E1E4EA] flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[#525866] font-inter-tight text-[12px]">
              {tempSelected.length} of 3 projects selected
            </p>
            <button
              onClick={handleConfirm}
              disabled={tempSelected.length === 0}
              className="px-[26px] py-[10px] text-white rounded-[24px] font-inter-tight text-[13px] font-normal hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              style={{ backgroundColor: primary }}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
