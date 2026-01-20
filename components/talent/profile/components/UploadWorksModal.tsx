"use client";

import { useState, useRef } from "react";
import { X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadGalleryImages } from "@/lib/api/talent";
import type { TalentProfile } from "@/lib/api/talent";

interface UploadWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message?: string, gallery?: any[]) => void;
}

export function UploadWorksModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadWorksModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type === "application/pdf",
    );

    const totalFiles = selectedFiles.length + newFiles.length;
    if (totalFiles > 10) {
      setError("Maximum 10 files allowed");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Generate preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
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
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedFiles.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    setIsLoading(true);
    try {
      const result = await uploadGalleryImages(selectedFiles);

      setSelectedFiles([]);
      setPreviewUrls([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      onClose();
      onSuccess?.(
        `Successfully uploaded ${selectedFiles.length} work${selectedFiles.length > 1 ? "s" : ""}!`,
        result.gallery || [],
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload works";
      setError(errorMessage);
      console.error("Error uploading gallery items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setFormData({ title: "", description: "" });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/15 flex items-center justify-center p-3">
      <div className="bg-white rounded-[16px] shadow-[0_0_12px_0_rgba(0,0,0,0.12)] w-full max-w-[880px] h-screen max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E1E4EA] flex-shrink-0">
          <h2 className="text-xl font-semibold font-inter-tight text-black capitalize leading-4">
            Add Work to Portfolio
          </h2>
          <button
            onClick={handleClose}
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
            {/* Left Column - Upload Area */}
            <div className="w-full md:w-[360px] p-4 flex-shrink-0">
              <div className="flex flex-col gap-4">
                {/* Upload Drag Area */}
                <div
                  className={`relative bg-[#F5F5F5] rounded-[8px] h-[260px] flex items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? "bg-[#E5E5FF]" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFiles.length === 0 ? (
                    <div className="flex flex-col items-center gap-2">
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
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 p-2 w-full h-full overflow-y-auto">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-square">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={previewUrls[idx]}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover rounded-[6px]"
                            />
                          ) : file.type.startsWith("video/") ? (
                            <video
                              src={previewUrls[idx]}
                              className="w-full h-full object-cover rounded-[6px]"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-[6px] flex flex-col items-center justify-center gap-1">
                              <span className="text-xl">📄</span>
                              <span className="text-xs text-gray-600 text-center px-1 break-words line-clamp-2">
                                {file.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf"
                    onChange={handleInputChange}
                    disabled={isLoading || selectedFiles.length >= 10}
                    className="hidden"
                  />
                </div>

                {/* Upload Instructions */}
                <div className="flex flex-col gap-3">
                  <div className="font-inter-tight text-base leading-normal">
                    <span className="text-[#525866]">Drag and drop or </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#5C30FF] underline hover:no-underline"
                      disabled={isLoading || selectedFiles.length >= 10}
                    >
                      browse
                    </button>
                  </div>
                  <p className="text-sm font-inter-tight text-black/30 leading-normal">
                    Max 10 files (Images, Videos, PDFs)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - File List */}
            <div className="flex-1 p-4 md:px-6 md:py-5 overflow-y-auto">
              <div className="flex flex-col gap-4 max-w-[480px]">
                {/* Error Message */}
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-[8px]">
                    <p className="text-xs text-red-600 font-inter-tight">
                      {error}
                    </p>
                  </div>
                )}

                {/* Work Title */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="title"
                    className="text-[14px] font-inter-tight text-[#525866] leading-normal"
                  >
                    Work Title
                  </label>
                  <div className="flex px-3 py-3.5 items-start gap-2 rounded-[8px] border border-[#E1E4EA]">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Enter work title"
                      disabled={isLoading}
                      className="flex-1 text-[14px] font-inter-tight text-black placeholder:text-black/30 leading-normal outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Work Description */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-[14px] font-inter-tight text-[#525866] leading-normal"
                  >
                    Work Description
                  </label>
                  <div className="flex px-3 py-3 items-start gap-2 rounded-[8px] border border-[#E1E4EA] h-[110px]">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Describe your work"
                      disabled={isLoading}
                      className="flex-1 h-full text-[14px] font-inter-tight text-black placeholder:text-black/30 leading-[20px] outline-none bg-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Files List */}
                {selectedFiles.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] font-inter-tight text-[#525866] leading-normal">
                      Files ({selectedFiles.length}/10)
                    </p>
                    <div className="flex flex-col gap-1.5 max-h-[330px] overflow-y-auto">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-[#F5F5F5] rounded-[8px] border border-[#E1E4EA]"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm flex-shrink-0">
                              {file.type.startsWith("image/")
                                ? "🖼️"
                                : file.type.startsWith("video/")
                                  ? "🎬"
                                  : "📄"}
                            </span>
                            <span className="text-[12px] font-inter-tight text-black truncate">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            disabled={isLoading}
                            className="p-0.5 hover:bg-red-100 rounded transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Box */}
                {selectedFiles.length === 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-[8px]">
                    <p className="text-[11px] text-blue-900 font-inter-tight leading-[1.4]">
                      <span className="font-medium">Tip:</span> Upload
                      high-quality images and videos that showcase your best
                      work. Supported formats: JPEG, PNG, GIF, MP4, MOV, PDF.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-start gap-2 mt-auto pt-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-[8px] border border-[#E1E4EA] bg-white text-[13px] font-inter-tight text-[#525866] leading-normal transition-colors hover:bg-[#F5F5F5] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || selectedFiles.length === 0}
                    className="flex-1 flex justify-center items-center gap-2 px-6 py-2.5 rounded-[8px] border border-[#5C30FF] bg-[#5C30FF] text-[13px] font-inter-tight text-white leading-normal transition-colors hover:bg-[#4a26cc] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-3 h-3 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? "File" : "Files"}`
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
