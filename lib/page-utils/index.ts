/**
 * Page utilities export
 * Centralized access to page-level utilities
 */

export {
  usePageData,
  type UsePageDataConfig,
  type UsePageDataResult,
} from "./usePageData";
export { useSwitchRoleParam } from "./useSwitchRoleParam";
export {
  PageLoadingState,
  type PageLoadingStateProps,
} from "./PageLoadingState";
export { PageErrorState, type PageErrorStateProps } from "./PageErrorState";
export {
  createRoleBasedPage,
  type RoleComponentMap,
} from "./createRoleBasedPage";
