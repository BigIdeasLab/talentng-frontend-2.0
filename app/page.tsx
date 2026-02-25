"use client";

import { useState } from "react";
import Link from "next/link";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M10.2133 16.0253C9.88807 16.3298 9.4533 16.5 9.00082 16.5C8.54835 16.5 8.11365 16.3298 7.78838 16.0253C4.80977 13.2195 0.81807 10.0852 2.7647 5.53475C3.81722 3.07437 6.34375 1.5 9.00082 1.5C11.6579 1.5 14.1845 3.07437 15.237 5.53475C17.1812 10.0795 13.1992 13.2292 10.2133 16.0253Z"
        stroke="#525866"
        strokeWidth="1.125"
      />
      <path
        d="M11.625 8.25C11.625 9.69975 10.4497 10.875 9 10.875C7.55025 10.875 6.375 9.69975 6.375 8.25C6.375 6.80025 7.55025 5.625 9 5.625C10.4497 5.625 11.625 6.80025 11.625 8.25Z"
        stroke="#525866"
        strokeWidth="1.125"
      />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1.5 10.5C1.5 8.39333 1.5 7.33996 2.00559 6.58329C2.22447 6.25572 2.50572 5.97447 2.83329 5.75559C3.58996 5.25 4.64331 5.25 6.75 5.25H11.25C13.3567 5.25 14.41 5.25 15.1667 5.75559C15.4942 5.97447 15.7755 6.25572 15.9944 6.58329C16.5 7.33996 16.5 8.39333 16.5 10.5C16.5 12.6067 16.5 13.6601 15.9944 14.4167C15.7755 14.7443 15.4942 15.0255 15.1667 15.2444C14.41 15.75 13.3567 15.75 11.25 15.75H6.75C4.64331 15.75 3.58996 15.75 2.83329 15.2444C2.50572 15.0255 2.22447 14.7443 2.00559 14.4167C1.5 13.6601 1.5 12.6067 1.5 10.5Z"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.25C12 3.83578 12 3.12868 11.5606 2.68934C11.1213 2.25 10.4142 2.25 9 2.25C7.5858 2.25 6.87868 2.25 6.43934 2.68934C6 3.12868 6 3.83578 6 5.25"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8.25L4.98898 8.4015C7.56382 9.1995 10.4362 9.1995 13.011 8.4015L13.5 8.25M9 9V10.5"
        stroke="#525866"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
        stroke="#525866"
        strokeWidth="1.125"
      />
      <path
        d="M11.0326 7.54582C10.9583 6.97383 10.3015 6.04966 9.1206 6.04964C7.7484 6.04962 7.17102 6.80959 7.05386 7.18958C6.87108 7.69785 6.90764 8.74282 8.51602 8.85675C10.5265 8.99925 11.332 9.23655 11.2295 10.467C11.127 11.6974 10.0063 11.9632 9.1206 11.9347C8.23485 11.9062 6.78573 11.4994 6.72949 10.405M8.98005 5.24854V6.05236M8.98005 11.9273V12.7485"
        stroke="#525866"
        strokeWidth="1.125"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PenToolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <g clipPath="url(#clip-pen)">
        <path
          d="M9 14.25L14.25 9L16.5 11.25L11.25 16.5L9 14.25Z"
          stroke="#525866"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 9.75L12.375 4.125L1.5 1.5L4.125 12.375L9.75 13.5L13.5 9.75Z"
          stroke="#525866"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.5 1.5L7.1895 7.1895"
          stroke="#525866"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.25 9.75C9.07843 9.75 9.75 9.07843 9.75 8.25C9.75 7.42157 9.07843 6.75 8.25 6.75C7.42157 6.75 6.75 7.42157 6.75 8.25C6.75 9.07843 7.42157 9.75 8.25 9.75Z"
          stroke="#525866"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip-pen">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      className={className}
    >
      <path
        d="M10.5 15.75L21 26.25L31.5 15.75"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const navLinks = ["Talents", "Recruiters", "Mentors", "Opportunities", "FAQ"];

