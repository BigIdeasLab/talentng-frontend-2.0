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
  onProjectsSelected: (projects: Project[]) => void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
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
    if (!files) return;

    const file = files[0];
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setError("Please select an image or video file");
      return;
    }

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setUploadPreview(preview);
    setError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadData.title.trim()) {
      setError("Please provide a title and select a file");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadGalleryImages(
        [selectedFile],
        uploadData.title,
        uploadData.description,
      );

      // Add the newly uploaded item to projects and select it
      if (result.gallery && result.gallery.length > 0) {
        const newItem = result.gallery[result.gallery.length - 1];
        setProjects((prev) => [...prev, newItem]);

        // Notify parent that work was uploaded
        onWorkUploaded?.(newItem);

        // Auto-select the uploaded work
        const newProject: Project = {
          id: newItem.id,
          title: newItem.title,
          image: newItem.images?.[0] || (newItem as any).url || "",
          tags: newItem.description ? [newItem.description] : [],
        };
        if (tempSelected.length < 3) {
          setTempSelected([...tempSelected, newProject]);
        }
      }

      // Reset upload form
      setSelectedFile(null);
      setUploadPreview(null);
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
    onProjectsSelected(tempSelected);
  };

  const handleClose = () => {
    setTempSelected(selectedProjects); // Reset to original selection
    setShowUploadForm(false);
    setSelectedFile(null);
    setUploadPreview(null);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
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
          <h2 className="text-black text-center font-inter-tight text-[15px] font-medium leading-[15px] capitalize">
            Select Up to 3 Project
          </h2>
          <div className="w-[20px]" /> {/* Spacer for centering */}
        </div>

        {/* Upload Section */}
        {!showUploadForm && projects.length === 0 && (
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
                Upload Work
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
              {uploadPreview && (
                <div className="w-full h-[100px] rounded-[8px] overflow-hidden bg-gray-200">
                  <img
                    src={uploadPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
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
                {selectedFile ? selectedFile.name : "Select File"}
              </button>
              <div className="flex flex-col gap-[10px]">
                <label className="text-[#525866] font-inter-tight text-[14px] font-normal">
                  Work Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter work title"
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
                  disabled={isUploading || !selectedFile}
                  className="flex-1 py-[16px] text-white rounded-[20px] font-inter-tight text-[13px] font-normal hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-[6px]"
                  style={{ backgroundColor: primary }}
                >
                  {isUploading ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setSelectedFile(null);
                    setUploadPreview(null);
                    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
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
                    <div className="flex items-center gap-[12px]">
                      {/* Project Image */}
                      <img
                        src={
                          galleryItem.images?.[0] ||
                          (galleryItem as any).url ||
                          ""
                        }
                        alt={galleryItem.title}
                        className="w-[124px] h-[93px] object-cover rounded-[7px] flex-shrink-0"
                      />

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
