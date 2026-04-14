export interface Service {
  id: string;
  title: string;
  about: string;
  price?: string;
  images: string[];
  tags: string[];
  averageRating: number;
  totalReviews: number;
}

export interface TalentPublicData {
  userId: string;
  fullName: string;
  headline: string;
  avatar: string;
  location: string;
  timesHired: number;
  availability: string[];
  category: string;
  bio?: string;
  skills: string[];
  stack: string[];
  gallery: string[];
  services?: Service[];
  experience?: {
    title: string;
    company: string;
    duration: string;
  }[];
}

export const MOCK_TALENT_DETAILS: Record<string, TalentPublicData> = {
  "talent-1": {
    userId: "talent-1",
    fullName: "Ifeoma Chijioke",
    headline: "UX/UI Designer",
    avatar: "/default.png",
    location: "Lagos, Nigeria",
    timesHired: 3,
    availability: ["Full-time"],
    category: "Designer",
    bio: "Passionate UX/UI designer with 5+ years of experience creating intuitive and beautiful digital experiences. I specialize in mobile app design, user research, and design systems. My approach combines data-driven insights with creative problem-solving to deliver products that users love.",
    skills: [
      "Mobile App Design",
      "User Research",
      "Visual Design",
      "Wireframing",
    ],
    stack: ["Figma", "Sketch", "Adobe XD"],
    gallery: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
    ],
    services: [
      {
        id: "service-1",
        title: "Mobile App UI/UX Design",
        about: "Complete mobile app design from wireframes to high-fidelity mockups. Includes user research, prototyping, and design system creation.",
        price: "$2,500 - $5,000",
        images: [
          "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
        ],
        tags: ["Mobile Design", "UI/UX", "Prototyping"],
        averageRating: 4.8,
        totalReviews: 12,
      },
      {
        id: "service-2",
        title: "Design System Creation",
        about: "Build scalable design systems with comprehensive component libraries, style guides, and documentation for your product.",
        price: "$3,000 - $7,000",
        images: [
          "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
        ],
        tags: ["Design System", "Components", "Documentation"],
        averageRating: 5.0,
        totalReviews: 8,
      },
    ],
    experience: [
      {
        title: "Senior UX Designer",
        company: "Paystack",
        duration: "2021 - Present",
      },
      {
        title: "UX Designer",
        company: "Flutterwave",
        duration: "2019 - 2021",
      },
    ],
  },
  "talent-2": {
    userId: "talent-2",
    fullName: "Chijioke Olaniyi",
    headline: "Web Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/77a2d0f5eaf5e0f9f0f0c283d2661d2eaacaca2e?width=80",
    location: "Abuja, Nigeria",
    timesHired: 4,
    availability: ["Freelance"],
    category: "Designer",
    bio: "Creative web designer focused on building responsive, SEO-optimized websites that drive results. I work with businesses to establish their online presence through modern, user-friendly designs that convert visitors into customers.",
    skills: [
      "Website Design",
      "SEO Optimization",
      "Responsive Design",
      "User Testing",
    ],
    stack: ["WordPress", "Webflow", "HTML/CSS"],
    gallery: [
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
    ],
    services: [
      {
        id: "service-3",
        title: "Business Website Design",
        about: "Professional website design for small to medium businesses. Includes responsive design, SEO optimization, and content management system setup.",
        price: "$1,500 - $3,500",
        images: [
          "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
        ],
        tags: ["Web Design", "SEO", "Responsive"],
        averageRating: 4.7,
        totalReviews: 15,
      },
    ],
    experience: [
      {
        title: "Freelance Web Designer",
        company: "Self-Employed",
        duration: "2020 - Present",
      },
    ],
  },
  "talent-3": {
    userId: "talent-3",
    fullName: "Oluwatobi Adeyemi",
    headline: "Interaction Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04?width=80",
    location: "Port Harcourt, Nigeria",
    timesHired: 2,
    availability: ["Contract"],
    category: "Designer",
    bio: "Interaction designer specializing in game design and 3D experiences. I create engaging, immersive digital experiences that captivate users through thoughtful interaction patterns and stunning visuals.",
    skills: ["Game Design", "Usability Testing", "3D Modeling", "Animation"],
    stack: ["Unity", "Blender", "Figma"],
    gallery: [
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/57203417be73ef060acdf909d231697c0fcd461a?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
    ],
  },
  "talent-4": {
    userId: "talent-4",
    fullName: "Seyi Olufemi",
    headline: "Motion Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    location: "Kaduna, Nigeria",
    timesHired: 3,
    availability: ["Full-time"],
    category: "Animator",
    bio: "Motion designer bringing brands to life through animation and visual effects. I specialize in creating engaging animated content for digital platforms, from UI animations to full-scale motion graphics projects.",
    skills: ["Animated UI", "Storyboarding", "Visual Effects", "Editing"],
    stack: ["After Effects", "Cinema 4D", "Lottie"],
    gallery: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/4b5ccf771678a302123ebfcfa1c5244ab0d6b3f7?width=488",
    ],
    experience: [
      {
        title: "Motion Designer",
        company: "Kuda Bank",
        duration: "2022 - Present",
      },
    ],
  },
  "talent-5": {
    userId: "talent-5",
    fullName: "Dolapo Ajayi",
    headline: "Product Designer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/a9db3f53587de9205b8fd3d8d8a5e49e78a22ec6?width=80",
    location: "Enugu, Nigeria",
    timesHired: 1,
    availability: ["Freelance"],
    category: "Designer",
    bio: "Product designer with a focus on SaaS products and accessibility. I believe great design should be inclusive and accessible to everyone, and I work to ensure every product I touch meets the highest standards of usability.",
    skills: [
      "SaaS Design",
      "Accessibility Design",
      "Information Architecture",
      "Sketching",
    ],
    stack: ["Figma", "Framer", "Notion"],
    gallery: [
      "https://api.builder.io/api/v1/image/assets/TEMP/4c62644e1b187e2323da216c7c651406c5624fe4?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2799e8adb32e8bdd5314241b333ed775c0f0a244?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/57203417be73ef060acdf909d231697c0fcd461a?width=488",
    ],
  },
  "talent-6": {
    userId: "talent-6",
    fullName: "Kunle Adekunle",
    headline: "Frontend Developer",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    location: "Lagos, Nigeria",
    timesHired: 5,
    availability: ["Full-time", "Contract"],
    category: "Developer",
    bio: "Frontend developer passionate about building fast, accessible, and beautiful web applications. I specialize in React and Next.js, with a strong focus on performance optimization and user experience.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    stack: ["VS Code", "Git", "Vercel"],
    gallery: [
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
      "https://api.builder.io/api/v1/image/assets/TEMP/f2bcc167c0b44303cd48ca8e3d28e540c4d2a77d?width=490",
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
    ],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "Andela",
        duration: "2020 - Present",
      },
      {
        title: "Frontend Developer",
        company: "Interswitch",
        duration: "2018 - 2020",
      },
    ],
  },
};

export function getTalentPublicProfile(
  userId: string,
): TalentPublicData | null {
  return MOCK_TALENT_DETAILS[userId] || null;
}