const painPoints = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="#E8728A" strokeWidth="1.5" />
        <path
          d="M16 5C16 5 10 11 10 16C10 21 16 27 16 27"
          stroke="#E8728A"
          strokeWidth="1.5"
        />
        <path
          d="M16 5C16 5 22 11 22 16C22 21 16 27 16 27"
          stroke="#E8728A"
          strokeWidth="1.5"
        />
        <path d="M5 16H27" stroke="#E8728A" strokeWidth="1.5" />
        <path d="M6.5 11H25.5" stroke="#E8728A" strokeWidth="1.5" />
        <path d="M6.5 21H25.5" stroke="#E8728A" strokeWidth="1.5" />
      </svg>
    ),
    iconBg: "bg-[#FFF0F3]",
    title: "Searching multiple platforms",
    desc: "Talents waste time navigating fragmented job boards, freelance sites, and social media just to find the right opportunity.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M5 16C5 16 9 9 16 9C23 9 27 16 27 16C27 16 23 23 16 23C9 23 5 16 5 16Z"
          stroke="#D4A017"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="3.5" stroke="#D4A017" strokeWidth="1.5" />
        <path
          d="M6 6L26 26"
          stroke="#D4A017"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconBg: "bg-[#FFF8E6]",
    title: "Hidden talent visibility issues",
    desc: "Skilled professionals remain invisible because there's no centralized space to showcase their expertise.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="9" cy="9" r="4" stroke="#7C6CF0" strokeWidth="1.5" />
        <circle cx="23" cy="9" r="4" stroke="#7C6CF0" strokeWidth="1.5" />
        <circle cx="16" cy="23" r="4" stroke="#7C6CF0" strokeWidth="1.5" />
        <path
          d="M13 9H19M12.5 12L16 20M19.5 12L16 20"
          stroke="#7C6CF0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconBg: "bg-[#F0EEFF]",
    title: "Disconnected mentorship & learning",
    desc: "Mentorship and learning happen in silos, making it hard to connect with the right guidance at the right time.",
  },
];

const roles = [
  {
    id: "talents",
    title: "For Talents",
    desc: "Create a professional profile showcasing your skills, tools, and portfolio. Discover and apply for opportunities, track your applications, book mentorship sessions, and access learning resources — all from one dashboard.",
    cta: "Join as Talent",
    ctaStyle: "bg-black text-white",
    cardBg: "bg-[#F7F8FC]",
    mockupBg: "bg-gradient-to-br from-white to-[#F0F0FF]",
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    reversed: false,
  },
  {
    id: "recruiters",
    title: "For Recruiters",
    desc: "Set up your company profile and start posting opportunities in minutes. Browse and discover top talent, review applications, manage your hiring pipeline, and mark roles as filled — everything you need to hire efficiently.",
    cta: "Hire Talents",
    ctaStyle: "bg-[#1A6B3C] text-white",
    cardBg: "bg-[#F2FAF5]",
    mockupBg: "bg-gradient-to-br from-[#E8F7EE] to-[#D0F0DC]",
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4c62644e1b187e2323da216c7c651406c5624fe4?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2799e8adb32e8bdd5314241b333ed775c0f0a244?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    reversed: true,
  },
  {
    id: "mentors",
    title: "For Mentors",
    desc: "Build your mentor profile, highlight your areas of expertise, and set your availability. Manage mentorship sessions, connect with mentees, and receive reviews — empowering the next generation of Nigerian talent.",
    cta: "Become a Mentor",
    ctaStyle: "bg-black text-white",
    cardBg: "bg-[#F5F3FF]",
    mockupBg: "bg-gradient-to-br from-[#EDE9FF] to-[#D8CFFF]",
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    reversed: false,
  },
];

