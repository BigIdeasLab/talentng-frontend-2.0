/**
 * Default profile data structure
 * Used as fallback when profile data fails to load
 */

import { UIProfileData } from "@/lib/profileMapper";

export const DEFAULT_PROFILE_DATA: UIProfileData = {
  personal: {
    firstName: "",
    lastName: "",
    bio: "",
    state: "",
    city: "",
    profileImageUrl: "",
  },
  professional: {
    role: "",
    headline: "",
    category: "",
    skills: [],
    stack: [],
    availability: "",
  },
  gallery: [],
  experience: [],
  education: [],
  portfolio: {
    resumeUrl: "",
    portfolioItems: [],
  },
  social: {
    dribbble: "",
    telegram: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
  },
};
