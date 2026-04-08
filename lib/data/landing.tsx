// Landing page static data

import { ReactNode } from "react";

export const navLinks = [
  { label: "Talents", href: "/talents" },
  { label: "Recruiters", href: "/recruiters" },
  { label: "Mentors", href: "/mentors" },
  { label: "Opportunities", href: "/opportunities-public" },
  { label: "FAQ", href: "/#faq" },
];

export const painPoints: Array<{
  icon: ReactNode;
  iconBg: string;
  title: string;
  desc: string;
}> = [
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

export const roles = [
  {
    id: "talents",
    title: "For Talents",
    desc: "Create a professional profile showcasing your skills, tools, and portfolio. Discover and apply for opportunities, track your applications, book mentorship sessions, and access learning resources — all from one dashboard.",
    cta: "Join as Talent",
    ctaStyle: "bg-black text-white",
    cardBg: "bg-[#F5F6F9]",
    mockupBg: "bg-[#F5F6F9]",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F76c72be1ed81454697472b6c9506a7ce%2Fe0804f84f46e458baf55d4e0894a1000?width=800",
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
    mockupBg: "bg-[#F2FAF5]",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F76c72be1ed81454697472b6c9506a7ce%2Fed1fb488aced4f2887e59242feceb568?width=800",
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
    mockupBg: "bg-[#F5F3FF]",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F76c72be1ed81454697472b6c9506a7ce%2Fd71502ffb1094839b3d72a443e588697?width=800",
    ],
    reversed: false,
  },
];

export const howItWorksSteps: Array<{
  step: string;
  title: string;
  desc: string;
  icon: ReactNode;
}> = [
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

export const categories = [
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

export const talents = [
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

export const faqs = [
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

export const footerLinks = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Privacy Policy", "Terms of Service"],
};
