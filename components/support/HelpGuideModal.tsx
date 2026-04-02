"use client";

import { Modal } from "@/components/ui/modal";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRoleColors } from "@/lib/theme/role-colors";

interface GuideStep {
  title: string;
  description: string;
}

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: "getting-started" | "applications" | "interviews" | "account";
  role: "talent" | "recruiter" | "mentor";
}

const guideContent: Record<
  string,
  Record<string, { title: string; steps: GuideStep[] }>
> = {
  talent: {
    "getting-started": {
      title: "Getting Started as Talent",
      steps: [
        {
          title: "Complete Your Profile",
          description:
            "Add your skills, experience, education, and portfolio to stand out to recruiters.",
        },
        {
          title: "Browse Opportunities",
          description:
            "Explore available opportunities that match your skills and interests.",
        },
        {
          title: "Submit Applications",
          description:
            "Apply to opportunities with your portfolio and cover letter.",
        },
        {
          title: "Track Your Progress",
          description:
            "Monitor your applications and respond to interview invitations promptly.",
        },
      ],
    },
    applications: {
      title: "Managing Applications",
      steps: [
        {
          title: "Find Opportunities",
          description:
            "Use filters to find opportunities that match your skills, location, and budget preferences.",
        },
        {
          title: "Prepare Your Application",
          description:
            "Review the opportunity details carefully and select relevant portfolio items.",
        },
        {
          title: "Submit Application",
          description:
            "Click 'Apply' and fill in your cover letter explaining why you're a great fit.",
        },
        {
          title: "Track Status",
          description:
            "Check the Applications page regularly for updates and interview invitations.",
        },
      ],
    },
    interviews: {
      title: "Interview Preparation",
      steps: [
        {
          title: "Review Invitation",
          description:
            "Check your Calendar for interview date, time, and meeting link.",
        },
        {
          title: "Research the Company",
          description:
            "Review the recruiter's profile and understand their business needs.",
        },
        {
          title: "Prepare Your Portfolio",
          description:
            "Have your best work ready to showcase during the interview.",
        },
        {
          title: "Join on Time",
          description:
            "Test your connection beforehand and join the meeting 5 minutes early.",
        },
      ],
    },
    account: {
      title: "Account & Security",
      steps: [
        {
          title: "Update Profile Information",
          description:
            "Go to Profile > Edit Profile to update your personal and professional details.",
        },
        {
          title: "Change Password",
          description:
            "Navigate to Settings > Account Security to update your password regularly.",
        },
        {
          title: "Manage Notifications",
          description:
            "Customize your notification preferences in Settings to stay informed.",
        },
        {
          title: "Privacy Settings",
          description:
            "Control who can view your profile and contact you in Settings > Privacy.",
        },
      ],
    },
  },
  recruiter: {
    "getting-started": {
      title: "Getting Started as Recruiter",
      steps: [
        {
          title: "Complete Business Profile",
          description:
            "Add your company details, logo, and business information to build trust.",
        },
        {
          title: "Get Verified",
          description:
            "Submit verification documents to display the verified badge and attract top talent.",
        },
        {
          title: "Post Your First Opportunity",
          description:
            "Create a detailed job posting with clear requirements and budget.",
        },
        {
          title: "Review Applications",
          description:
            "Browse applicants, review portfolios, and schedule interviews with top candidates.",
        },
      ],
    },
    applications: {
      title: "Managing Applicants",
      steps: [
        {
          title: "Post Opportunities",
          description:
            "Create detailed job postings with clear requirements, budget, and timeline.",
        },
        {
          title: "Review Applications",
          description:
            "Go to Applicants page to view all applications for your opportunities.",
        },
        {
          title: "Shortlist Candidates",
          description:
            "Filter by status and mark promising candidates for further review.",
        },
        {
          title: "Schedule Interviews",
          description:
            "Select candidates and schedule interviews with meeting links.",
        },
      ],
    },
    interviews: {
      title: "Interview Management",
      steps: [
        {
          title: "Schedule Interviews",
          description:
            "From the Applicants page, select candidates and choose interview date/time.",
        },
        {
          title: "Prepare Questions",
          description:
            "Review candidate portfolios and prepare relevant questions beforehand.",
        },
        {
          title: "Conduct Interviews",
          description:
            "Join meetings on time and assess candidates based on your requirements.",
        },
        {
          title: "Make Decisions",
          description:
            "Update application status and notify selected candidates promptly.",
        },
      ],
    },
    account: {
      title: "Account & Security",
      steps: [
        {
          title: "Update Company Profile",
          description:
            "Go to Profile > Edit Profile to update company information and branding.",
        },
        {
          title: "Manage Verification",
          description:
            "Check verification status in Profile > Verification tab.",
        },
        {
          title: "Change Password",
          description:
            "Navigate to Settings > Account Security to update your password.",
        },
        {
          title: "Billing Settings",
          description:
            "Manage payment methods and view invoices in Settings > Billing.",
        },
      ],
    },
  },
  mentor: {
    "getting-started": {
      title: "Getting Started as Mentor",
      steps: [
        {
          title: "Complete Mentor Profile",
          description:
            "Add your expertise, experience, and areas where you can provide mentorship.",
        },
        {
          title: "Set Your Availability",
          description:
            "Configure your available time slots and session duration preferences.",
        },
        {
          title: "Set Your Rates",
          description:
            "Define your hourly rates and session pricing in Settings > Mentorship.",
        },
        {
          title: "Accept Session Requests",
          description:
            "Review and respond to mentorship requests from mentees.",
        },
      ],
    },
    applications: {
      title: "Managing Sessions",
      steps: [
        {
          title: "Set Availability",
          description:
            "Go to Availability page and mark your available time slots for sessions.",
        },
        {
          title: "Review Requests",
          description:
            "Check session requests and review mentee profiles before accepting.",
        },
        {
          title: "Accept Sessions",
          description:
            "Approve requests that align with your expertise and schedule.",
        },
        {
          title: "Prepare for Sessions",
          description:
            "Review mentee goals and prepare relevant guidance materials.",
        },
      ],
    },
    interviews: {
      title: "Conducting Sessions",
      steps: [
        {
          title: "Review Session Details",
          description:
            "Check the Sessions page for upcoming sessions and mentee information.",
        },
        {
          title: "Prepare Content",
          description:
            "Plan your session agenda based on mentee's goals and questions.",
        },
        {
          title: "Join Session",
          description:
            "Use the meeting link provided and join 5 minutes early.",
        },
        {
          title: "Follow Up",
          description:
            "Share resources and action items with mentees after sessions.",
        },
      ],
    },
    account: {
      title: "Account & Security",
      steps: [
        {
          title: "Update Mentor Profile",
          description:
            "Go to Profile > Edit Profile to update your expertise and bio.",
        },
        {
          title: "Manage Rates",
          description:
            "Update your session rates and duration options in Settings > Mentorship.",
        },
        {
          title: "Change Password",
          description:
            "Navigate to Settings > Account Security to update your password.",
        },
        {
          title: "Payout Settings",
          description:
            "Configure your payment details in Settings > Payouts.",
        },
      ],
    },
  },
};

export function HelpGuideModal({
  isOpen,
  onClose,
  category,
  role,
}: HelpGuideModalProps) {
  const guide = guideContent[role]?.[category];
  const roleColors = getRoleColors(role);

  if (!guide) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnBackdrop={true}>
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#E1E4EA] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#525866]" />
        </button>

        {/* Title */}
        <h2 className="text-[18px] font-semibold font-inter-tight text-black mb-4">
          {guide.title}
        </h2>

        {/* Steps */}
        <div 
          className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${roleColors.primary}30 transparent`,
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: ${roleColors.primary}30;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: ${roleColors.primary}50;
            }
          `}</style>
          {guide.steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 bg-[#F5F5F5] rounded-[12px]"
            >
              <div 
                className="flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-[12px] font-medium font-inter-tight mt-0.5"
                style={{ backgroundColor: roleColors.primary }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-medium font-inter-tight text-black mb-1">
                  {step.title}
                </h3>
                <p className="text-[13px] font-inter-tight text-[#525866] leading-relaxed">
                  {step.description}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E1E4EA]">
          <Button
            onClick={onClose}
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: roleColors.primary }}
          >
            Got it, thanks!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
