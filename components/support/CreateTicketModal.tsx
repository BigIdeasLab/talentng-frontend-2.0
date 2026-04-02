"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { Send, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "other" as
      | "account"
      | "payment"
      | "technical"
      | "application_help"
      | "interview_support"
      | "profile_settings"
      | "verification_issues"
      | "feature_request"
      | "report_bug"
      | "other",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient("/support/tickets", {
        method: "POST",
        body: {
          subject: data.subject,
          message: data.message,
          category: data.category,
        },
      });
      return response;
    },
    onSuccess: (data: any) => {
      toast.success(
        `Ticket created successfully! Ticket ID: ${data.ticketId}`,
      );
      setFormData({ subject: "", message: "", category: "other" });
      onClose();
      // Redirect to ticket detail page
      setTimeout(() => {
        router.push(`/support/tickets/${data.id}`);
      }, 500);
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to create ticket. Please try again.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !mutation.isPending) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full h-full md:h-auto md:rounded-[17px] md:max-w-[515px] md:mx-4 md:max-h-[95vh] md:shadow-[0_0_15px_0_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[16px] pt-[20px] pb-[16px] flex-shrink-0 border-b md:border-b-0 border-[#E1E4EA]">
          <button
            onClick={onClose}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            disabled={mutation.isPending}
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
            <h2 className="text-black text-center font-inter-tight text-[15px] font-medium leading-[15px]">
              Contact Support
            </h2>
            <p className="text-[#99A0AE] text-center font-inter-tight text-[11px] font-normal">
              Send us a message and we'll get back to you
            </p>
          </div>
          <div className="w-[20px]" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-styled px-[16px] pt-[20px] pb-[20px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="category"
                className="text-[13px] font-medium font-inter-tight text-black mb-2 block"
              >
                Category
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as typeof formData.category,
                  }))
                }
                className="w-full h-[44px] rounded-[8px] border border-[#E1E4EA] px-3 font-inter-tight text-[13px] text-black focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent bg-white"
                disabled={mutation.isPending}
              >
                <option value="account">Account Issues</option>
                <option value="payment">Payment & Billing</option>
                <option value="technical">Technical Support</option>
                <option value="application_help">Application Help</option>
                <option value="interview_support">Interview Support</option>
                <option value="profile_settings">Profile & Settings</option>
                <option value="verification_issues">Verification Issues</option>
                <option value="feature_request">Feature Request</option>
                <option value="report_bug">Report a Bug</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label
                htmlFor="subject"
                className="text-[13px] font-medium font-inter-tight text-black mb-2 block"
              >
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="What do you need help with?"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="h-[44px] rounded-[8px] border-[#E1E4EA] font-inter-tight text-[13px] focus:ring-2 focus:ring-[#5C30FF]"
                disabled={mutation.isPending}
              />
            </div>
            <div>
              <Label
                htmlFor="message"
                className="text-[13px] font-medium font-inter-tight text-black mb-2 block"
              >
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail..."
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                className="rounded-[8px] border-[#E1E4EA] font-inter-tight text-[13px] focus:ring-2 focus:ring-[#5C30FF] resize-none"
                disabled={mutation.isPending}
              />
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E1E4EA]">
            <p className="text-[13px] font-medium font-inter-tight text-black mb-3">
              Other ways to reach us:
            </p>
            <a
              href="mailto:support@talent.ng"
              className="flex items-center gap-2 text-[13px] font-inter-tight text-[#5C30FF] hover:opacity-70 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              support@talent.ng
            </a>
          </div>
        </div>

        {/* Footer - Mobile sticky, desktop normal */}
        <div className="px-[16px] pb-[20px] pt-[12px] border-t border-[#E1E4EA] flex-shrink-0 md:static sticky bottom-0 bg-white">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full h-[44px] bg-[#5C30FF] hover:bg-[#4a24d6] text-white text-[13px] font-inter-tight rounded-[20px]"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
