"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  return (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/backgroundgradient.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 overflow-hidden">
        <div className="w-full max-w-md max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-24px)]">
            <div className="flex flex-col items-center gap-8 text-center">
              {/* Gmail Icon */}
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    d="M45.9375 0H14.0625C6.296 0 0 6.296 0 14.0625V45.9375C0 53.704 6.296 60 14.0625 60H45.9375C53.704 60 60 53.704 60 45.9375V14.0625C60 6.296 53.704 0 45.9375 0Z"
                    fill="#F4F2ED"
                  />
                  <path
                    d="M9.75844 47.5873H17.2158V29.4764L6.5625 21.4866V44.3913C6.5625 46.1597 7.99547 47.5873 9.75844 47.5873Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M42.7842 47.5873H50.2418C52.0101 47.5873 53.4377 46.1543 53.4377 44.3913V21.4863L42.7842 29.4764"
                    fill="#34A853"
                  />
                  <path
                    d="M42.7842 15.6269V29.4763L53.4377 21.4865V17.2246C53.4377 13.2724 48.926 11.0191 45.7673 13.3895"
                    fill="#FBBC04"
                  />
                  <path
                    d="M17.2158 29.4764V15.6272L29.9998 25.2148L42.7838 15.6267V29.4762L29.9998 39.0644"
                    fill="#EA4335"
                  />
                  <path
                    d="M6.5625 17.2249V21.4863L17.2158 29.4763V15.6271L14.2329 13.3898C11.0688 11.0193 6.5625 13.2726 6.5625 17.2249Z"
                    fill="#C5221F"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="60" height="60" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              {/* Header */}
              <div className="flex flex-col gap-5">
                <h1 className="text-3xl md:text-[30px] font-semibold text-black leading-tight">
                  Verify your email
                </h1>
                <p className="text-base md:text-[17px] font-light text-gray-400">
                  We've sent an email to your address. Please check your inbox
                  and click the verification link to activate your account.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 w-full pt-4">
                <Button
                  asChild
                  className="w-full h-[53px] rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-base"
                >
                  <Link href="/login">Back to Login</Link>
                </Button>
                <p className="text-gray-400 font-light text-sm">
                  Didn't receive the email?{" "}
                  <button className="text-[#5C30FF] font-semibold hover:underline">
                    Resend verification link
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
