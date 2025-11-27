"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const ConfirmationContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <p className="text-xs md:text-sm font-light text-gray-400 text-center">
      If the email <span className="font-semibold text-gray-400">{email}</span>{" "}
      exists, you will receive a password recovery link within a few minutes.
    </p>
  );
};

const ForgotPasswordConfirmation = () => {
  return (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/backgroundgradient.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 h-screen flex items-center justify-center px-3 py-3 md:py-8 lg:py-12 md:px-4 lg:px-6 overflow-hidden">
        <div className="w-full max-w-5xl max-h-full">
          <div className="bg-white rounded-[30px] shadow-lg h-[600px] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
              {/* Left Side - Logo */}
              <div className="hidden md:flex flex-col items-center justify-center p-8 lg:p-12 bg-white min-h-[400px] md:min-h-auto">
                <img
                  src="/logo.png"
                  alt="Talent.ng Logo"
                  className="w-full max-w-lg object-contain"
                />
              </div>

              {/* Right Side - Form */}
              <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-white h-full overflow-y-auto">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl md:text-2xl font-semibold text-black leading-tight">
                      Check your email
                    </h1>
                    <Suspense
                      fallback={
                        <p className="text-xs md:text-sm font-light text-gray-400">
                          Loading...
                        </p>
                      }
                    >
                      <ConfirmationContent />
                    </Suspense>
                  </div>

                  {/* Button */}
                  <Button
                    asChild
                    className="w-full h-11 rounded-[10px] bg-[#5C30FF] hover:bg-[#4a1fe5] text-white font-semibold text-sm mt-2"
                  >
                    <Link href="/login">Back to Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirmation;
