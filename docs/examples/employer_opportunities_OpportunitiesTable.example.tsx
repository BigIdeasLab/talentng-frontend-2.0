import { OpportunitiesTable } from "./OpportunitiesTable";
import type { OpportunityCard } from "@/lib/types";

export default {
  title: "Employer/Opportunities/OpportunitiesTable",
  component: OpportunitiesTable,
};

const mockOpportunities: OpportunityCard[] = [
  {
    id: "opp-1",
    title: "Senior Frontend Developer",
    companyName: "Tech Innovations Ltd",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=TI",
    category: "Engineering",
    type: "job-listing",
    location: "Lagos, Nigeria",
    priceMode: "range",
    minBudget: 500000,
    maxBudget: 800000,
    paymentType: "monthly",
    applicantsCount: 15,
    date: "2 days ago",
    status: "active",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    price: 0,
    duration: "6 months",
    applicationCap: 0,
    rate: "",
  },
  {
    id: "opp-2",
    title: "Backend Engineer",
    companyName: "DataFlow Systems",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=DF",
    category: "Engineering",
    type: "job-listing",
    location: "Remote",
    priceMode: "fixed",
    price: 600000,
    paymentType: "monthly",
    applicantsCount: 8,
    date: "5 days ago",
    status: "active",
    skills: ["Node.js", "PostgreSQL", "Docker"],
    minBudget: 0,
    maxBudget: 0,
    duration: "Full-time",
    applicationCap: 0,
    rate: "",
  },
  {
    id: "opp-3",
    title: "UI/UX Designer",
    companyName: "Creative Studio",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=CS",
    category: "Design",
    type: "internship",
    location: "Abuja, Nigeria",
    priceMode: "fixed",
    price: 150000,
    paymentType: "monthly",
    applicantsCount: 23,
    date: "1 week ago",
    status: "active",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    minBudget: 0,
    maxBudget: 0,
    duration: "3 months",
    applicationCap: 0,
    rate: "",
  },
  {
    id: "opp-4",
    title: "Community Manager",
    companyName: "Social Impact Hub",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=SI",
    category: "Marketing",
    type: "volunteer",
    location: "Remote",
    priceMode: "fixed",
    price: 0,
    paymentType: "monthly",
    applicantsCount: 12,
    date: "3 days ago",
    status: "active",
    skills: ["Social Media", "Community Building", "Content Creation"],
    minBudget: 0,
    maxBudget: 0,
    duration: "Ongoing",
    applicationCap: 0,
    rate: "",
  },
  {
    id: "opp-5",
    title: "Mobile App Developer",
    companyName: "AppWorks Inc",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=AW",
    category: "Engineering",
    type: "job-listing",
    location: "Port Harcourt, Nigeria",
    priceMode: "range",
    minBudget: 400000,
    maxBudget: 700000,
    paymentType: "monthly",
    applicantsCount: 19,
    date: "1 day ago",
    status: "active",
    skills: ["React Native", "iOS", "Android"],
    price: 0,
    duration: "Full-time",
    applicationCap: 0,
    rate: "",
  },
];

const draftOpportunities: OpportunityCard[] = [
  {
    id: "draft-1",
    title: "Data Scientist",
    companyName: "Analytics Pro",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=AP",
    category: "Data Science",
    type: "job-listing",
    location: "Lagos, Nigeria",
    priceMode: "range",
    minBudget: 700000,
    maxBudget: 1000000,
    paymentType: "monthly",
    applicantsCount: 0,
    date: "Just now",
    status: "draft",
    skills: ["Python", "Machine Learning", "SQL"],
    price: 0,
    duration: "Full-time",
    applicationCap: 0,
    rate: "",
  },
  {
    id: "draft-2",
    title: "Content Writer",
    companyName: "Media House",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=MH",
    category: "Content",
    type: "internship",
    location: "Remote",
    priceMode: "fixed",
    price: 100000,
    paymentType: "monthly",
    applicantsCount: 0,
    date: "Just now",
    status: "draft",
    skills: ["Writing", "SEO", "Research"],
    minBudget: 0,
    maxBudget: 0,
    duration: "3 months",
    applicationCap: 0,
    rate: "",
  },
];

const closedOpportunities: OpportunityCard[] = [
  {
    id: "closed-1",
    title: "Product Manager",
    companyName: "StartupX",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=SX",
    category: "Product",
    type: "job-listing",
    location: "Lagos, Nigeria",
    priceMode: "fixed",
    price: 900000,
    paymentType: "monthly",
    applicantsCount: 45,
    date: "2 weeks ago",
    status: "closed",
    skills: ["Product Strategy", "Agile", "User Research"],
    minBudget: 0,
    maxBudget: 0,
    duration: "Full-time",
    applicationCap: 50,
    rate: "",
  },
  {
    id: "closed-2",
    title: "DevOps Engineer",
    companyName: "CloudTech",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=CT",
    category: "Engineering",
    type: "job-listing",
    location: "Remote",
    priceMode: "range",
    minBudget: 600000,
    maxBudget: 900000,
    paymentType: "monthly",
    applicantsCount: 32,
    date: "1 month ago",
    status: "closed",
    skills: ["AWS", "Kubernetes", "CI/CD"],
    price: 0,
    duration: "Full-time",
    applicationCap: 0,
    rate: "",
  },
];

export const OpenOpportunities = () => (
  <div className="p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4">Open Opportunities</h2>
    <OpportunitiesTable opportunities={mockOpportunities} activeTab="open" />
  </div>
);

export const DraftOpportunities = () => (
  <div className="p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4">Draft Opportunities</h2>
    <OpportunitiesTable opportunities={draftOpportunities} activeTab="draft" />
  </div>
);

export const ClosedOpportunities = () => (
  <div className="p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4">Closed Opportunities</h2>
    <OpportunitiesTable
      opportunities={closedOpportunities}
      activeTab="closed"
    />
  </div>
);

export const EmptyState = () => (
  <div className="p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4">No Opportunities</h2>
    <OpportunitiesTable opportunities={[]} activeTab="open" />
  </div>
);

export const SingleOpportunity = () => (
  <div className="p-6 bg-white">
    <h2 className="text-xl font-semibold mb-4">Single Opportunity</h2>
    <OpportunitiesTable
      opportunities={[mockOpportunities[0]]}
      activeTab="open"
    />
  </div>
);

export const MixedTypes = () => {
  const mixedOpportunities: OpportunityCard[] = [
    mockOpportunities[0], // Job listing with range
    mockOpportunities[1], // Job listing with fixed price
    mockOpportunities[2], // Internship
    mockOpportunities[3], // Volunteer
  ];

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Mixed Opportunity Types</h2>
      <OpportunitiesTable opportunities={mixedOpportunities} activeTab="open" />
    </div>
  );
};

export const WithMutationCallback = () => {
  const handleMutationSuccess = () => {
    console.log("Mutation successful! Refetching data...");
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">
        With Mutation Success Callback
      </h2>
      <OpportunitiesTable
        opportunities={mockOpportunities}
        activeTab="open"
        onMutationSuccess={handleMutationSuccess}
      />
    </div>
  );
};
