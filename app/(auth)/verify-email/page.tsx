
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 w-full">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/95484ffeaace17b0e40815c0aa78c80490650deb?width=168"
            alt="Talent.ng Logo"
            className="w-24 h-20"
          />
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-black font-geist text-4xl font-semibold leading-tight">
              Verify your email
            </h1>
            <p className="text-gray-500 font-geist text-lg font-medium text-center w-full">
              We&apos;ve sent an email to your address. Please check your inbox and
              click the verification link to activate your account.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <Button asChild className="w-full max-w-xs rounded-3xl">
            <Link href="/login">Back to Login</Link>
          </Button>
          <p className="text-gray-500 font-geist text-sm">
            Didn&apos;t receive the email?{" "}
            <button
              // onClick={handleResend}
              className="text-gray-950 font-semibold underline hover:text-gray-700 transition-colors"
            >
              Resend verification link
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