const howItWorksSteps = [
  {
    step: "STEP 1",
    title: "Create an Account",
    desc: "Sign up for free in seconds.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="#1A6B3C" strokeWidth="1.5" />
        <path
          d="M4 24C4 19.5817 8.47715 16 14 16C19.5228 16 24 19.5817 24 24"
          stroke="#1A6B3C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    step: "STEP 2",
    title: "Complete Your Profile",
    desc: "Add your skills, experience, and goals.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="6"
          y="4"
          width="16"
          height="20"
          rx="2"
          stroke="#1A6B3C"
          strokeWidth="1.5"
        />
        <path
          d="M10 10H18M10 14H18M10 18H15"
          stroke="#1A6B3C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    step: "STEP 3",
    title: "Start Applying, Hiring, or Mentoring",
    desc: "Take action on the platform right away.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 4L24 14L14 24"
          stroke="#1A6B3C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 14H24"
          stroke="#1A6B3C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const categories = [
  "All",
  "Designer",
  "Developer",
  "Writer",
  "Illustrator",
  "Animator",
  "Marketing",
  "Photographer",
  "Music & Audio",
  "Content Creation",
];

const talents = [
  {
    id: 1,
    name: "Ifeoma Chijioke",
    role: "UX/UI Designer",
    location: "Lagos, Nigeria",
    hired: "3X Hired",
    tag: "Design",
    showTag: true,
    showEarned: false,
    earned: "",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    avatarBg: "#E8A87C",
    initials: "IC",
  },
  {
    id: 2,
    name: "Chijioke Olaniyi",
    role: "Web Designer",
    location: "Abuja, Nigeria",
    hired: "4X Hired",
    earned: "$4,200 Earned",
    showEarned: true,
    showTag: false,
    tag: "",
    skills: [
      "Website Design",
      "SEO Optimization",
      "Responsive Design",
      "User Testing",
    ],
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
    avatarBg: "#7A5AF8",
    initials: "CO",
  },
  {
    id: 3,
    name: "Oluwatobi Adeyemi",
    role: "Interaction Designer",
    location: "Port Harcourt, Nigeria",
    hired: "2X Hired",
    earned: "$1,900 Earned",
    showEarned: true,
    showTag: false,
    tag: "",
    skills: ["Game Design", "Usability Testing", "3D Modeling", "Animation"],
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/57203417be73ef060acdf909d231697c0fcd461a?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04?width=80",
    avatarBg: "#3B82F6",
    initials: "OA",
  },
  {
    id: 4,
    name: "Seyi Olufemi",
    role: "Motion Designer",
    location: "Kaduna, Nigeria",
    hired: "3X Hired",
    earned: "$2,400 Earned",
    showEarned: true,
    showTag: false,
    tag: "",
    skills: ["Animated UI", "Storyboarding", "Visual Effects", "Editing"],
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    avatarBg: "#F59E0B",
    initials: "SO",
  },
  {
    id: 5,
    name: "Dolapo Ajayi",
    role: "Product Designer",
    location: "Enugu, Nigeria",
    hired: "1X Hired",
    earned: "$1,500 Earned",
    showEarned: true,
    showTag: false,
    tag: "",
    skills: [
      "SaaS Design",
      "Accessibility Design",
      "Information Architecture",
      "Sketching",
    ],
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/4c62644e1b187e2323da216c7c651406c5624fe4?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2799e8adb32e8bdd5314241b333ed775c0f0a244?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/a9db3f53587de9205b8fd3d8d8a5e49e78a22ec6?width=80",
    avatarBg: "#EC4899",
    initials: "DA",
  },
  {
    id: 6,
    name: "Seyi Olufemi",
    role: "Motion Designer",
    location: "Kaduna, Nigeria",
    hired: "3X Hired",
    earned: "$2,400 Earned",
    showEarned: true,
    showTag: false,
    tag: "",
    skills: ["Animated UI", "Storyboarding", "Visual Effects", "Editing"],
    images: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
    ],
    avatarUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    avatarBg: "#F59E0B",
    initials: "SO",
  },
];

const faqs = [
  {
    q: "What is Talents.ng?",
    a: "Talents.ng is Nigeria's centralized platform connecting talents, recruiters, and mentors in one structured ecosystem. It brings together opportunities, skill showcasing, and mentorship in a single place.",
  },
  {
    q: "Is Talent.ng free to use?",
    a: "Yes, Talent.ng is free to join for all users — whether you're a talent, recruiter, or mentor. Sign up and get access to core features at no cost.",
  },
  {
    q: "Who can join Talent.ng?",
    a: "Anyone can join — whether you're a creative or technical talent looking for opportunities, a recruiter seeking to hire Nigerian professionals, or a mentor willing to guide the next generation.",
  },
  {
    q: "How do I find opportunities?",
    a: "Browse the Opportunities section to discover jobs, gigs, and projects that match your skills and interests. Use filters to narrow down by role, category, or location.",
  },
  {
    q: "How does mentorship work?",
    a: "Mentors set up their profiles, highlight their areas of expertise, and define their availability. Mentees can browse mentors, book sessions, and receive guidance directly on the platform.",
  },
];

const footerLinks = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Private Policy", "Terms od Service"],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({
  avatarUrl,
  avatarBg,
  initials,
}: {
  avatarUrl?: string;
  avatarBg: string;
  initials: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
      style={{ backgroundColor: avatarBg }}
    >
      {initials}
    </div>
  );
}

