"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentUploadResponse } from "@/lib/api/verification";

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<DocumentUploadResponse>;
  onRemove: (documentId: string) => void;
  documents: DocumentUploadResponse[];
  maxFiles?: number;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export function DocumentUploader({
  onUpload,
  onRemove,
  documents,
  maxFiles = 5,
  maxSizeMB = 10,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload PDF, JPG, or PNG files.`;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File size must be less than ${maxSizeMB}MB. Current size: ${sizeMB.toFixed(1)}MB`;
    }

    if (documents.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const newErrors: Record<string, string> = {};

      for (const file of fileArray) {
        const error = validateFile(file);

        if (error) {
          newErrors[file.name] = error;
          continue;
        }

        setUploadingFiles((prev) => new Set(prev).add(file.name));

        try {
          await onUpload(file);
          setErrors((prev) => {
            const updated = { ...prev };
            delete updated[file.name];
            return updated;
          });
        } catch (error) {
          newErrors[file.name] =
            error instanceof Error ? error.message : "Upload failed";
        } finally {
          setUploadingFiles((prev) => {
            const updated = new Set(prev);
            updated.delete(file.name);
            return updated;
          });
        }
      }

      setErrors((prev) => ({ ...prev, ...newErrors }));
    },
    [documents.length, maxFiles, maxSizeMB, onUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (documentId: string) => {
      onRemove(documentId);
      setErrors((prev) => {
        const updated = { ...prev };
        const doc = documents.find((d) => d.documentId === documentId);
        if (doc) {
          delete updated[doc.filename];
        }
        return updated;
      });
    },
    [documents, onRemove],
  );

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 md:p-6 transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50",
          documents.length >= maxFiles && "opacity-50 cursor-not-allowed",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(",")}
          onChange={handleFileSelect}
          disabled={documents.length >= maxFiles}
          className="sr-only"
          id="document-upload"
          aria-label="Upload verification documents"
        />

        <label
          htmlFor="document-upload"
          className={cn(
            "flex flex-col items-center cursor-pointer",
            documents.length >= maxFiles && "cursor-not-allowed",
          )}
        >
          <Upload className="h-10 w-10 text-gray-400 mb-3" aria-hidden="true" />
          <p className="font-inter-tight text-[13px] font-medium text-gray-700 mb-1 text-center">
            Drop files here or click to upload
          </p>
          <p className="font-inter-tight text-[11px] text-gray-500 text-center">
            PDF, JPG, or PNG up to {maxSizeMB}MB (max {maxFiles} files)
          </p>
        </label>
      </div>

      {/* Error Messages */}
      {Object.entries(errors).length > 0 && (
        <div className="space-y-2">
          {Object.entries(errors).map(([filename, error]) => (
            <div
              key={filename}
              className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-inter-tight text-[13px] font-medium text-red-800 break-words">{filename}</p>
                <p className="font-inter-tight text-[11px] text-red-700">{error}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-inter-tight text-[13px] font-medium text-gray-700">
            Uploaded Documents ({documents.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.documentId}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md"
              >
                <FileText
                  className="h-5 w-5 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-inter-tight text-[13px] font-medium text-gray-900 truncate">
                    {doc.filename}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(doc.documentId)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Remove ${doc.filename}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploadingFiles).map((filename) => (
            <div
              key={filename}
              className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md"
            >
              <Loader2
                className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0"
                aria-hidden="true"
              />
              <p className="font-inter-tight text-[13px] text-blue-900 break-words">Uploading {filename}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
