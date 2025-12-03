"use client";

import { useState } from "react";
import Link from "next/link";

type FilterType = "all" | "internship" | "job-listing" | "volunteer" | "part-time" | "applied";

interface Opportunity {
  id: string;
  posterName: string;
  posterAvatar: string;
  date: string;
  type: FilterType;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
  applicationStatus?: "awaiting-review" | "hired" | "not-hired";
}

const opportunities: Opportunity[] = [
  // Internships (10)
  {
    id: "int-1",
    posterName: "Ifeoma Chijioke",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Art Director / Senior Art Director Intern",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
    showActions: true,
  },
  {
    id: "int-2",
    posterName: "Jumia",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Nov 16",
    type: "internship",
    title: "Mobile App Designer",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$250 / Month",
    showActions: true,
  },
  {
    id: "int-3",
    posterName: "Andela",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Oct 28",
    type: "internship",
    title: "Frontend Development Intern",
    skills: ["React", "TypeScript", "Tailwind CSS", "Git"],
    rate: "$300 / Month",
    showActions: true,
  },
  {
    id: "int-4",
    posterName: "Flutterwave",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Nov 05",
    type: "internship",
    title: "Product Design Intern",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    rate: "$280 / Month",
    showActions: true,
  },
  {
    id: "int-5",
    posterName: "Kuda Bank",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 12",
    type: "internship",
    title: "UX Writing Intern",
    skills: ["Content Writing", "UX Research", "Microcopy", "Communication"],
    rate: "$200 / Month",
    showActions: true,
  },
  {
    id: "int-6",
    posterName: "Interswitch",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Oct 15",
    type: "internship",
    title: "Data Analytics Intern",
    skills: ["Data Analysis", "Excel", "SQL", "Tableau"],
    rate: "$220 / Month",
    showActions: true,
  },
  {
    id: "int-7",
    posterName: "PiggyVest",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Nov 20",
    type: "internship",
    title: "Marketing Design Intern",
    skills: ["Graphic Design", "Social Media", "Branding", "Adobe Suite"],
    rate: "$180 / Month",
    showActions: true,
  },
  {
    id: "int-8",
    posterName: "Carbon",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Oct 30",
    type: "internship",
    title: "Backend Development Intern",
    skills: ["Node.js", "MongoDB", "REST APIs", "Docker"],
    rate: "$320 / Month",
    showActions: true,
  },
  {
    id: "int-9",
    posterName: "TechCabal",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Nov 08",
    type: "internship",
    title: "Content Writing Intern",
    skills: ["Writing", "Research", "SEO", "Editing"],
    rate: "$150 / Month",
    showActions: true,
  },
  {
    id: "int-10",
    posterName: "Cowrywise",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 22",
    type: "internship",
    title: "UI/UX Design Intern",
    skills: ["UI Design", "User Testing", "Wireframing", "Sketch"],
    rate: "$270 / Month",
    showActions: true,
  },

  // Job Listings (10)
  {
    id: "job-1",
    posterName: "Spotify",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Dec 01",
    type: "job-listing",
    title: "Product Designer",
    skills: ["Web Design", "User Testing", "Interaction Design", "Prototyping"],
    rate: "$85/hr",
    showActions: true,
  },
  {
    id: "job-2",
    posterName: "Paystack",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Feb 20",
    type: "job-listing",
    title: "UI Designer",
    skills: [
      "Dashboard UI",
      "Accessibility Design",
      "Iconography",
      "Responsive Design",
    ],
    rate: "$90/hr",
    showActions: true,
  },
  {
    id: "job-3",
    posterName: "Meta",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Jan 15",
    type: "job-listing",
    title: "Senior UX Researcher",
    skills: ["User Research", "Data Analysis", "A/B Testing", "Surveys"],
    rate: "$120/hr",
    showActions: true,
  },
  {
    id: "job-4",
    posterName: "Google",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Feb 10",
    type: "job-listing",
    title: "Frontend Engineer",
    skills: ["React", "JavaScript", "CSS", "Performance"],
    rate: "$95/hr",
    showActions: true,
  },
  {
    id: "job-5",
    posterName: "Netflix",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Jan 25",
    type: "job-listing",
    title: "Product Manager",
    skills: [
      "Product Strategy",
      "Roadmapping",
      "Analytics",
      "Stakeholder Management",
    ],
    rate: "$110/hr",
    showActions: true,
  },
  {
    id: "job-6",
    posterName: "Apple",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Feb 05",
    type: "job-listing",
    title: "iOS Developer",
    skills: ["Swift", "SwiftUI", "UIKit", "iOS SDK"],
    rate: "$105/hr",
    showActions: true,
  },
  {
    id: "job-7",
    posterName: "Amazon",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Jan 30",
    type: "job-listing",
    title: "UX Designer",
    skills: [
      "User Experience",
      "Wireframing",
      "Prototyping",
      "Design Thinking",
    ],
    rate: "$88/hr",
    showActions: true,
  },
  {
    id: "job-8",
    posterName: "Microsoft",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Feb 12",
    type: "job-listing",
    title: "Full Stack Developer",
    skills: ["Node.js", "React", "PostgreSQL", "Azure"],
    rate: "$98/hr",
    showActions: true,
  },
  {
    id: "job-9",
    posterName: "Airbnb",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Jan 20",
    type: "job-listing",
    title: "Brand Designer",
    skills: ["Branding", "Illustration", "Motion Design", "Typography"],
    rate: "$92/hr",
    showActions: true,
  },
  {
    id: "job-10",
    posterName: "Uber",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Feb 08",
    type: "job-listing",
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    rate: "$115/hr",
    showActions: true,
  },

  // Volunteers (10)
  {
    id: "vol-1",
    posterName: "Sofia Reyes",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/126a26de49b65bed95ea3235e3f7da28d7c4ccdb?width=80",
    date: "Mar 15",
    type: "volunteer",
    title: "Community Outreach Volunteer",
    skills: ["Volunteer", "Weekend-only", "NGO"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-2",
    posterName: "Aisha Patel",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714?width=80",
    date: "Nov 20",
    type: "volunteer",
    title: "Education Support Volunteer",
    skills: ["Teaching", "Mentorship", "Curriculum Design"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-3",
    posterName: "Jordan Smith",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Nov 18",
    type: "volunteer",
    title: "Environmental Conservation Volunteer",
    skills: ["Conservation", "Community Work", "Weekends"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-4",
    posterName: "Maria Garcia",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Mar 10",
    type: "volunteer",
    title: "Health Awareness Volunteer",
    skills: ["Health Education", "Public Speaking", "Community Engagement"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-5",
    posterName: "David Chen",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Mar 05",
    type: "volunteer",
    title: "Youth Mentorship Volunteer",
    skills: ["Mentoring", "Youth Development", "Career Guidance"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-6",
    posterName: "Emma Wilson",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Feb 28",
    type: "volunteer",
    title: "Animal Shelter Volunteer",
    skills: ["Animal Care", "Fundraising", "Event Planning"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-7",
    posterName: "Ahmed Hassan",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Mar 12",
    type: "volunteer",
    title: "Food Bank Volunteer",
    skills: ["Distribution", "Logistics", "Community Service"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-8",
    posterName: "Lisa Anderson",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Feb 25",
    type: "volunteer",
    title: "Elderly Care Volunteer",
    skills: ["Companionship", "Activity Planning", "Empathy"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-9",
    posterName: "Carlos Rodriguez",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Mar 08",
    type: "volunteer",
    title: "Literacy Program Volunteer",
    skills: ["Teaching", "Reading Support", "Patience"],
    rate: "",
    showActions: false,
  },
  {
    id: "vol-10",
    posterName: "Nina Okonkwo",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Mar 20",
    type: "volunteer",
    title: "Tech for Good Volunteer",
    skills: ["Digital Literacy", "Tech Training", "Community Impact"],
    rate: "",
    showActions: false,
  },

  // Part-time (10)
  {
    id: "part-1",
    posterName: "Chowdeck",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Jan 10",
    type: "part-time",
    title: "UX Designer",
    skills: ["Visual Design", "A/B Testing", "User Experience", "Sketching"],
    rate: "$2,500 - $3,000 / Month",
    showActions: true,
  },
  {
    id: "part-2",
    posterName: "Slack",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Jan 18",
    type: "part-time",
    title: "Content Strategist",
    skills: ["Content Strategy", "SEO", "Analytics", "Writing"],
    rate: "$2,000 - $2,500 / Month",
    showActions: true,
  },
  {
    id: "part-3",
    posterName: "Shopify",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Jan 22",
    type: "part-time",
    title: "Frontend Developer",
    skills: ["React", "CSS", "JavaScript", "Responsive Design"],
    rate: "$3,000 - $3,500 / Month",
    showActions: true,
  },
  {
    id: "part-4",
    posterName: "Notion",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Jan 12",
    type: "part-time",
    title: "Marketing Designer",
    skills: ["Graphic Design", "Brand Design", "Social Media", "Figma"],
    rate: "$1,800 - $2,200 / Month",
    showActions: true,
  },
  {
    id: "part-5",
    posterName: "Figma",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Jan 25",
    type: "part-time",
    title: "Product Designer",
    skills: ["UI/UX", "Prototyping", "Design Systems", "User Research"],
    rate: "$2,800 - $3,200 / Month",
    showActions: true,
  },
  {
    id: "part-6",
    posterName: "Canva",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a49ff6e7c4095ef84092ad9c082a315acb23b74f?width=80",
    date: "Jan 08",
    type: "part-time",
    title: "Illustrator",
    skills: [
      "Illustration",
      "Digital Art",
      "Character Design",
      "Adobe Illustrator",
    ],
    rate: "$25/hr",
    showActions: true,
  },
  {
    id: "part-7",
    posterName: "Webflow",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Jan 28",
    type: "part-time",
    title: "Web Developer",
    skills: ["Web Development", "CMS", "Animation", "Responsive Design"],
    rate: "$30/hr",
    showActions: true,
  },
  {
    id: "part-8",
    posterName: "Dribbble",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Jan 19",
    type: "part-time",
    title: "Visual Designer",
    skills: ["Visual Design", "Typography", "Layout", "Color Theory"],
    rate: "$28/hr",
    showActions: true,
  },
  {
    id: "part-9",
    posterName: "Adobe",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Jan 30",
    type: "part-time",
    title: "Motion Designer",
    skills: ["Motion Graphics", "Animation", "After Effects", "Video"],
    rate: "$35/hr",
    showActions: true,
  },
  {
    id: "part-10",
    posterName: "Sketch",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Jan 14",
    type: "part-time",
    title: "Design Systems Lead",
    skills: ["Design Systems", "Component Design", "Documentation"],
    rate: "$32/hr",
    showActions: true,
  },

  // Applied (8)
  {
    id: "applied-1",
    posterName: "Maya Patel",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/8231e6d86ed5fecb574745a8f76606ae8b1dcf75?width=80",
    date: "Nov 10",
    type: "part-time",
    title: "Graphic Designer",
    skills: ["Logo Design", "Branding", "Print Design", "Digital Design"],
    rate: "$25/hr",
    showActions: false,
    applicationStatus: "awaiting-review",
  },
  {
    id: "applied-2",
    posterName: "Jamison Stoltenberg",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/8231e6d86ed5fecb574745a8f76606ae8b1dcf75?width=80",
    date: "Dec 2",
    type: "job-listing",
    title: "Senior Product Manager",
    skills: ["Product Strategy", "Market Analysis", "Roadmap Planning"],
    rate: "$120/hr",
    showActions: false,
    applicationStatus: "hired",
  },
  {
    id: "applied-3",
    posterName: "Hiroki Tanaka",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/8231e6d86ed5fecb574745a8f76606ae8b1dcf75?width=80",
    date: "Oct 22",
    type: "job-listing",
    title: "Senior Software Engineer",
    skills: [
      "Backend Development",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    rate: "$75/hr",
    showActions: false,
    applicationStatus: "not-hired",
  },
  {
    id: "applied-4",
    posterName: "Akinyi Odour",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/8231e6d86ed5fecb574745a8f76606ae8b1dcf75?width=80",
    date: "Jan 2",
    type: "volunteer",
    title: "Environmental Conservation Volunteer",
    skills: ["Wildlife Monitoring", "Community Engagement", "Data Collection"],
    rate: "$60/hr",
    showActions: false,
    applicationStatus: "hired",
  },
  {
    id: "applied-5",
    posterName: "Sarah Johnson",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/b0bfb6c564a4b6600d88fa72ebf8eaa9de3ecb0c?width=80",
    date: "Nov 15",
    type: "internship",
    title: "UX Research Intern",
    skills: [
      "User Interviews",
      "Usability Testing",
      "Research Methods",
      "Analytics",
    ],
    rate: "$280 / Month",
    showActions: false,
    applicationStatus: "awaiting-review",
  },
  {
    id: "applied-6",
    posterName: "TechStars",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a6846c86fcaee5a7bd8a3fb101874efb98f0b5c2?width=80",
    date: "Oct 10",
    type: "job-listing",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    rate: "$95/hr",
    showActions: false,
    applicationStatus: "not-hired",
  },
  {
    id: "applied-7",
    posterName: "Design Co",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/9bf353c86041ee07f1b8f00fe2bfefc2c11557c6?width=80",
    date: "Nov 28",
    type: "part-time",
    title: "Brand Designer",
    skills: ["Branding", "Illustration", "Typography", "Creative Direction"],
    rate: "$2,800 - $3,500 / Month",
    showActions: false,
    applicationStatus: "hired",
  },
  {
    id: "applied-8",
    posterName: "StartupHub",
    posterAvatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    date: "Dec 5",
    type: "internship",
    title: "Marketing Intern",
    skills: ["Social Media", "Content Creation", "Analytics", "Campaigns"],
    rate: "$200 / Month",
    showActions: false,
    applicationStatus: "awaiting-review",
  },
];

const appliedOpportunities = opportunities.filter(
  (opp) => opp.applicationStatus,
);

export default function OpportunitiesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Determine which opportunities to show based on active filter
  const sourceOpportunities =
    activeFilter === "applied" ? appliedOpportunities : opportunities;

  // Filter opportunities based on active filter
  const filteredOpportunities = sourceOpportunities.filter((opportunity) => {
    // Handle filter
    if (activeFilter !== "all" && activeFilter !== "applied") {
      if (opportunity.type !== activeFilter) return false;
    }
    // Handle search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.posterName.toLowerCase().includes(query) ||
        opportunity.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">NOT IMPLEMENTED YET</p>
        <Link
          href="/profile"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          GO TO PROFILE PAGE
        </Link>
      </div>
    </div>
  );
}
