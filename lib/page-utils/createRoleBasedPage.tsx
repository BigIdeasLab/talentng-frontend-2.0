/**
 * Factory function for creating role-based pages
 * Eliminates repetitive switch statements in simple pages
 *
 * Usage:
 * export default createRoleBasedPage({
 *   talent: <TalentComponent />,
 *   employer: <EmployerComponent />,
 *   mentor: <MentorComponent />,
 * });
 */

import { ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";

export interface RoleComponentMap {
  /** Component to render for talent users */
  talent: ReactNode;

  /** Component to render for employer/recruiter users */
  employer?: ReactNode;

  /** Component to render for mentor users */
  mentor?: ReactNode;
}

/**
 * Factory function to create a role-based page component
 * Automatically handles role detection and component selection
 *
 * @param components - Map of components by role
 * @returns Page component that renders the appropriate component for the user's role
 *
 * @example
 * export default createRoleBasedPage({
 *   talent: <TalentDashboard />,
 *   employer: <EmployerDashboard />,
 *   mentor: <MentorDashboard />,
 * });
 */
export function createRoleBasedPage(
  components: RoleComponentMap,
): () => ReactNode {
  return function RoleBasedPageComponent() {
    const { activeRole, userRoles } = useProfile();
    const role = activeRole || userRoles?.[0] || "talent";

    // Map common role names to component keys
    const componentKey =
      role === "recruiter"
        ? "employer"
        : role === "mentor"
          ? "mentor"
          : "talent";

    const selectedComponent =
      components[componentKey as keyof RoleComponentMap] ||
      components.talent ||
      null;

    if (!selectedComponent) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-gray-600">No component found for role: {role}</p>
          </div>
        </div>
      );
    }

    return selectedComponent;
  };
}
