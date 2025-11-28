// UI-friendly format
export interface UIProfileData {
  personal: {
    firstName: string;
    lastName: string;
    headline: string;
    bio: string;
    phoneNumber: string;
    state: string;
    city: string;
    profileImageUrl: string;
  };
  professional: {
    role: string;
    company: string;
    preferredRole: string;
    description: string;
    skills: string[];
    stack: { name: string; icon: string }[];
    availability: string;
  };
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrently: boolean;
    location?: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  portfolio: {
    resumeUrl: string;
    portfolioItems: {
      id: string;
      title: string;
      description: string;
      url: string;
      image: string;
      technologies: string[];
    }[];
  };
  social: {
    dribbble: string;
    telegram: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github?: string;
    portfolio?: string;
  };
}

// Backend API format
export interface APIProfileData {
  fullName: string;
  headline: string;
  bio: string;
  phoneNumber: string;
  location: string;
  profileImageUrl: string;
  skills: string[];
  stack: string[];
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
    location?: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  resumeUrl: string;
  portfolioItems: {
    id?: string;
    title: string;
    description: string;
    url: string;
    image: string;
    technologies: string[];
  }[];
  links: {
    dribbble?: string;
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  company: string;
  preferredRole: string;
  availability: string;
  description: string;
}

/**
 * Convert UI-friendly format to API format
 */
export function mapUIToAPI(uiData: UIProfileData): APIProfileData {
   return {
     fullName: `${uiData.personal.firstName} ${uiData.personal.lastName}`.trim(),
     headline: uiData.personal.headline,
     bio: uiData.personal.bio,
     phoneNumber: uiData.personal.phoneNumber,
     profileImageUrl: uiData.personal.profileImageUrl,
     location: uiData.personal.state && uiData.personal.city 
       ? `${uiData.personal.city}, ${uiData.personal.state}`
       : uiData.personal.state || uiData.personal.city || "",
     skills: uiData.professional.skills,
    stack: uiData.professional.stack.map((tool) => tool.name),
    workExperience: uiData.experience.map((exp) => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.isCurrently ? null : exp.endDate,
      description: exp.description,
      location: exp.location,
    })),
    education: uiData.education.map((edu) => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
    })),
    resumeUrl: uiData.portfolio.resumeUrl,
    portfolioItems: uiData.portfolio.portfolioItems,
    links: {
      dribbble: uiData.social.dribbble || undefined,
      telegram: uiData.social.telegram || undefined,
      twitter: uiData.social.twitter || undefined,
      instagram: uiData.social.instagram || undefined,
      linkedin: uiData.social.linkedin || undefined,
      github: uiData.social.github || undefined,
      portfolio: uiData.social.portfolio || undefined,
    },
    company: uiData.professional.company,
    preferredRole: uiData.professional.preferredRole,
    availability: uiData.professional.availability,
    description: uiData.professional.description,
  };
}

/**
 * Convert API format to UI-friendly format
 */
export function mapAPIToUI(apiData: Partial<APIProfileData>): UIProfileData {
   const [firstName, ...lastNameParts] = (apiData.fullName || "").split(" ");
   const lastName = lastNameParts.join(" ");

   const [city, state] = (apiData.location || "").split(", ");

   return {
     personal: {
       firstName: firstName || "",
       lastName: lastName || "",
       headline: apiData.headline || "",
       bio: apiData.bio || "",
       phoneNumber: apiData.phoneNumber || "",
       state: state || apiData.location || "",
       city: city || "",
       profileImageUrl: apiData.profileImageUrl || "",
     },
    professional: {
      role: apiData.stack?.[0] || "",
      company: apiData.company || "",
      preferredRole: apiData.preferredRole || "",
      description: apiData.description || "",
      skills: apiData.skills || [],
      stack: (apiData.stack || []).map((name) => ({
        name,
        icon: getIconForTool(name),
      })),
      availability: apiData.availability || "",
    },
    experience: (apiData.workExperience || []).map((exp, idx) => ({
      id: `${idx}`,
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      description: exp.description,
      isCurrently: !exp.endDate,
      location: exp.location,
    })),
    education: (apiData.education || []).map((edu, idx) => ({
      id: `${idx}`,
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
    })),
    portfolio: {
      resumeUrl: apiData.resumeUrl || "",
      portfolioItems: (apiData.portfolioItems || []).map((item, idx) => ({
        ...item,
        id: item.id || `portfolio-${idx}`,
      })),
    },
    social: {
      dribbble: apiData.links?.dribbble || "",
      telegram: apiData.links?.telegram || "",
      twitter: apiData.links?.twitter || "",
      instagram: apiData.links?.instagram || "",
      linkedin: apiData.links?.linkedin || "",
      github: apiData.links?.github || "",
      portfolio: apiData.links?.portfolio || "",
    },
  };
}

/**
 * Get icon emoji for a tool name
 */
function getIconForTool(toolName: string): string {
  const iconMap: Record<string, string> = {
    Figma: "🎨",
    Rive: "⚡",
    Webflow: "🌊",
    Lottie: "✨",
    Framer: "▲",
    "Adobe XD": "🎯",
    Sketch: "✏️",
    InVision: "🎬",
    Principle: "🎪",
    Zeplin: "📐",
    React: "⚛️",
    "Next.js": "▲",
    "Node.js": "🟢",
    Express: "🚂",
    PostgreSQL: "🐘",
    "AWS Lambda": "🔶",
    Docker: "🐳",
    TypeScript: "🔷",
    JavaScript: "🟨",
    AWS: "🔶",
    "REST APIs": "🔄",
    Git: "🌳",
    Agile: "🔄",
  };

  return iconMap[toolName] || "🔧";
}
