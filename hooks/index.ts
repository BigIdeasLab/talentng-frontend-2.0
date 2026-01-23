/**
 * Central Hook Exports
 *
 * This file provides a single import point for all custom hooks.
 * Usage: import { useAuth, useProfile } from "@/hooks"
 */

// ============================================================================
// Authentication & Profile Hooks
// ============================================================================

/**
 * useAuth() - Get current authenticated user
 *
 * Returns: { user, loading, logout, refetchUser }
 * Uses React Query with cookie-based auth
 */
export { useAuth } from "./useAuth";

/**
 * useProfile() - Access profile context (role switching, active profile)
 *
 * Returns: { activeRole, userRoles, setActiveRole, profiles, profilesUI, ... }
 * Must be used within ProfileProvider wrapper
 */
export { useProfile } from "./useProfile";

/**
 * useProfileData() - Fetch and sync profile data on mount
 *
 * Called automatically in layout-client.tsx
 * Syncs profile data with localStorage and context
 */
export { useProfileData } from "./useProfileData";

/**
 * useTokenRefresh() - Validate token before operations
 *
 * Returns: { ensureValidTokenBeforeOperation }
 * Use before sensitive operations (posting, onboarding, etc.)
 */
export { useTokenRefresh } from "./useTokenRefresh";

// ============================================================================
// API Hooks (React Query)
// ============================================================================

/**
 * useTalentApi() - Talent-specific API operations
 *
 * Exports: useCurrentProfile, useTalentProfile, useMyServices, etc.
 * Queries: profile, dashboard stats, services, gallery, recommendations
 */
export {
  useCurrentProfile,
  useTalentProfile,
  useDashboardStats,
  useUpdateProfile,
  useUpdateProfileImage,
  useUpdateCoverImage,
  useListTalentProfiles,
  useMyServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useTalentServices,
  useSearchServicesByTags,
  useAddServiceReview,
  useUploadGalleryImages,
  useDeleteGalleryItem,
  useTalentRecommendations,
  useCreateRecommendation,
  useGetRecommendationStats,
  useDeleteRecommendation,
} from "./useTalentApi";

/**
 * useUserApi() - User profile & onboarding API
 *
 * Exports: useCurrentUser, useCheckUsernameAvailability, useCompleteOnboarding
 * Note: useCurrentUser overlaps with useAuth(). useAuth() is recommended.
 */
export {
  useCurrentUser,
  useCheckUsernameAvailability,
  useCompleteOnboarding,
} from "./useUserApi";

/**
 * useApplications() - Job application CRUD
 *
 * Returns: { isLoading, error, getAll, getById, submit, updateStatus }
 */
export { useApplications } from "./useApplications";

/**
 * useOpportunitiesManager() - Job opportunity CRUD
 *
 * Returns: { isLoading, error, getAll, create, update, post, delete, save, unsave, ... }
 */
export { useOpportunitiesManager } from "./useOpportunitiesManager";

// ============================================================================
// UI State Hooks
// ============================================================================

/**
 * useModal() - Modal open/close state management
 *
 * Returns: { isOpen, openModal, closeModal, updateLoading, title, description, ... }
 * Use for confirming actions, showing modal dialogs
 */
export { useModal } from "./useModal";

/**
 * useToast() & toast() - Toast notifications
 *
 * Returns: { toasts, toast, dismiss }
 * Usage: toast({ title: "Success", description: "Done!" })
 */
export { useToast, toast } from "./useToast";

/**
 * useNotifications() - API notifications (not UI toasts)
 *
 * Returns: { notifications, loading, error, unreadCount, fetchNotifications, ... }
 * Fetches notifications from backend API
 */
export { useNotifications } from "./useNotifications";

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * useDebounce() - Debounce values
 *
 * Usage: const debouncedSearch = useDebounce(searchTerm, 300)
 * Use for search inputs, filters, expensive operations
 */
export { useDebounce } from "./useDebounce";

/**
 * useIsMobile() - Check if viewport is mobile
 *
 * Returns: boolean (true if window < 768px)
 * Use for responsive UI decisions
 */
export { useIsMobile } from "./useIsMobile";
