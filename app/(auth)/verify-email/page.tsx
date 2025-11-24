"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Gradient Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur5" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
          <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="325" />
          </filter>
        </defs>
        <g filter="url(#blur1)">
          <path
            d="M332.362 -241.454L441.282 130.988L813.724 239.908L441.282 348.828L332.362 721.27L223.442 348.828L-149 239.908L223.442 130.988L332.362 -241.454Z"
            fill="#F6BC3F"
          />
        </g>
        <g filter="url(#blur2)">
          <path
            d="M332.362 39.8024L441.282 412.245L813.724 521.164L441.282 630.084L332.362 1002.53L223.442 630.084L-149 521.164L223.442 412.245L332.362 39.8024Z"
            fill="#008B47"
          />
        </g>
        <g filter="url(#blur3)">
          <path
            d="M332.362 404.73L441.282 777.172L813.724 886.092L441.282 995.012L332.362 1367.45L223.442 995.012L-149 886.092L223.442 777.172L332.362 404.73Z"
            fill="#5C30FF"
          />
        </g>
        <g filter="url(#blur4)">
          <path
            d="M1114.64 -241.454L1223.56 130.988L1596 239.908L1223.56 348.828L1114.64 721.27L1005.72 348.828L633.276 239.908L1005.72 130.988L1114.64 -241.454Z"
            fill="#F791C3"
          />
        </g>
        <g filter="url(#blur5)">
          <path
            d="M1114.64 39.8024L1223.56 412.245L1596 521.164L1223.56 630.084L1114.64 1002.53L1005.72 630.084L633.276 521.164L1005.72 412.245L1114.64 39.8024Z"
            fill="#E63C23"
          />
        </g>
        <g filter="url(#blur6)">
          <path
            d="M1114.64 404.73L1223.56 777.172L1596 886.092L1223.56 995.012L1114.64 1367.45L1005.72 995.012L633.276 886.092L1005.72 777.172L1114.64 404.73Z"
            fill="#FFEECA"
          />
        </g>
      </svg>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[30px] shadow-lg p-8 md:p-12 lg:p-16">
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
