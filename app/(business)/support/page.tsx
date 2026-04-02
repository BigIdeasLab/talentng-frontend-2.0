"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useProfile } from "@/hooks/useProfile";
import { PageLoadingState } from "@/lib/page-utils";
import { getRoleColors } from "@/lib/theme/role-colors";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  FileText,
  Headphones,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpGuideModal } from "@/components/support/HelpGuideModal";
import { useTicketCount } from "@/hooks/useSupport";

interface FAQItem {
  question: string;
  answer: string;
  roles?: ("talent" | "recruiter" | "mentor")[]; // Optional: if not specified, shows for all roles
}

interface HelpCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  id: "getting-started" | "applications" | "interviews" | "account";
}

const allFaqData: FAQItem[] = [
  // Common FAQs (all roles)
  {
    question: "How do I edit my profile?",
    answer:
      "Go to your Profile page and click the 'Edit Profile' button. You can update personal details, professional information, work experience, education, and portfolio.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to Settings > Account Security. Click on 'Change Password' and follow the prompts to update your password.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Go to Settings > Account > Delete Account. Note that this action is irreversible and all your data will be permanently removed.",
  },
  {
    question: "How do I view my support tickets?",
    answer:
      "Click on 'My Tickets' button on the support page to view all your support requests. You can filter by status and view conversation history.",
  },

  // Talent-specific FAQs
  {
    question: "How do I apply for opportunities?",
    answer:
      "Browse opportunities in the Opportunities tab. Click on any opportunity to view details and click the 'Apply' button to submit your application with your portfolio.",
    roles: ["talent"],
  },
  {
    question: "How do I track my applications?",
    answer:
      "Go to the Applications page to view all your submitted applications. You can see the status of each application and any interview invitations.",
    roles: ["talent"],
  },
  {
    question: "How do I prepare for interviews?",
    answer:
      "Once you receive an interview invitation, you'll find the date, time, and meeting link in your Calendar. Review the opportunity details and prepare your portfolio beforehand.",
    roles: ["talent"],
  },
  {
    question: "How do I withdraw an application?",
    answer:
      "Go to your Applications page, find the application you want to withdraw, and click on it to see the withdrawal option.",
    roles: ["talent"],
  },

  // Recruiter-specific FAQs
  {
    question: "How do I post an opportunity?",
    answer:
      "Go to the Opportunities page and click 'Post Opportunity'. Fill in the job details, requirements, budget, and scope. Your opportunity will be visible to talent once published.",
    roles: ["recruiter"],
  },
  {
    question: "How do I review applicants?",
    answer:
      "Go to the Applicants page to view all applications for your opportunities. You can filter by status, review profiles, and shortlist candidates.",
    roles: ["recruiter"],
  },
  {
    question: "How do I schedule interviews with candidates?",
    answer:
      "From the Applicants page, select a candidate and click 'Schedule Interview'. Choose a date, time, and add a meeting link. The candidate will be notified automatically.",
    roles: ["recruiter"],
  },
  {
    question: "How do I verify my business?",
    answer:
      "Go to Profile > Verification tab. Submit your business registration documents and contact information. Verification typically takes 2-3 business days.",
    roles: ["recruiter"],
  },
  {
    question: "How do I discover talent?",
    answer:
      "Use the Discover Talent page to browse profiles. You can filter by skills, experience, location, and availability to find the perfect match for your opportunities.",
    roles: ["recruiter"],
  },

  // Mentor-specific FAQs
  {
    question: "How do I set my availability?",
    answer:
      "Go to the Availability page to set your available time slots for mentorship sessions. Update your calendar regularly to help mentees book sessions.",
    roles: ["mentor"],
  },
  {
    question: "How do I manage mentorship sessions?",
    answer:
      "View all your upcoming and past sessions in the Sessions page. You can see session details, meeting links, and mentee information.",
    roles: ["mentor"],
  },
  {
    question: "How do I handle session requests?",
    answer:
      "You'll receive notifications for new session requests. Review the mentee's profile and session details, then accept or decline the request.",
    roles: ["mentor"],
  },
  {
    question: "How do I update my mentorship rates?",
    answer:
      "Go to Settings > Mentorship Settings to update your hourly rates, session duration options, and areas of expertise.",
    roles: ["mentor"],
  },
];

const helpCategories: HelpCategory[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Getting Started",
    description: "Learn the basics of using Talent.ng",
    id: "getting-started",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Applications",
    description: "How to apply and manage applications",
    id: "applications",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "Interview Tips",
    description: "Prepare for your interviews",
    id: "interviews",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Account & Security",
    description: "Manage your account settings",
    id: "account",
  },
];