function TalentCard({ talent }: { talent: (typeof talents)[0] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E1E4EA] p-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar
              avatarUrl={(talent as any).avatarUrl}
              avatarBg={talent.avatarBg}
              initials={talent.initials}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-black font-medium text-[15px] leading-tight">
                {talent.name}
              </span>
              <span className="text-black/30 text-sm font-light leading-tight">
                {talent.role}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-1 px-4 py-3 rounded-full bg-[#181B25] border border-[#181B25] text-white text-[13px] whitespace-nowrap hover:bg-[#2a2f3d] transition-colors">
            View Profile
          </button>
        </div>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <div className="flex items-center gap-2">
            <LocationIcon />
            <span className="text-[#525866] text-sm">{talent.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <WorkIcon />
            <span className="text-[#525866] text-sm">{talent.hired}</span>
          </div>
          {talent.showEarned && (
            <div className="flex items-center gap-2">
              <DollarIcon />
              <span className="text-[#525866] text-sm">{talent.earned}</span>
            </div>
          )}
          {talent.showTag && (
            <div className="flex items-center gap-2">
              <PenToolIcon />
              <span className="text-[#525866] text-sm">{talent.tag}</span>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Images */}
      <div className="flex gap-2">
        {talent.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="flex-1 h-36 object-cover rounded-lg min-w-0"
          />
        ))}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {talent.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-full bg-[#F5F5F5] text-black text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlatformMockup({
  images,
  bg,
}: {
  images: string[];
  bg: string;
}) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xl ${bg} p-3`}
    >
      {/* Browser chrome */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F5F5] border-b border-[#E8E8E8]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <div className="flex-1 bg-white rounded mx-2 h-4 text-[9px] flex items-center px-2 text-[#999]">
            app.talent.ng
          </div>
        </div>
        <div className="flex">
          {/* Sidebar */}
          <div className="w-14 bg-[#FAFAFA] border-r border-[#F0F0F0] p-2 flex flex-col gap-2 min-h-[200px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded ${i === 2 ? "bg-[#5C30FF] w-8" : "bg-[#E8E8E8] w-full"}`}
              />
            ))}
          </div>
          {/* Content grid */}
          <div className="flex-1 grid grid-cols-3 gap-1.5 p-2">
            {images.slice(0, 6).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-full aspect-square object-cover rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"People" | "Opportunities">(
    "People"
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-inter-tight bg-white min-h-screen">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/346cc6e9e3f47688689c0436ec2cd4a7839d719b?width=84"
              alt="Talent.ng"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-[15px] text-gray-800 hover:text-[#5C30FF] transition-colors"
              >
                {link}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-[15px] font-medium text-gray-800 hover:text-[#5C30FF] transition-colors px-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#5C30FF] text-white text-[15px] font-medium hover:bg-[#4a26d4] transition-colors whitespace-nowrap"
            >
              Create Free Account
            </Link>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileMenuOpen ? (
                  <>
                    <path d="M4 4L18 18M18 4L4 18" />
                  </>
                ) : (
                  <>
                    <path d="M3 6h16M3 12h16M3 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#F0F0F0] px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-base text-gray-800 hover:text-[#5C30FF]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-base font-medium text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#ECEEFF] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-12">
          {/* Left copy */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.05] text-black">
                Nigeria&rsquo;s Skills &amp;
                <br />
                Opportunities &mdash;{" "}
                <span className="text-[#1DBF73]">All in</span>
                <br />
                <span className="text-[#5C30FF]">One Place.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-700 max-w-md leading-relaxed">
                Create your profile, discover opportunities, connect with
                mentors, and grow your career on Talent.ng.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 rounded-full bg-[#5C30FF] text-white text-base font-medium hover:bg-[#4a26d4] transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                href="#discover"
                className="inline-flex items-center px-6 py-3 rounded-full border border-[#ccc] bg-white text-gray-800 text-base font-medium hover:border-[#5C30FF] transition-colors"
              >
                Browse Opportunities
              </Link>
            </div>
            <p className="text-sm text-[#525866]">
              Free to join &bull; Built for Nigeria
            </p>
          </div>

          {/* Right mockup */}
          <div className="flex-1 min-w-0 max-w-[580px] w-full">
            <PlatformMockup
              images={[
                "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
                "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
                "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
                "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
                "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
                "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
              ]}
              bg="bg-gradient-to-br from-[#E0E4FF] to-[#C8CFFF]"
            />
          </div>
        </div>
      </section>

      {/* ── Problem Section ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-black">
              The Nigerian Talent Ecosystem Is{" "}
              <span className="text-[#E8465A]">Fragmented</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-md mx-auto">
              Today&rsquo;s landscape makes it hard for talent, recruiters, and
              mentors to connect efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {painPoints.map((point) => (
              <div key={point.title} className="flex flex-col items-center text-center gap-4 md:items-start md:text-left">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${point.iconBg}`}
                >
                  {point.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {point.title}
                  </h3>
                  <p className="text-[#525866] text-sm sm:text-base leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg sm:text-xl text-black">
              <span className="text-[#1DBF73] font-semibold">Talent.ng</span>{" "}
              centralizes everything into one structured platform.
            </p>
          </div>
        </div>
      </section>

      {/* ── Three Roles ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-6 md:py-10 pb-20 md:pb-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-black">
              One Platform, Three Powerful Roles
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-md mx-auto">
              Today&rsquo;s landscape makes it hard for talent, recruiters, and
              mentors to connect efficiently.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`rounded-3xl ${role.cardBg} p-6 sm:p-10 flex flex-col ${role.reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12 overflow-hidden`}
              >
                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                  <div>
                    <h3 className="text-3xl sm:text-[40px] font-bold text-black mb-3">
                      {role.title}
                    </h3>
                    <p className="text-[#525866] text-sm sm:text-base leading-relaxed max-w-sm">
                      {role.desc}
                    </p>
                  </div>
                  <Link
                    href="/signup"
                    className={`inline-flex items-center self-start px-6 py-3 rounded-full text-base font-medium transition-colors ${role.ctaStyle} hover:opacity-90`}
                  >
                    {role.cta}
                  </Link>
                </div>

                {/* Mockup */}
                <div className="flex-1 min-w-0 w-full max-w-[480px]">
                  <PlatformMockup images={role.images} bg={role.mockupBg} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[40px] font-bold text-black">
              How It Works
            </h2>
            <p className="mt-3 text-base text-[#525866]">
              Get started in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F7EE] flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[#1DBF73] uppercase mb-1">
                    {step.step}
                  </p>
                  <h3 className="text-lg font-bold text-black mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#525866]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discover Talent ──────────────────────────────────────────────────── */}
      <section id="discover" className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-[40px] font-bold text-black">
              Discover Talent &amp; Opportunites
            </h2>
          </div>

          {/* Tab toggle */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {(["People", "Opportunities"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeTab === tab
                    ? "border-black bg-white text-black"
                    : "border-transparent bg-transparent text-[#525866] hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#181B25] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-[#E1E4EA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Talent cards grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {talents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* Left title */}
            <div className="md:w-[380px] flex-shrink-0 pt-3 pl-0 md:pl-8">
              <h2 className="text-4xl sm:text-[48px] font-normal leading-[1.05] text-black">
                Frequently asked questions
              </h2>
            </div>

            {/* Right accordion */}
            <div className="flex-1 min-w-0">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`w-full flex items-center justify-between py-5 text-left ${
                      i === 0 ? "border-t border-b border-[#E1E4EA]" : "border-b border-[#E1E4EA]"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-medium text-black">
                      {faq.q}
                    </span>
                    <ChevronDownIcon
                      className={`flex-shrink-0 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="py-4 text-[#525866] text-base leading-relaxed border-b border-[#E1E4EA]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-center text-center gap-5">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8d96c7a7b6652ec04c8110d58549b6eff81087bc?width=252"
              alt="Talent.ng App"
              className="w-24 h-auto rounded-[22px] shadow-lg"
            />
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl sm:text-[56px] md:text-[60px] font-normal text-black leading-[1.05]">
                Try Talents.ng today
              </h2>
              <p className="text-base sm:text-xl text-black">
                Manage your freelance projects commission
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 rounded-full bg-[#5C30FF] border border-[#5C30FF] text-white text-lg font-medium hover:bg-[#4a26d4] transition-colors"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#F0F0F0] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 pb-12">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            {/* Brand */}
            <div className="md:w-[320px] flex-shrink-0 flex flex-col gap-6">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/346cc6e9e3f47688689c0436ec2cd4a7839d719b?width=84"
                alt="Talent.ng"
                className="h-8 w-auto"
              />
              <p className="text-[#525866] text-base leading-6 max-w-xs">
                Nigeria&rsquo;s centralized platform connecting talents,
                recruiters, and mentors in one structured ecosystem.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-1 flex-wrap gap-8 sm:gap-12">
              {Object.entries(footerLinks).map(([heading, links]) => (
                <div key={heading} className="flex flex-col gap-4 min-w-[100px]">
                  <h4 className="text-black font-semibold text-base">
                    {heading}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {links.map((link) => (
                      <Link
                        key={link}
                        href="#"
                        className="text-[#525866] text-base hover:text-black transition-colors flex items-center gap-2"
                      >
                        {link}
                        {link === "Learning Hub" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#525866]">
                            Coming Soon
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-[#F0F0F0] text-center text-sm text-[#525866]">
            &copy;2026 Talent.ng. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
