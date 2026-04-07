export interface RecruiterPublicData {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  jobsPosted: number;
  talentsHired: number;
  description: string;
  hiringFor: string[];
  logoBg: string;
  initials: string;
  companyLogo?: string;
  openPositions: {
    id: string;
    title: string;
    type: string;
    location: string;
    postedDate: string;
  }[];
}

export const MOCK_RECRUITER_DETAILS: Record<string, RecruiterPublicData> = {
  "1": {
    id: "1",
    companyName: "Andela",
    industry: "Technology",
    location: "Lagos, Nigeria",
    jobsPosted: 12,
    talentsHired: 45,
    description:
      "Andela is a global talent network that connects companies with vetted, senior software engineers in Africa. We're building a network of the world's most talented technologists and helping them unlock opportunities with leading companies globally. Our mission is to advance human potential by connecting brilliance with opportunity.",
    hiringFor: [
      "Software Engineers",
      "DevOps",
      "Product Managers",
      "Data Scientists",
    ],
    logoBg: "#3359DF",
    initials: "AN",
    openPositions: [
      {
        id: "opp-1",
        title: "Senior Frontend Engineer",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "2 days ago",
      },
      {
        id: "opp-7",
        title: "Backend Engineer (Python)",
        type: "FullTime",
        location: "Remote",
        postedDate: "1 week ago",
      },
      {
        id: "opp-8",
        title: "DevOps Engineer",
        type: "Contract",
        location: "Lagos, Nigeria",
        postedDate: "3 days ago",
      },
    ],
  },
  "2": {
    id: "2",
    companyName: "Flutterwave",
    industry: "Fintech",
    location: "Lagos, Nigeria",
    jobsPosted: 8,
    talentsHired: 32,
    description:
      "Flutterwave provides a payment infrastructure that helps businesses and individuals make and accept payments across Africa. We're on a mission to simplify payments for endless possibilities. Our technology powers payments for some of Africa's biggest brands and we're expanding rapidly across the continent.",
    hiringFor: [
      "Backend Engineers",
      "UI/UX Designers",
      "Marketing",
      "Compliance",
    ],
    logoBg: "#F5A623",
    initials: "FW",
    openPositions: [
      {
        id: "opp-2",
        title: "UI/UX Designer for Mobile App",
        type: "Freelance",
        location: "Remote",
        postedDate: "1 day ago",
      },
      {
        id: "opp-9",
        title: "Senior Backend Engineer",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "5 days ago",
      },
    ],
  },
  "3": {
    id: "3",
    companyName: "Paystack",
    industry: "Fintech",
    location: "Lagos, Nigeria",
    jobsPosted: 6,
    talentsHired: 28,
    description:
      "Paystack helps businesses in Africa get paid by anyone, anywhere in the world. We make it easy for businesses to accept payments from their customers via credit card, debit card, money transfer and mobile money. We're a Stripe company, and we're building the payment infrastructure for Africa's next generation of businesses.",
    hiringFor: ["Frontend Engineers", "Technical Writers", "Support Engineers"],
    logoBg: "#00C3F7",
    initials: "PS",
    openPositions: [
      {
        id: "opp-3",
        title: "Technical Content Writer",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "3 days ago",
      },
      {
        id: "opp-10",
        title: "Frontend Engineer (React)",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "1 week ago",
      },
    ],
  },
  "4": {
    id: "4",
    companyName: "Kuda Bank",
    industry: "Banking",
    location: "Lagos, Nigeria",
    jobsPosted: 10,
    talentsHired: 38,
    description:
      "Kuda is the money app for Africans. We're building a digital bank that offers free transfers, budgeting tools, and savings features to help Africans take control of their finances. Our mission is to make financial services accessible, affordable, and simple for everyone in Africa.",
    hiringFor: [
      "Mobile Developers",
      "QA Engineers",
      "Product Designers",
      "Data Analysts",
    ],
    logoBg: "#5C30FF",
    initials: "KB",
    openPositions: [
      {
        id: "opp-4",
        title: "Product Design Intern",
        type: "Internship",
        location: "Lagos, Nigeria",
        postedDate: "5 days ago",
      },
      {
        id: "opp-11",
        title: "iOS Developer",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "4 days ago",
      },
      {
        id: "opp-12",
        title: "QA Engineer",
        type: "Contract",
        location: "Remote",
        postedDate: "1 week ago",
      },
    ],
  },
  "5": {
    id: "5",
    companyName: "Cowrywise",
    industry: "Fintech",
    location: "Lagos, Nigeria",
    jobsPosted: 5,
    talentsHired: 15,
    description:
      "Cowrywise is a savings and investment platform that helps users grow their wealth with automated plans. We make it easy for Africans to save and invest in mutual funds, treasury bills, and other investment products. Our goal is to democratize wealth creation and make investing accessible to everyone.",
    hiringFor: ["Full Stack Developers", "Illustrators", "Content Writers"],
    logoBg: "#0066F5",
    initials: "CW",
    openPositions: [
      {
        id: "opp-5",
        title: "Motion Graphics Designer",
        type: "Freelance",
        location: "Remote",
        postedDate: "1 week ago",
      },
      {
        id: "opp-13",
        title: "Full Stack Developer",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "6 days ago",
      },
    ],
  },
  "6": {
    id: "6",
    companyName: "Interswitch",
    industry: "Technology",
    location: "Lagos, Nigeria",
    jobsPosted: 15,
    talentsHired: 60,
    description:
      "Interswitch is an integrated digital payments and commerce company driving the transformation of payment systems in Africa. We provide payment processing, switching, and settlement services to banks, merchants, and consumers across Africa. With over 20 years of experience, we're at the forefront of Africa's digital payment revolution.",
    hiringFor: [
      "Java Developers",
      "Security Engineers",
      "Project Managers",
      "Business Analysts",
    ],
    logoBg: "#ED1C24",
    initials: "IS",
    openPositions: [
      {
        id: "opp-6",
        title: "Backend Engineer (Java)",
        type: "Contract",
        location: "Lagos, Nigeria",
        postedDate: "4 days ago",
      },
      {
        id: "opp-14",
        title: "Security Engineer",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "2 days ago",
      },
      {
        id: "opp-15",
        title: "Project Manager",
        type: "FullTime",
        location: "Lagos, Nigeria",
        postedDate: "1 week ago",
      },
    ],
  },
};

export function getRecruiterPublicProfile(
  id: string,
): RecruiterPublicData | null {
  return MOCK_RECRUITER_DETAILS[id] || null;
}
