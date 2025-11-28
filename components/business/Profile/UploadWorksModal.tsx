"use client";

import { useState } from "react";
import { X, Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadGalleryImages } from "@/lib/api/talent";
import type { TalentProfile } from "@/lib/api/talent";

interface UploadWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message?: string) => void;
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Add Work to Portfolio</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Upload Files <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors">
              <div className="flex flex-col items-center">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 text-center">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Images, videos, or PDFs (Max 10 files)
                </span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileSelect}
                disabled={isLoading || selectedFiles.length >= 10}
                className="hidden"
              />
            </label>

            {/* File Previews */}
            {selectedFiles.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedFiles.length}/{10} files selected
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={previewUrls[idx]}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={previewUrls[idx]}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-2xl mb-1">📄</div>
                          <p className="text-xs text-gray-600 break-words">
                            {file.name}
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        disabled={isLoading}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p className="font-medium mb-2">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use high-quality images that showcase your work clearly</li>
              <li>Recommended aspect ratio: 4:3</li>
              <li>You can add descriptions later</li>
              <li>Maximum 10 files per upload session</li>
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? "File" : "Files"}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
