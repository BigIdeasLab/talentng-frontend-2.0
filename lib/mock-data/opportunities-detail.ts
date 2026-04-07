export interface OpportunityPublicData {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyLogoBg: string;
  companyInitials: string;
  category: string;
  type: string;
  location: string;
  experienceLevel: string;
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
  skills: string[];
  tools: string[];
  priceMode: "range" | "fixed";
  minBudget?: number;
  maxBudget?: number;
  price?: number;
  paymentType?: "hourly" | "weekly" | "monthly";
  startDate?: string;
  duration?: string;
  createdAt: string;
}

export const MOCK_OPPORTUNITY_DETAILS: Record<string, OpportunityPublicData> = {
  "opp-1": {
    id: "opp-1",
    title: "Senior Frontend Engineer",
    company: "Andela",
    companyLogo: "",
    companyLogoBg: "#3359DF",
    companyInitials: "AN",
    category: "Development",
    type: "FullTime",
    location: "Lagos, Nigeria",
    experienceLevel: "Senior",
    description:
      "We're looking for a Senior Frontend Engineer to join our growing team. You'll be responsible for building and maintaining high-quality web applications using modern frontend technologies. This role requires strong technical skills, excellent communication, and a passion for creating exceptional user experiences.",
    keyResponsibilities: [
      "Build and maintain responsive web applications using React and Next.js",
      "Collaborate with designers and backend engineers to implement new features",
      "Write clean, maintainable, and well-tested code",
      "Participate in code reviews and provide constructive feedback",
      "Mentor junior engineers and contribute to team growth",
      "Optimize application performance and ensure cross-browser compatibility",
    ],
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in React, TypeScript, and Next.js",
      "Experience with state management libraries (Redux, Zustand, etc.)",
      "Solid understanding of HTML, CSS, and modern CSS frameworks",
      "Experience with RESTful APIs and GraphQL",
      "Strong problem-solving skills and attention to detail",
      "Excellent communication and collaboration skills",
    ],
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    tools: ["VS Code", "Git", "Figma", "Jira"],
    priceMode: "range",
    minBudget: 850000,
    maxBudget: 1200000,
    paymentType: "monthly",
    startDate: "March 2026",
    duration: "Full-time",
    createdAt: "2 days ago",
  },
  "opp-2": {
    id: "opp-2",
    title: "UI/UX Designer for Mobile App",
    company: "Flutterwave",
    companyLogo: "",
    companyLogoBg: "#F5A623",
    companyInitials: "FW",
    category: "Design",
    type: "Freelance",
    location: "Remote",
    experienceLevel: "Mid-Level",
    description:
      "We're seeking a talented UI/UX Designer to redesign our mobile app experience. You'll work closely with our product team to create intuitive, beautiful interfaces that delight our users. This is a freelance project with potential for ongoing work.",
    keyResponsibilities: [
      "Conduct user research and analyze user feedback",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Design intuitive user flows and interactions",
      "Collaborate with developers to ensure design implementation",
      "Maintain and evolve our design system",
      "Present design concepts to stakeholders",
    ],
    requirements: [
      "3+ years of experience in UI/UX design",
      "Strong portfolio showcasing mobile app designs",
      "Proficiency in Figma and other design tools",
      "Understanding of iOS and Android design guidelines",
      "Experience with user research and usability testing",
      "Excellent visual design skills",
      "Strong communication and presentation skills",
    ],
    skills: ["Figma", "User Research", "Prototyping", "Mobile Design"],
    tools: ["Figma", "Sketch", "Adobe XD", "Principle"],
    priceMode: "range",
    minBudget: 500000,
    maxBudget: 750000,
    startDate: "February 2026",
    duration: "3 months",
    createdAt: "1 day ago",
  },
  "opp-3": {
    id: "opp-3",
    title: "Technical Content Writer",
    company: "Paystack",
    companyLogo: "",
    companyLogoBg: "#00C3F7",
    companyInitials: "PS",
    category: "Writing",
    type: "FullTime",
    location: "Lagos, Nigeria",
    experienceLevel: "Mid-Level",
    description:
      "Join our developer relations team as a Technical Content Writer. You'll create comprehensive documentation, tutorials, and guides that help developers integrate with our payment APIs. This role requires both technical knowledge and excellent writing skills.",
    keyResponsibilities: [
      "Write clear, comprehensive API documentation",
      "Create tutorials and integration guides for developers",
      "Maintain and update existing documentation",
      "Collaborate with engineering teams to understand new features",
      "Review and edit technical content from other team members",
      "Gather feedback from developers and improve documentation",
    ],
    requirements: [
      "2+ years of experience in technical writing",
      "Strong understanding of APIs and web development",
      "Experience with Markdown and documentation tools",
      "Ability to explain complex technical concepts clearly",
      "Familiarity with payment systems is a plus",
      "Excellent writing and editing skills",
      "Self-motivated and detail-oriented",
    ],
    skills: ["API Documentation", "Technical Writing", "Markdown", "Developer Tools"],
    tools: ["Markdown", "Git", "Postman", "VS Code"],
    priceMode: "range",
    minBudget: 450000,
    maxBudget: 600000,
    paymentType: "monthly",
    startDate: "March 2026",
    duration: "Full-time",
    createdAt: "3 days ago",
  },
  "opp-4": {
    id: "opp-4",
    title: "Product Design Intern",
    company: "Kuda Bank",
    companyLogo: "",
    companyLogoBg: "#5C30FF",
    companyInitials: "KB",
    category: "Design",
    type: "Internship",
    location: "Lagos, Nigeria",
    experienceLevel: "Entry Level",
    description:
      "We're offering an exciting internship opportunity for aspiring product designers. You'll work alongside our design team on real projects, learning about fintech product design and gaining hands-on experience with industry-standard tools and processes.",
    keyResponsibilities: [
      "Assist in creating wireframes and mockups",
      "Participate in design critiques and brainstorming sessions",
      "Conduct user research and usability testing",
      "Help maintain our design system",
      "Create design assets for marketing and product teams",
      "Learn about fintech product design best practices",
    ],
    requirements: [
      "Currently pursuing or recently completed a degree in Design or related field",
      "Basic knowledge of Figma or similar design tools",
      "Understanding of design thinking principles",
      "Strong visual design skills",
      "Eagerness to learn and grow",
      "Good communication skills",
      "Portfolio showcasing design work (academic or personal projects)",
    ],
    skills: ["Figma", "Design Thinking", "Wireframing"],
    tools: ["Figma", "Adobe Creative Suite"],
    priceMode: "fixed",
    price: 150000,
    paymentType: "monthly",
    startDate: "March 2026",
    duration: "6 months",
    createdAt: "5 days ago",
  },
  "opp-5": {
    id: "opp-5",
    title: "Motion Graphics Designer",
    company: "Cowrywise",
    companyLogo: "",
    companyLogoBg: "#0066F5",
    companyInitials: "CW",
    category: "Video & Animation",
    type: "Freelance",
    location: "Remote",
    experienceLevel: "Senior",
    description:
      "We need a skilled Motion Graphics Designer to create engaging animated content for our marketing campaigns. You'll produce explainer videos, social media animations, and other motion graphics that bring our brand to life.",
    keyResponsibilities: [
      "Create motion graphics for marketing campaigns",
      "Design and animate explainer videos",
      "Produce social media animations and GIFs",
      "Collaborate with marketing team on creative concepts",
      "Ensure brand consistency across all animations",
      "Deliver high-quality work within deadlines",
    ],
    requirements: [
      "4+ years of experience in motion graphics",
      "Expert proficiency in After Effects and Cinema 4D",
      "Strong portfolio showcasing motion design work",
      "Understanding of animation principles",
      "Experience with illustration and storyboarding",
      "Ability to work independently and meet deadlines",
      "Strong attention to detail",
    ],
    skills: ["After Effects", "Cinema 4D", "Illustration", "Storyboarding"],
    tools: ["After Effects", "Cinema 4D", "Illustrator", "Premiere Pro"],
    priceMode: "range",
    minBudget: 400000,
    maxBudget: 600000,
    startDate: "February 2026",
    duration: "2 months",
    createdAt: "1 week ago",
  },
  "opp-6": {
    id: "opp-6",
    title: "Backend Engineer (Java)",
    company: "Interswitch",
    companyLogo: "",
    companyLogoBg: "#ED1C24",
    companyInitials: "IS",
    category: "Development",
    type: "Contract",
    location: "Lagos, Nigeria",
    experienceLevel: "Senior",
    description:
      "We're looking for an experienced Backend Engineer with strong Java skills to join our payments infrastructure team. You'll work on building and maintaining scalable microservices that process millions of transactions daily.",
    keyResponsibilities: [
      "Design and develop microservices using Java and Spring Boot",
      "Build and maintain RESTful APIs",
      "Optimize database queries and improve system performance",
      "Implement security best practices",
      "Write unit and integration tests",
      "Participate in code reviews and technical discussions",
      "Troubleshoot and resolve production issues",
    ],
    requirements: [
      "5+ years of experience in backend development",
      "Strong proficiency in Java and Spring Boot",
      "Experience with microservices architecture",
      "Solid understanding of PostgreSQL or similar databases",
      "Experience with message queues (RabbitMQ, Kafka)",
      "Knowledge of Docker and Kubernetes",
      "Strong problem-solving and debugging skills",
    ],
    skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL"],
    tools: ["IntelliJ IDEA", "Docker", "Kubernetes", "Git"],
    priceMode: "range",
    minBudget: 900000,
    maxBudget: 1500000,
    paymentType: "monthly",
    startDate: "March 2026",
    duration: "6 months",
    createdAt: "4 days ago",
  },
};

export function getOpportunityPublicProfile(id: string): OpportunityPublicData | null {
  return MOCK_OPPORTUNITY_DETAILS[id] || null;
}
