"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Navigate to confirmation page with email as query parameter
      router.push(`/forgot-password-confirmation?email=${email}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[320px] flex flex-col gap-16">
        {/* Main Content */}
        <div className="flex flex-col items-center gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-11 w-full">
            <div className="flex flex-col items-center gap-8">
              {/* Logo and Description */}
              <div className="flex flex-col items-center gap-6">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/95484ffeaace17b0e40815c0aa78c80490650deb?width=168"
                  alt="Talent.ng Logo"
                  className="w-[84px] h-[64px]"
                />
                <div className="flex flex-col items-center gap-4">
                  <p className="text-[#667085] font-geist text-base font-medium leading-[120%] text-center w-[320px]">
                    We can help you reset your password using the email address
                    linked to your account.
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 w-full"
              >
                {/* Email Input */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 px-[14px] py-[14px] rounded-3xl border border-[#D0D5DD] bg-white">
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 text-[#667085] font-geist text-base font-medium bg-transparent border-none outline-none placeholder:text-[#667085]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2.5 px-[14px] py-[14px] rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-800 transition-colors"
                  >
                    Reset my password
                  </button>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 px-[14px] py-[14px] rounded-3xl border border-[#D0D5DD] bg-white text-[#0C111D] font-geist text-base font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;