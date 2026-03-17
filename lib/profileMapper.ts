// UI-friendly format
export interface UIProfileData {
  personal: {
    firstName: string;
    lastName: string;
    bio: string;
    state: string;
    city: string;
    profileImageUrl: string;
  };
  professional: {
    role: string;
    headline: string;
    category: string;
    skills: string[];
    stack: { name: string; icon: string }[];
    availability: string[];
    industry?: string;
    companySize?: string;
    companyStage?: string;
    operatingModel?: string;
  };
  company?: string;
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrently: boolean;
    location: string;
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
    title?: string;
    description?: string;
    images: string[];
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
    website: string;
    customLinks?: { name: string; url: string }[];
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
    title?: string;
    description?: string;
    images: string[];
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
  availability?: string[];
  description?: string | null;
  visibility?: "public" | "private";
  socialLinks?: Record<string, any>;
}

/**
 * Convert UI-friendly format to API format
 */
export function mapUIToAPI(uiData: UIProfileData): APIProfileData {
  return {
    fullName: `${uiData.personal.firstName} ${uiData.personal.lastName}`.trim(),
    headline: uiData.professional.headline,
    bio: uiData.personal.bio,
    profileImageUrl: uiData.personal.profileImageUrl,
    location:
      uiData.personal.state && uiData.personal.city
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
      ...Object.fromEntries(
        (uiData.social.customLinks || [])
          .filter((l) => l.name && l.url)
          .map((l) => [l.name.toLowerCase().replace(/\s+/g, "_"), l.url]),
      ),
    },
    socialLinks: {
      dribbble: uiData.social.dribbble || undefined,
      telegram: uiData.social.telegram || undefined,
      twitter: uiData.social.twitter || undefined,
      instagram: uiData.social.instagram || undefined,
      linkedin: uiData.social.linkedin || undefined,
      github: uiData.social.github || undefined,
      portfolio: uiData.social.portfolio || undefined,
      website: uiData.social.website || undefined,
      ...Object.fromEntries(
        (uiData.social.customLinks || [])
          .filter((l) => l.name && l.url)
          .map((l) => [l.name.toLowerCase().replace(/\s+/g, "_"), l.url]),
      ),
    },
    category: uiData.professional.category,
    availability: uiData.professional.availability,
  };
}

/**
 * Convert API format to UI-friendly format
 * Accepts both APIProfileData (request format) and TalentProfile (response format)
 */
export function mapAPIToUI(
  apiData: Partial<APIProfileData> | any,
): UIProfileData {
  // Handle wrapped response { profile: {...} } from API
  const data = apiData?.profile ?? apiData;
  const [firstName, ...lastNameParts] = (data.fullName || "").split(" ");
  const lastName = lastNameParts.join(" ");

  const locationParts = (data.location || "").split(", ");
  const city = locationParts[0] || "";
  const state = locationParts[1] || locationParts[0] || "";

  const mappedProfessional = {
    role:
      (Array.isArray(data.stack) && data.stack.length > 0
        ? typeof data.stack[0] === "string"
          ? data.stack[0]
          : data.stack[0].name
        : "") || "",
    headline: data.headline || "",
    category: data.category || "",
    skills: (data.skills || []).map((item: any) =>
      typeof item === "string" ? item : item?.name || "",
    ),
    stack: (data.stack || []).map((item: any) => {
      const name = typeof item === "string" ? item : item.name;
      return {
        name,
        icon: getIconForTool(name),
      };
    }),
    availability: Array.isArray(data.availability)
      ? data.availability
      : data.availability
        ? [data.availability]
        : [],
    industry: data.industry || "",
    companySize: data.companySize || "",
    companyStage: data.companyStage || "",
    operatingModel: data.operatingModel || "",
  };

  return {
    personal: {
      firstName: firstName || "",
      lastName: lastName || "",
      bio: data.bio || "",
      state: state || "",
      city: city || "",
      profileImageUrl: data.profileImageUrl || "",
    },
    professional: mappedProfessional,
    company: data.company || "",
    experience: (data.workExperience || []).map((exp: any, idx: number) => ({
      id: exp.id || `${idx}`,
      company: exp.company,
      position: exp.position || exp.role || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description || "",
      isCurrently: !exp.endDate,
      location: exp.location || "",
    })),
    education: (data.education || []).map((edu: any, idx: number) => ({
      id: edu.id || `${idx}`,
      school: edu.school || edu.institution || "",
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      description: edu.description || "",
    })),
    portfolio: {
      resumeUrl: data.resumeUrl || "",
      portfolioItems: (data.portfolioItems || []).map(
        (item: any, idx: number) => ({
          ...item,
          id: item.id || `portfolio-${idx}`,
        }),
      ),
    },
    gallery: (data.gallery || []).map((item: any) => ({
      id: item.id || "",
      title: item.title || "",
      description: item.description || "",
      createdAt: item.createdAt || "",
      images:
        item.images && Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : item.url
            ? [item.url]
            : [],
    })),
    social: {
      dribbble: data.links?.dribbble || data.socialLinks?.dribbble || "",
      telegram: data.links?.telegram || data.socialLinks?.telegram || "",
      twitter: data.links?.twitter || data.socialLinks?.twitter || "",
      instagram: data.links?.instagram || data.socialLinks?.instagram || "",
      linkedin: data.links?.linkedin || data.socialLinks?.linkedin || "",
      github: data.links?.github || data.socialLinks?.github || "",
      portfolio: data.links?.portfolio || data.socialLinks?.portfolio || "",
      website: data.links?.website || data.socialLinks?.website || "",
      customLinks: Object.entries({
        ...(data.socialLinks || {}),
        ...(data.links || {}),
      })
        .filter(
          ([key, value]) =>
            ![
              "dribbble",
              "telegram",
              "twitter",
              "instagram",
              "linkedin",
              "linkedIn",
              "github",
              "portfolio",
              "website",
            ].includes(key) && value,
        )
        .map(([key, value]) => ({ name: key, url: (value as string) || "" })),
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
