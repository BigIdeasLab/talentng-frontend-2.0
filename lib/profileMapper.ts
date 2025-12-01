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
     category: string;
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
  gallery: {
    id: string;
    key: string;
    url: string;
    mime: string;
    sizeBytes: string;
    createdAt: string;
  }[];
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
  fullName?: string | null;
  headline?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  profileImageUrl?: string | null;
  skills?: string[];
  stack?: string[] | Array<{ name: string }>;
  workExperience?: Array<{
    id?: string;
    company: string;
    position?: string;
    role?: string;
    startDate?: string;
    endDate?: string | null;
    description?: string;
    duration?: string;
    location?: string;
  }>;
  education?: Array<{
    id?: string;
    school?: string;
    institution?: string;
    degree: string;
    field: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  resumeUrl?: string | null;
  portfolioItems?: {
    id?: string;
    title: string;
    description: string;
    url: string;
    image: string;
    technologies: string[];
  }[];
  gallery?: {
    id: string;
    key: string;
    url: string;
    mime: string;
    sizeBytes: string;
    createdAt: string;
  }[];
  links?: {
    dribbble?: string;
    telegram?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  company?: string | null;
  category?: string | null;
  availability?: string | null;
  description?: string | null;
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
    gallery: uiData.gallery,
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
    category: uiData.professional.category,
    availability: uiData.professional.availability,
    description: uiData.professional.description,
  };
}

/**
 * Convert API format to UI-friendly format
 * Accepts both APIProfileData (request format) and TalentProfile (response format)
 */
export function mapAPIToUI(apiData: Partial<APIProfileData> | any): UIProfileData {
    const [firstName, ...lastNameParts] = (apiData.fullName || "").split(" ");
    const lastName = lastNameParts.join(" ");

    const [city, state] = (apiData.location || "").split(", ");

    const mappedProfessional = {
      role: (Array.isArray(apiData.stack) && apiData.stack.length > 0 
        ? (typeof apiData.stack[0] === 'string' ? apiData.stack[0] : apiData.stack[0].name)
        : "") || "",
      company: apiData.company || "",
      category: apiData.category || "",
      description: apiData.description || "",
      skills: apiData.skills || [],
      stack: (apiData.stack || []).map((item: any) => {
        const name = typeof item === 'string' ? item : item.name;
        return {
          name,
          icon: getIconForTool(name),
        };
      }),
      availability: apiData.availability || "",
    };

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
    professional: mappedProfessional,
    experience: (apiData.workExperience || []).map((exp: any, idx: number) => ({
      id: exp.id || `${idx}`,
      company: exp.company,
      position: exp.position || exp.role || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description || "",
      isCurrently: !exp.endDate,
      location: exp.location,
    })),
    education: (apiData.education || []).map((edu: any, idx: number) => ({
      id: edu.id || `${idx}`,
      school: edu.school || edu.institution || "",
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: edu.description || "",
    })),
    portfolio: {
      resumeUrl: apiData.resumeUrl || "",
      portfolioItems: (apiData.portfolioItems || []).map((item: any, idx: number) => ({
        ...item,
        id: item.id || `portfolio-${idx}`,
      })),
    },
    gallery: (apiData.gallery || []).map((item: any) => ({
      id: item.id || "",
      key: item.key || "",
      url: item.url || "",
      mime: item.mime || "",
      sizeBytes: item.sizeBytes || "",
      createdAt: item.createdAt || "",
    })),
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
