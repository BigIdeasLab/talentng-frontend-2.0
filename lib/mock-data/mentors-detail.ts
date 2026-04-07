export interface MentorPublicData {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar: string;
  location?: string;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  sessionDuration: number;
  bio?: string;
  expertise: string[];
  industries: string[];
  stack: string[];
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
}

export const MOCK_MENTOR_DETAILS: Record<string, MentorPublicData> = {
  "mentor-1": {
    id: "mentor-1",
    name: "Adaobi Nwosu",
    title: "Senior Product Designer",
    company: "Google",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
    location: "Lagos, Nigeria",
    rating: 4.9,
    totalReviews: 24,
    totalSessions: 156,
    sessionDuration: 60,
    bio: "I'm a Senior Product Designer at Google with over 8 years of experience in the tech industry. I'm passionate about helping aspiring designers navigate their careers, build strong portfolios, and develop the skills needed to succeed in top tech companies. My mentorship focuses on practical, real-world design challenges and career growth strategies.",
    expertise: ["UI/UX Design", "Design Systems", "User Research", "Career Growth"],
    industries: ["Technology", "Fintech", "E-commerce"],
    stack: ["Figma", "Sketch", "Adobe XD", "Framer"],
    reviews: [
      {
        id: "rev-1",
        rating: 5,
        comment:
          "Adaobi is an amazing mentor! She helped me restructure my portfolio and gave me actionable feedback that landed me my dream job. Highly recommend!",
        author: "Chioma O.",
        date: "2 weeks ago",
      },
      {
        id: "rev-2",
        rating: 5,
        comment:
          "Very insightful session. Adaobi's experience at Google really shows in her advice. She helped me understand design systems better.",
        author: "Tunde A.",
        date: "1 month ago",
      },
      {
        id: "rev-3",
        rating: 4,
        comment: "Great mentor with practical advice. Would have loved more time to discuss my specific challenges.",
        author: "Ngozi E.",
        date: "2 months ago",
      },
    ],
  },
  "mentor-2": {
    id: "mentor-2",
    name: "Emeka Okafor",
    title: "Staff Software Engineer",
    company: "Meta",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/abafb32ec62d33c6dc1db2acdfdb79d6322daeb8?width=490",
    location: "Abuja, Nigeria",
    rating: 4.8,
    totalReviews: 18,
    totalSessions: 98,
    sessionDuration: 60,
    bio: "Staff Software Engineer at Meta with expertise in React, system design, and engineering leadership. I mentor engineers looking to level up their technical skills, prepare for FAANG interviews, and navigate career transitions. My sessions are hands-on and focused on solving real problems.",
    expertise: ["React", "System Design", "Career Growth", "Interview Prep"],
    industries: ["Technology", "Social Media", "Cloud Computing"],
    stack: ["React", "TypeScript", "Node.js", "AWS"],
    reviews: [
      {
        id: "rev-4",
        rating: 5,
        comment: "Emeka helped me ace my Meta interview! His system design guidance was invaluable.",
        author: "Kunle A.",
        date: "3 weeks ago",
      },
      {
        id: "rev-5",
        rating: 4,
        comment: "Solid technical mentor. Really knows his stuff about React and system architecture.",
        author: "Fatima B.",
        date: "1 month ago",
      },
    ],
  },
  "mentor-3": {
    id: "mentor-3",
    name: "Fatima Bello",
    title: "VP of Engineering",
    company: "Paystack",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/fc364c1b170e8ee75899e80f32697affc980bc5b?width=490",
    location: "Lagos, Nigeria",
    rating: 5.0,
    totalReviews: 31,
    totalSessions: 187,
    sessionDuration: 60,
    bio: "VP of Engineering at Paystack with 12+ years of experience building and leading engineering teams. I specialize in helping engineers transition into leadership roles, build high-performing teams, and navigate the challenges of scaling engineering organizations. My mentorship is ideal for senior engineers and engineering managers.",
    expertise: ["Engineering Leadership", "Team Building", "Mentorship", "Career Strategy"],
    industries: ["Fintech", "Technology", "Payments"],
    stack: ["Python", "Go", "Kubernetes", "PostgreSQL"],
    reviews: [
      {
        id: "rev-6",
        rating: 5,
        comment:
          "Fatima's leadership insights are gold. She helped me transition from senior engineer to engineering manager successfully.",
        author: "Yusuf I.",
        date: "1 week ago",
      },
      {
        id: "rev-7",
        rating: 5,
        comment: "Best mentor I've worked with. Her experience at Paystack brings real-world context to every discussion.",
        author: "Dolapo A.",
        date: "2 weeks ago",
      },
      {
        id: "rev-8",
        rating: 5,
        comment: "Fatima helped me build a roadmap for my engineering career. Highly recommend for anyone in leadership.",
        author: "Seyi O.",
        date: "1 month ago",
      },
    ],
  },
  "mentor-4": {
    id: "mentor-4",
    name: "Tunde Adebayo",
    title: "Product Manager",
    company: "Flutterwave",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/4c62644e1b187e2323da216c7c651406c5624fe4?width=490",
    location: "Lagos, Nigeria",
    rating: 4.7,
    totalReviews: 15,
    totalSessions: 72,
    sessionDuration: 60,
    bio: "Product Manager at Flutterwave with a focus on growth and product strategy. I help aspiring PMs break into product management, develop product sense, and learn how to work effectively with engineering and design teams. My sessions cover everything from product roadmaps to stakeholder management.",
    expertise: ["Product Strategy", "Growth", "Stakeholder Management", "Product Roadmaps"],
    industries: ["Fintech", "Technology", "Payments"],
    stack: ["Jira", "Figma", "Amplitude", "Mixpanel"],
    reviews: [
      {
        id: "rev-9",
        rating: 5,
        comment: "Tunde's product strategy framework helped me land my first PM role. Very practical advice!",
        author: "Ifeoma C.",
        date: "2 weeks ago",
      },
      {
        id: "rev-10",
        rating: 4,
        comment: "Good session on stakeholder management. Would love more time to dive deeper into metrics.",
        author: "Oluwatobi A.",
        date: "1 month ago",
      },
    ],
  },
  "mentor-5": {
    id: "mentor-5",
    name: "Ngozi Eze",
    title: "Data Science Lead",
    company: "Andela",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/298eb50fb8577b41f6d5b1a3cbb571ec8ca50903?width=488",
    location: "Port Harcourt, Nigeria",
    rating: 4.9,
    totalReviews: 22,
    totalSessions: 134,
    sessionDuration: 60,
    bio: "Data Science Lead at Andela specializing in machine learning, Python, and data analytics. I mentor data scientists and analysts looking to advance their careers, build ML models, and transition into data science roles. My approach combines theory with hands-on projects.",
    expertise: ["Machine Learning", "Python", "Data Analytics", "Career Transition"],
    industries: ["Technology", "Finance", "Healthcare"],
    stack: ["Python", "TensorFlow", "Pandas", "SQL"],
    reviews: [
      {
        id: "rev-11",
        rating: 5,
        comment: "Ngozi helped me understand ML concepts I struggled with for months. Excellent teacher!",
        author: "Chijioke O.",
        date: "1 week ago",
      },
      {
        id: "rev-12",
        rating: 5,
        comment: "Very patient and knowledgeable. Her Python tips improved my code quality significantly.",
        author: "Adaobi N.",
        date: "3 weeks ago",
      },
    ],
  },
  "mentor-6": {
    id: "mentor-6",
    name: "Yusuf Ibrahim",
    title: "Marketing Director",
    company: "Kuda Bank",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/2455ab581201c60a7e0e008456711c94d958cb07?width=488",
    location: "Lagos, Nigeria",
    rating: 4.6,
    totalReviews: 12,
    totalSessions: 58,
    sessionDuration: 60,
    bio: "Marketing Director at Kuda Bank with expertise in digital marketing, brand strategy, and content marketing. I help marketers develop effective strategies, build their personal brands, and grow their careers in the tech industry. My sessions are practical and results-oriented.",
    expertise: ["Digital Marketing", "Brand Strategy", "Content Marketing", "Growth Marketing"],
    industries: ["Fintech", "Technology", "E-commerce"],
    stack: ["Google Analytics", "HubSpot", "Mailchimp", "Canva"],
    reviews: [
      {
        id: "rev-13",
        rating: 5,
        comment: "Yusuf's brand strategy advice transformed my approach to marketing. Highly recommend!",
        author: "Dolapo A.",
        date: "2 weeks ago",
      },
      {
        id: "rev-14",
        rating: 4,
        comment: "Great insights on digital marketing. Would love more case studies in future sessions.",
        author: "Seyi O.",
        date: "1 month ago",
      },
    ],
  },
};

export function getMentorPublicProfile(id: string): MentorPublicData | null {
  return MOCK_MENTOR_DETAILS[id] || null;
}
