"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password.length >= 8) {
      // Simulate password reset success
      router.push("/login");
    }
  };

  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-14">
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
                {/* Password Input Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-[14px] py-[14px] rounded-3xl border border-[#D0D5DD] bg-white">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="flex-1 text-[#667085] font-geist text-base font-medium bg-transparent border-none outline-none placeholder:text-[#667085]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <p className="text-black font-geist text-[13px] font-normal leading-[120%] text-center w-[320px]">
                    8 characters minimum, at least 1 uppercase letter and 1
                    number
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={!isPasswordValid}
                    className="flex items-center justify-center gap-2.5 px-[14px] py-[14px] rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Change password
                  </button>

                  <div className="text-center">
                    <span className="text-[#667085] font-geist text-base font-normal">
                      Already have an account?{" "}
                    </span>
                    <Link
                      href="/login"
                      className="text-[#0C111D] font-geist text-base font-bold underline hover:text-gray-700 transition-colors"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
