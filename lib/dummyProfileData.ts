import { APIProfileData, UIProfileData, mapAPIToUI } from "./profileMapper";

/**
 * Backend API format - this is the raw data format from the backend
 */
export const dummyAPIProfileData: APIProfileData = {
  fullName: "Akanbi David",
  headline: "Product & Interaction Designer | UI/UX Specialist",
  bio: "Passionate designer with 5+ years of experience creating intuitive and beautiful digital experiences. I specialize in crafting user-centered designs that solve real problems and drive business growth. Proficient in design systems, prototyping, and user research methodologies.",
  phoneNumber: "+234 (0) 703 456 7890",
  location: "Ikeja, Lagos",
  profileImageUrl: "/lucas-gouvea.jpg",
  skills: [
    "Website Design",
    "Ui/Ux Design",
    "Interface Design",
    "Interaction Design",
    "Presentation Design",
    "User Research",
    "Wireframing",
    "Design Systems",
  ],
  stack: [
    "Figma",
    "Rive",
    "Webflow",
    "Lottie",
    "Framer",
    "Adobe XD",
    "Sketch",
    "InVision",
  ],
  workExperience: [
    {
      company: "Innovate Design Studio",
      position: "Senior UI/UX Designer",
      startDate: "2022-03-01",
      endDate: null,
      description:
        "Led design for multiple SaaS products, managing a team of 3 designers. Implemented comprehensive design system that reduced design-to-development time by 40%. Conducted user research and usability testing to inform product decisions.",
      location: "Lagos, Nigeria",
    },
    {
      company: "TechFlow Solutions",
      position: "UI/UX Designer",
      startDate: "2020-06-15",
      endDate: "2022-02-28",
      description:
        "Designed and prototyped mobile and web applications for fintech clients. Collaborated with product managers and developers to deliver user-centric solutions. Improved app onboarding flow, increasing user retention by 25%.",
      location: "Remote",
    },
    {
      company: "Creative Agency Partners",
      position: "Junior UI Designer",
      startDate: "2019-01-10",
      endDate: "2020-05-31",
      description:
        "Created UI designs for various client projects across different industries. Learned design fundamentals, brand identity, and visual communication. Assisted in conducting user interviews and creating wireframes.",
      location: "Lagos, Nigeria",
    },
  ],
  education: [
    {
      school: "University of Lagos",
      degree: "Bachelor of Science",
      field: "Mass Communication",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      description:
        "Focused on digital media and user communication. Completed thesis on design thinking and user experience in digital platforms. Graduated with Second Class Upper Honours.",
    },
    {
      school: "Interaction Design Foundation",
      degree: "Certification",
      field: "UX Design",
      startDate: "2019-03-01",
      endDate: "2019-08-31",
      description:
        "Completed comprehensive online course covering UX fundamentals, user research methods, interaction design principles, and usability testing. Gained practical skills in design tools and methodologies.",
    },
    {
      school: "Google Career Certificates",
      degree: "Professional Certificate",
      field: "Google UX Design",
      startDate: "2020-01-01",
      endDate: "2020-04-30",
      description:
        "Completed Google's UX Design specialization program covering wireframing, prototyping, and usability research. Built portfolio projects demonstrating design thinking process.",
    },
  ],
  resumeUrl: "https://example.com/resumes/akanbi-david-resume-2024.pdf",
  portfolioItems: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with modern UI/UX",
      url: "https://example-shop.com",
      image: "https://example.com/portfolio1.jpg",
      technologies: ["Figma", "React", "Node.js"],
    },
  ],
  links: {
    dribbble: "https://dribbble.com/akanbi-david",
    telegram: "https://t.me/akanbidavid",
    twitter: "https://twitter.com/akanbidavid",
    instagram: "https://instagram.com/akanbidavid",
    linkedin: "https://linkedin.com/in/akanbi-david",
    github: "https://github.com/akanbi-david",
    portfolio: "https://akanbi-david.com",
  },
  company: "Innovate Design Studio",
  preferredRole: "Lead Product Designer",
  availability: "Available - Freelance/Contract",
  description:
    "Senior UI/UX Designer with expertise in designing scalable design systems and leading cross-functional teams. Passionate about accessibility, user research, and creating products that users love. I've led design initiatives from concept to launch, resulting in improved user engagement and retention metrics.",
};

/**
 * UI-friendly format - mapped from API data for use in components
 * Use this in your profile page and edit page
 */
export const dummyUIProfileData: UIProfileData =
  mapAPIToUI(dummyAPIProfileData);
