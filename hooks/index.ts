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
  useTalentProfileById,
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

// ============================================================================
// Role-Specific Opportunity Hooks (NEW)
// ============================================================================

/**
 * Talent opportunity hooks — browse, save, unsave
 * Target: GET /talent/opportunities, /talent/opportunities/saved
 */
export {
  useTalentOpportunitiesQuery,
  useOpportunityQuery,
  useSavedOpportunitiesQuery,
  useOpportunitySaveStatus,
  useSaveOpportunity,
  useUnsaveOpportunity,
} from "./useTalentOpportunities";

/**
 * Recruiter opportunity hooks — CRUD, publish, reopen
 * Target: GET /recruiter/opportunities, POST /recruiter/opportunities
 */
export {
  useRecruiterOpportunitiesQuery,
  useRecruiterOpportunityQuery,
  useCreateOpportunity,
  useUpdateOpportunity,
  usePostOpportunity,
  useDeleteOpportunity,
  useReopenOpportunity,
} from "./useRecruiterOpportunities";

// ============================================================================
// Role-Specific Application Hooks (NEW)
// ============================================================================

/**
 * Talent application hooks — view own applications, submit, respond to invitations
 * Target: GET /talent/applications, POST /talent/applications
 */
export {
  useTalentApplicationsQuery,
  useSubmitApplication,
  useRespondToInvitation,
} from "./useTalentApplications";

/**
 * Recruiter application hooks — view applicants, manage status, interviews, invitations
 * Target: GET /recruiter/applications, PATCH /applications/:id
 */
export {
  useRecruiterApplicationsQuery,
  useApplicationQuery,
  useUpdateApplicationStatus,
  useScheduleInterview,
  useRescheduleInterview,
  useCancelInterview,
  useCompleteInterview,
  useSendInvitations,
  useLeaveRecommendation,
} from "./useRecruiterApplications";

/**
 * Dashboard hooks for talent and recruiter
 */
export { useTalentDashboard } from "./useTalentDashboard";
export { useRecruiterDashboard } from "./useRecruiterDashboard";
export { useMentorDashboard } from "./useMentorDashboard";

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
 * Returns: { notifications, loading, error, unreadCount, fetchNotifications, refreshNotifications, ... }
 * Fetches notifications from backend API
 */
export { useNotifications } from "./useNotifications";

/**
 * useNotificationSocket() - Real-time notification updates via SSE
 *
 * Returns: { reconnect, disconnect, isConnected }
 * Subscribes to Server-Sent Events for instant notification count & creation/read updates
 * Usage: useNotificationSocket({ recipientRole: 'talent', onCountUpdate, onNotificationCreated, ... })
 */
export { useNotificationSocket } from "./useNotificationSocket";

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

/**
 * useIsTablet() - Check if viewport is tablet
 *
 * Returns: boolean (true if window >= 768px and < 1024px)
 * Use for tablet-specific UI decisions
 */
export { useIsTablet } from "./useIsTablet";

/**
 * useIsTouchDevice() - Check if device supports touch
 *
 * Returns: boolean (true if touch events are supported)
 * Use for touch-specific UI decisions
 */
export { useIsTouchDevice } from "./useIsTouchDevice";

/**
 * useBreakpoint() - Get current responsive breakpoint
 *
 * Returns: "mobile" | "tablet" | "desktop"
 * Use for responsive layout decisions
 */
export { useBreakpoint } from "./useBreakpoint";

/**
 * useOrientation() - Get device orientation
 *
 * Returns: "portrait" | "landscape"
 * Use for orientation-specific layouts
 */
export { useOrientation } from "./useOrientation";

/**
 * useOrientationState() - Get detailed orientation state
 *
 * Returns: { orientation, isPortrait, isLandscape }
 * Use for complex orientation-based logic
 */
export { useOrientationState } from "./useOrientationState";

/**
 * useSwipeGesture() - Handle swipe gestures
 *
 * Returns: { handlers } for touch events
 * Use for swipeable components (modals, cards, etc.)
 */
export { useSwipeGesture } from "./useSwipeGesture";

/**
 * useTextScaling() - Text scaling for accessibility
 *
 * Returns: { textScale, setTextScaleLevel, TextScalingControl, withTextScaling }
 * Use for accessible text size controls
 */
export { useTextScaling } from "./useTextScaling";

/**
 * useMobileInputScroll() - Handle mobile input scroll behavior
 *
 * Returns: void (side effect hook)
 * Use to prevent scroll issues when mobile keyboard appears
 */
export { useMobileInputScroll } from "./useMobileInputScroll";

/**
 * useTabletKeyboardNavigation() - Tablet keyboard navigation
 *
 * Returns: void (side effect hook)
 * Use for keyboard navigation on tablets
 */
export { useTabletKeyboardNavigation } from "./useTabletKeyboardNavigation";

/**
 * useRequireRole() - Enforce role-based access
 *
 * Returns: void (redirects if role doesn't match)
 * Use to protect role-specific pages
 */
export { useRequireRole } from "./useRequireRole";

/**
 * useUnsavedChangesWarning() - Warn before leaving with unsaved changes
 *
 * Returns: void (side effect hook)
 * Use in forms to prevent accidental navigation
 */
export { useUnsavedChangesWarning } from "./useUnsavedChangesWarning";

/**
 * useAvailabilityPrefetch() - Prefetch availability data
 *
 * Returns: void (side effect hook)
 * Use to prefetch mentor availability data
 */
export { useAvailabilityPrefetch } from "./useAvailabilityPrefetch";

/**
 * useBusinessVerification() - Business verification API
 *
 * Returns: { verification, loading, error, submitApplication, ... }
 * Use for business verification flow
 */
export {
  useVerificationStatus,
  useSubmitVerification,
  useResubmitVerification,
  useUploadDocument,
} from "./useBusinessVerification";

/**
 * useSupport() - Support ticket API
 *
 * Returns: { tickets, loading, error, createTicket, ... }
 * Use for support ticket management
 */
export {
  useTickets,
  useTicket,
  useCreateTicket,
  useAddReply,
  useTicketCount,
} from "./useSupport";
