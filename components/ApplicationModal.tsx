import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Opportunity } from "@/lib/types/opportunity";
import { applyToOpportunity } from "@/lib/api";
import { Application } from "@/lib/types/application";
import { toast } from "sonner";

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  opportunity: Opportunity;
}

export default function ApplicationModal({
  open,
  onClose,
  opportunity,
}: ApplicationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const application: Application = {
        opportunityId: opportunity.id,
        note: coverLetter,
      };

      await applyToOpportunity(application);
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      if (error.message.includes("already applied")) {
        toast.error("You have already applied for this opportunity.");
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/talent/dashboard");
    router.refresh();
    onClose();
    setIsSubmitted(false);
    setCoverLetter("");
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setCoverLetter("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `Posted ${date.toLocaleDateString("en-US", options)}`;
  };

  if (!open) return null;

  return (
    // Backdrop that blurs the entire page
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {!isSubmitted ? (
        // Application Form Modal
        <div className="relative z-10 w-[90%] max-w-2xl mx-auto bg-white rounded-[44px] shadow-lg overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="flex items-center gap-[18px]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <img
                      src={opportunity.logo}
                      alt={opportunity.company}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="text-base font-medium text-black font-geist">
                      {opportunity.company}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                </div>
                <span className="text-sm font-medium text-gray-500 font-geist">
                  {opportunity.title}
                </span>
                <div className="w-px h-6 bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-500 font-geist">
                  {formatDate(opportunity.createdAt)}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-medium text-black font-geist">
                  Application Details
                </h2>
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="space-y-6">
              <div className="relative">
                <Textarea
                  placeholder="Cover Letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[200px] rounded-[32px] border border-gray-300 bg-white p-3.5 text-base font-medium text-gray-500 font-geist placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300 resize-none"
                  style={{
                    borderColor: "#D0D5DD",
                    paddingTop: "14px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    paddingBottom: "14px",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-3.5 rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Success Modal
        <div className="relative z-10 w-[90%] max-w-md mx-auto bg-white rounded-[44px] shadow-lg overflow-hidden">
          <div className="p-8 flex flex-col items-center gap-8">
            {/* Success Icon and Message */}
            <div className="flex flex-col items-center gap-6">
              {/* Success Icon */}
              <div className="w-11 h-11 flex items-center justify-center">
                <svg
                  width="44"
                  height="45"
                  viewBox="0 0 44 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2193_4889)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M27.4997 4.16602C28.1433 4.16603 28.7756 4.33546 29.333 4.65728C29.8903 4.9791 30.3532 5.44196 30.675 5.99935H32.9997C33.9721 5.99935 34.9048 6.38566 35.5924 7.07329C36.28 7.76092 36.6663 8.69356 36.6663 9.66602V31.666C36.6663 34.0972 35.7006 36.4287 33.9815 38.1478C32.2624 39.8669 29.9308 40.8327 27.4997 40.8327H10.9997C10.0272 40.8327 9.09458 40.4464 8.40695 39.7587C7.71932 39.0711 7.33301 38.1385 7.33301 37.166V9.66602C7.33301 8.69356 7.71932 7.76092 8.40695 7.07329C9.09458 6.38566 10.0272 5.99935 10.9997 5.99935H13.3243C13.6462 5.44196 14.109 4.9791 14.6664 4.65728C15.2238 4.33546 15.8561 4.16603 16.4997 4.16602H27.4997ZM27.177 17.6942L19.4 25.473L16.8058 22.8788C16.4601 22.5449 15.997 22.3601 15.5163 22.3643C15.0356 22.3685 14.5758 22.5613 14.2358 22.9012C13.8959 23.2411 13.7031 23.7009 13.6989 24.1816C13.6948 24.6623 13.8796 25.1254 14.2135 25.4712L17.9718 29.2313C18.1591 29.4187 18.3815 29.5673 18.6262 29.6688C18.8709 29.7702 19.1333 29.8224 19.3982 29.8224C19.6631 29.8224 19.9254 29.7702 20.1701 29.6688C20.4149 29.5673 20.6372 29.4187 20.8245 29.2313L29.7712 20.2865C29.9414 20.1162 30.0764 19.914 30.1685 19.6915C30.2605 19.469 30.3079 19.2305 30.3078 18.9897C30.3077 18.7489 30.2602 18.5105 30.168 18.288C30.0757 18.0656 29.9406 17.8635 29.7703 17.6933C29.5999 17.5231 29.3977 17.3881 29.1752 17.296C28.9527 17.2039 28.7142 17.1566 28.4734 17.1566C28.2326 17.1567 27.9942 17.2042 27.7718 17.2965C27.5493 17.3887 27.3472 17.5238 27.177 17.6942ZM26.583 7.83268H17.4163C17.2018 7.83261 16.994 7.9078 16.8292 8.04515C16.6644 8.1825 16.553 8.37331 16.5143 8.58435L16.4997 8.74935V10.5827C16.4996 10.7972 16.5748 11.005 16.7121 11.1698C16.8495 11.3346 17.0403 11.4461 17.2513 11.4847L17.4163 11.4993H26.583C26.7976 11.4994 27.0053 11.4242 27.1702 11.2869C27.335 11.1495 27.4464 10.9587 27.485 10.7477L27.4997 10.5827V8.74935C27.4997 8.5348 27.4246 8.32703 27.2872 8.16221C27.1499 7.99739 26.9591 7.88597 26.748 7.84735L26.583 7.83268Z"
                      fill="#03D90C"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2193_4889">
                      <rect
                        width="44"
                        height="44"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              {/* Success Message */}
              <div className="text-center">
                <p className="text-base font-normal text-black font-geist leading-[19.2px]">
                  Your application for {opportunity.title} at{" "}
                  {opportunity.company} has been submitted.
                </p>
              </div>
            </div>

            {/* Go to Dashboard Button */}
            <button
              onClick={handleGoToDashboard}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-3.5 rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-900 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
