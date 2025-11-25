"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 border">
      <div className="mx-auto px-4 md:px-8 lg:px-28 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Talent.ng Logo"
            className="w-[58px] h-[44px]"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center">
          <a
            href="#"
            className="px-[14px] py-[14px] rounded-3xl text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors"
          >
            About us
          </a>
          <a
            href="#"
            className="px-[14px] py-[14px] rounded-3xl text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors"
          >
            Premium
          </a>
          <a
            href="#"
            className="px-[14px] py-[14px] rounded-3xl text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors"
          >
            Recruit Talent
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center justify-end gap-2">
          {user ? (
            <Link
              href="/talent/dashboard"
              className="px-[14px] py-[14px] rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-[14px] py-[14px] rounded-3xl text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-[14px] py-[14px] rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-black">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col items-center p-4">
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors w-full text-center"
            >
              About us
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors w-full text-center"
            >
              Premium
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors w-full text-center"
            >
              Recruit Talent
            </a>
            <div className="flex flex-col items-center gap-2 mt-4 w-full">
              {user ? (
                <Link
                  href="/talent/dashboard"
                  className="px-4 py-2 rounded-lg bg-brand-primary text-white font-geist text-base font-medium hover:bg-brand-primary/90 transition-colors w-full text-center"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors w-full text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-lg bg-black text-white font-geist text-base font-medium hover:bg-gray-800 transition-colors w-full text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
