"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { submitApplication } from "@/lib/api/applications";
import type { DisplayOpportunity } from "./types";

interface ApplicationModalProps {
  isOpen: boolean;
  opportunity: DisplayOpportunity | null;
  onClose: () => void;
  onSubmit?: () => void;
}

interface Attachment {
  fileName: string;
  file: File;
}

export function ApplicationModal({
  isOpen,
  opportunity,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!opportunity) return null;

  const noteLength = note.length;
  const isValidNote = noteLength === 0 || (noteLength >= 10 && noteLength <= 500);
  const isFormValid = isValidNote;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newAttachments = files.map((file) => ({
      fileName: file.name,
      file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit application via API
      await submitApplication({
        opportunityId: opportunity.id,
        note: note.trim() || undefined,
        files: attachments.map((a) => a.file),
      });

      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setNote("");
        setAttachments([]);
        setSuccess(false);
        onSubmit?.();
        onClose();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit application";
      setError(message);
      console.error("Application submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNote("");
      setAttachments([]);
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (success) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {}}
        title="Application Submitted"
        description={`Your application for "${opportunity.title}" has been submitted successfully. The opportunity poster will review your application shortly.`}
        footer={
          <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
            Done
          </Button>
        }
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[16px] w-full max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E1E4EA] px-6 py-4 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] font-medium font-inter-tight text-black">
              Apply for Opportunity
            </h2>
            <p className="text-[13px] text-[#525866] font-inter-tight">
              {opportunity.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
              <p className="text-[13px] text-red-600 font-inter-tight">
                {error}
              </p>
            </div>
          )}

          {/* Note Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium font-inter-tight text-black">
              Cover Note{" "}
              <span className="text-gray-400 font-normal">
                (Optional, 10-500 characters)
              </span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell the opportunity poster why you're interested in this role..."
              disabled={isSubmitting}
              className="w-full h-[100px] px-3 py-2.5 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[13px] resize-none focus:outline-none focus:border-[#5C30FF] disabled:bg-gray-50"
            />
            <div className="flex items-center justify-between">
              <p
                className={`text-[11px] font-inter-tight ${
                  isValidNote || noteLength === 0
                    ? "text-gray-400"
                    : "text-red-600"
                }`}
              >
                {noteLength} / 500
              </p>
              {!isValidNote && noteLength > 0 && (
                <p className="text-[11px] text-red-600 font-inter-tight">
                  {noteLength < 10
                    ? `${10 - noteLength} more characters required`
                    : "Maximum 500 characters"}
                </p>
              )}
            </div>
          </div>

          {/* File Attachments */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium font-inter-tight text-black">
              Attachments{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <p className="text-[12px] text-gray-500 font-inter-tight">
              Add resume, portfolio, or other relevant documents
            </p>

            {/* File Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#E1E4EA] rounded-[10px] hover:border-[#5C30FF] hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} className="text-gray-600" />
              <span className="text-[13px] font-inter-tight text-gray-600">
                Upload files
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isSubmitting}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
            />

            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="flex flex-col gap-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px] border border-[#E1E4EA]"
                  >
                    <span className="text-[12px] font-inter-tight text-black truncate">
                      {attachment.fileName}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      disabled={isSubmitting}
                      className="p-1 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 rounded-[10px] border border-blue-200">
            <p className="text-[12px] text-blue-900 font-inter-tight">
              <span className="font-medium">Note:</span> You can only apply once
              to this opportunity. The opportunity poster will be notified of your
              application.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#E1E4EA] px-6 py-4 flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-[#5C30FF] hover:bg-[#4a26cc] flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
