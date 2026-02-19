"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpCategory {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I create my profile?",
    answer:
      "After signing up, you'll be directed to complete your onboarding. Add your personal details, skills, and experience to make your profile stand out to employers.",
  },
  {
    question: "How do I apply for jobs?",
    answer:
      "Browse opportunities in the Discover Talent section or use the Opportunities tab. Click on any opportunity to view details and click the 'Apply' button to submit your application.",
  },
  {
    question: "How do I edit my profile?",
    answer:
      "Go to your Profile page and click the 'Edit Profile' button. You can update personal details, professional information, work experience, education, and portfolio.",
  },
  {
    question: "How does the hiring process work?",
    answer:
      "After applying, employers can review your application and shortlist you. If shortlisted, you'll be notified and can proceed to interview scheduling.",
  },
  {
    question: "How do I schedule an interview?",
    answer:
      "Once shortlisted, recruiters can schedule an interview. You'll receive a notification with the date, time, and meeting link. You can also reschedule if needed.",
  },
  {
    question: "How do I withdraw an application?",
    answer:
      "Go to your profile's Opportunities tab where you can view all your applications. Click on an application to see the option to withdraw.",
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
];

const helpCategories: HelpCategory[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Getting Started",
    description: "Learn the basics of using Talent.ng",
    link: "#getting-started",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Applications",
    description: "How to apply and manage applications",
    link: "#applications",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "Interview Tips",
    description: "Prepare for your interviews",
    link: "#interviews",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Account & Security",
    description: "Manage your account settings",
    link: "#account",
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
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
      >
        <span className="font-medium text-gray-900">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ subject: "", message: "" });
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
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
        />
      </div>
      <div>
        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
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
        />
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl">
            Find answers to common questions or get in touch with our support
            team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {helpCategories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Contact Support
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Can't find what you're looking for? Send us a message and we'll
                get back to you.
              </p>
              <ContactForm />

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Other ways to reach us:
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@talent.ng"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@talent.ng
                  </a>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    Live chat (9am - 6pm WAT)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
