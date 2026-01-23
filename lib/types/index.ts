/**
 * Central Type Exports
 *
 * Single import point for all type definitions across the application.
 * Organized by domain/feature for easy navigation.
 *
 * Usage: import type { User, Opportunity } from "@/lib/types"
 */

// ============================================================================
// Authentication & User
// ============================================================================

export type { User, LoginResponse } from "./auth";

// ============================================================================
// Talent/Professional Profile
// ============================================================================

export type { TalentProfile, PortfolioItem } from "./profile";
export type {
  Service,
  Recommendation,
  WorkItem,
  StackItem,
  SocialLink,
} from "./business";

// ============================================================================
// Opportunities & Applications
// ============================================================================

export type {
  TabType,
  SortType,
  OpportunityType,
  OpportunityStatus,
  OpportunityCard,
  OpportunityCardProps,
  FormSection,
  OpportunitiesFilters,
} from "@/types/opportunities";

export interface TypeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
}

// ============================================================================
// Applications
// ============================================================================

export type { Application } from "./application";

// ============================================================================
// Onboarding
// ============================================================================

export type {
  Role,
  ProfileData as OnboardingProfileData,
  SkillsData,
  CompanyProfileData,
  MentorExpertiseData,
} from "./onboarding";

// ============================================================================
// Settings & Preferences
// ============================================================================

export type {
  AccountSettings,
  ProfileSettings,
  NotificationSettings,
  SecuritySettings,
  UserSettings,
} from "./settings";

// ============================================================================
// Notifications
// ============================================================================

export type { Notification } from "./notification";

// ============================================================================
// Mentor
// ============================================================================

export type { Mentor } from "./mentor";

// ============================================================================
// Learning Resources
// ============================================================================

export type { LearningResource } from "./learning";

// ============================================================================
// Talent (API)
// ============================================================================

export type { Talent } from "./talent";

// ============================================================================
// Profile Mapping (API ↔ UI Conversion)
// ============================================================================

export type { UIProfileData, APIProfileData } from "@/lib/profileMapper";

// ============================================================================
// Component/Hook Helper Types
// ============================================================================

export interface UsePageDataConfig<T> {
  fetchFn: (role?: string) => Promise<T>;
  transform?: (data: any) => T;
  defaultData?: T;
}

export interface UsePageDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface PageLoadingStateProps {
  message?: string;
}

export interface PageErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export interface RoleComponentMap {
  talent?: React.ReactNode;
  employer?: React.ReactNode;
  mentor?: React.ReactNode;
  recruiter?: React.ReactNode;
}