function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-[#E1E4EA] rounded-[12px] mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left bg-white hover:bg-[#F5F5F5] flex justify-between items-center transition-colors"
      >
        <span className="text-[13px] font-medium font-inter-tight text-black">
          {item.question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#525866] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#525866] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-[#F5F5F5] border-t border-[#E1E4EA]">
          <p className="text-[13px] font-inter-tight text-[#525866] leading-relaxed">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

function ContactForm() {
  const { activeRole } = useProfile();
  const roleColors = getRoleColors(activeRole);
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
      // Optionally redirect to ticket detail page
      setTimeout(() => {
        router.push(`/support/tickets/${data.id}`);
      }, 1500);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label
          htmlFor="category"
          className="text-[12px] font-medium font-inter-tight text-[#525866]"
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
          className="mt-1 w-full h-10 rounded-lg border border-[#E1E4EA] px-3 font-inter-tight text-[13px] focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
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
          className="text-[12px] font-medium font-inter-tight text-[#525866]"
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
          className="mt-1"
          disabled={mutation.isPending}
        />
      </div>
      <div>
        <Label
          htmlFor="message"
          className="text-[12px] font-medium font-inter-tight text-[#525866]"
        >
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Describe your issue in detail..."
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="mt-1"
          disabled={mutation.isPending}
        />
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full text-white hover:opacity-90"
        style={{ backgroundColor: roleColors.primary }}
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
    </form>
  );
}

export default function SupportPage() {
  const hasAccess = useRequireRole(["talent", "recruiter", "mentor"]);
  const { activeRole } = useProfile();
  const roleColors = getRoleColors(activeRole);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<
    "getting-started" | "applications" | "interviews" | "account" | null
  >(null);

  // Fetch active ticket count
  const { data: ticketCountData } = useTicketCount();
  const ticketCount = ticketCountData?.count || 0;

  // Filter FAQs based on active role
  const faqData = allFaqData.filter(
    (faq) => !faq.roles || faq.roles.includes(activeRole as any),
  );

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="h-[calc(100vh-60px)] md:h-screen bg-white flex flex-col">
      <div className="w-full px-4 md:px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
              Support
            </h1>
            <p className="text-[13px] font-inter-tight text-[#525866] mt-2">
              Find answers or get in touch with our support team
            </p>
          </div>
          <Link href="/support/tickets" className="relative">
            <Button
              variant="outline"
              className="text-[13px] font-inter-tight"
            >
              <FileText className="w-4 h-4 mr-2" />
              My Tickets
            </Button>
            {ticketCount > 0 && (
              <span
                className="absolute -top-2 -right-2 min-w-[20px] h-[20px] rounded-full bg-[#E63C23] text-white text-[10px] font-medium font-inter-tight flex items-center justify-center px-1.5"
              >
                {ticketCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-styled p-4 md:p-6 space-y-6">
          {/* Help Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {helpCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedGuide(category.id)}
                className="border border-[#E1E4EA] rounded-[12px] p-4 hover:bg-[#F5F5F5] transition-colors text-left"
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${roleColors.primary}15` }}
                >
                  <span style={{ color: roleColors.primary }}>
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-[13px] font-medium font-inter-tight text-black mb-1">
                  {category.title}
                </h3>
                <p className="text-[11px] font-inter-tight text-[#525866]">
                  {category.description}
                </p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="border border-[#E1E4EA] rounded-[16px] bg-white p-5">
                <h2 className="text-[15px] font-medium font-inter-tight text-black mb-4">
                  Frequently Asked Questions
                </h2>
                <div>
                  {faqData.map((item, index) => (
                    <FAQAccordion
                      key={index}
                      item={item}
                      isOpen={openFAQ === index}
                      onToggle={() =>
                        setOpenFAQ(openFAQ === index ? null : index)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="lg:col-span-1">
              <div className="border border-[#E1E4EA] rounded-[16px] bg-white p-5">
                <h2 className="text-[15px] font-medium font-inter-tight text-black mb-2">
                  Contact Support
                </h2>
                <p className="text-[12px] font-inter-tight text-[#525866] mb-4">
                  Can't find what you're looking for? Send us a message and
                  we'll get back to you.
                </p>
                <ContactForm />

                <div className="mt-4 pt-4 border-t border-[#E1E4EA]">
                  <p className="text-[12px] font-medium font-inter-tight text-black mb-3">
                    Other ways to reach us:
                  </p>
                  <div className="space-y-2">
                    <a
                      href="mailto:support@talent.ng"
                      className="flex items-center gap-2 text-[12px] font-inter-tight text-[#525866] hover:opacity-70 transition-opacity"
                      style={{ color: roleColors.primary }}
                    >
                      <Mail className="w-4 h-4" />
                      support@talent.ng
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Guide Modal */}
      {selectedGuide && (
        <HelpGuideModal
          isOpen={!!selectedGuide}
          onClose={() => setSelectedGuide(null)}
          category={selectedGuide}
          role={activeRole as "talent" | "recruiter" | "mentor"}
        />
      )}
    </div>
  );
}
