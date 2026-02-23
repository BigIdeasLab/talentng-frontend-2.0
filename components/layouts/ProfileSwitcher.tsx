"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRoleColors } from "@/lib/theme/role-colors";

const CaretIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5306 10.4695C11.6005 10.5392 11.656 10.622 11.6938 10.7131C11.7317 10.8043 11.7512 10.902 11.7512 11.0007C11.7512 11.0994 11.7317 11.1972 11.6938 11.2883C11.656 11.3795 11.6005 11.4623 11.5306 11.532L8.5306 14.532C8.46092 14.6019 8.37813 14.6574 8.28696 14.6952C8.1958 14.7331 8.09806 14.7526 7.99935 14.7526C7.90064 14.7526 7.8029 14.7331 7.71173 14.6952C7.62057 14.6574 7.53778 14.6019 7.4681 14.532L4.4681 11.532C4.3272 11.3911 4.24805 11.2 4.24805 11.0007C4.24805 10.8015 4.3272 10.6104 4.4681 10.4695C4.60899 10.3286 4.80009 10.2494 4.99935 10.2494C5.19861 10.2494 5.3897 10.3286 5.5306 10.4695L7.99997 12.9376L10.4693 10.4676C10.5391 10.398 10.6219 10.3428 10.7131 10.3052C10.8042 10.2677 10.9018 10.2484 11.0004 10.2486C11.0989 10.2487 11.1965 10.2683 11.2875 10.3063C11.3784 10.3442 11.4611 10.3996 11.5306 10.4695ZM5.5306 5.53198L7.99997 3.0626L10.4693 5.5326C10.6102 5.6735 10.8013 5.75265 11.0006 5.75265C11.1999 5.75265 11.391 5.6735 11.5318 5.5326C11.6727 5.39171 11.7519 5.20061 11.7519 5.00135C11.7519 4.8021 11.6727 4.611 11.5318 4.4701L8.53185 1.4701C8.46217 1.40018 8.37937 1.34471 8.28821 1.30685C8.19705 1.269 8.09931 1.24951 8.0006 1.24951C7.90189 1.24951 7.80415 1.269 7.71298 1.30685C7.62182 1.34471 7.53903 1.40018 7.46935 1.4701L4.46935 4.4701C4.32845 4.611 4.2493 4.8021 4.2493 5.00135C4.2493 5.20061 4.32845 5.39171 4.46935 5.5326C4.61024 5.6735 4.80134 5.75265 5.0006 5.75265C5.19986 5.75265 5.39095 5.6735 5.53185 5.5326L5.5306 5.53198Z"
      fill="black"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5834 7.79232C15.5834 5.26102 13.5314 3.20898 11.0001 3.20898C8.46878 3.20898 6.41675 5.26102 6.41675 7.79232C6.41675 10.3236 8.46878 12.3757 11.0001 12.3757C13.5314 12.3757 15.5834 10.3236 15.5834 7.79232Z"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.4167 18.7917C17.4167 15.2478 14.5438 12.375 11 12.375C7.45619 12.375 4.58334 15.2478 4.58334 18.7917"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIconMenu = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5411 6.54562L19.0887 5.76041C18.7465 5.16656 18.5754 4.86965 18.2843 4.75124C17.9931 4.63284 17.6639 4.72627 17.0054 4.91312L15.8869 5.22818C15.4665 5.32513 15.0254 5.27013 14.6416 5.07291L14.3328 4.89474C14.0036 4.68391 13.7504 4.37307 13.6103 4.0077L13.3042 3.09343C13.1029 2.48841 13.0023 2.1859 12.7626 2.01287C12.5231 1.83984 12.2049 1.83984 11.5683 1.83984H10.5464C9.90998 1.83984 9.59171 1.83984 9.3521 2.01287C9.11253 2.1859 9.01189 2.48841 8.81061 3.09343L8.50448 4.0077C8.36434 4.37307 8.11116 4.68391 7.782 4.89474L7.4732 5.07291C7.08934 5.27013 6.64829 5.32513 6.2279 5.22818L5.10935 4.91312C4.45087 4.72627 4.12164 4.63284 3.83053 4.75124C3.53941 4.86965 3.36833 5.16656 3.02613 5.76041L2.57369 6.54562C2.25294 7.10227 2.09256 7.3806 2.12369 7.67688C2.15481 7.97317 2.36951 8.21193 2.7989 8.68946L3.74402 9.74608C3.97502 10.0385 4.13902 10.5482 4.13902 11.0064C4.13902 11.4648 3.97508 11.9743 3.74405 12.2668L2.7989 13.3235C2.36951 13.8011 2.15482 14.0398 2.12369 14.3361C2.09256 14.6324 2.25294 14.9107 2.57369 15.4673L3.02613 16.2525C3.36831 16.8463 3.53941 17.1433 3.83053 17.2617C4.12164 17.3801 4.45088 17.2867 5.10937 17.0998L6.22786 16.7847C6.64832 16.6877 7.08946 16.7428 7.47336 16.9401L7.78212 17.1183C8.11121 17.3291 8.36433 17.6399 8.50446 18.0052L8.81061 18.9196C9.01189 19.5246 9.11253 19.8271 9.3521 20.0002C9.59171 20.1732 9.90998 20.1732 10.5464 20.1732H11.5683C12.2049 20.1732 12.5231 20.1732 12.7626 20.0002C13.0023 19.8271 13.1029 19.5246 13.3042 18.9196L13.6104 18.0052C13.7504 17.6399 14.0035 17.3291 14.3327 17.1183L14.6414 16.9401C15.0253 16.7428 15.4664 16.6877 15.8869 16.7847L17.0054 17.0998C17.6639 17.2867 17.9931 17.3801 18.2843 17.2617C18.5754 17.1433 18.7465 16.8463 19.0887 16.2525L19.5411 15.4673C19.8619 14.9107 20.0222 14.6324 19.9911 14.3361C19.9599 14.0398 19.7453 13.8011 19.3159 13.3235L18.3707 12.2668C18.1397 11.9743 17.9757 11.4648 17.9757 11.0064C17.9757 10.5482 18.1398 10.0385 18.3707 9.74608L19.3159 8.68946C19.7453 8.21193 19.9599 7.97317 19.9911 7.67688C20.0222 7.3806 19.8619 7.10227 19.5411 6.54562Z"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
    />
    <path
      d="M14.2262 10.9993C14.2262 12.7713 12.7898 14.2077 11.0179 14.2077C9.24596 14.2077 7.80957 12.7713 7.80957 10.9993C7.80957 9.22743 9.24596 7.79102 11.0179 7.79102C12.7898 7.79102 14.2262 9.22743 14.2262 10.9993Z"
      stroke="black"
      strokeWidth="1.375"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.4167 10H4.16663"
      stroke="#B2B2B2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8333 15C10.8333 15 15.8333 11.3176 15.8333 10C15.8333 8.68233 10.8333 5 10.8333 5"
      stroke="#B2B2B2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HelpIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9999 20.1673C16.0625 20.1673 20.1666 16.0633 20.1666 11.0007C20.1666 5.93804 16.0625 1.83398 10.9999 1.83398C5.93731 1.83398 1.83325 5.93804 1.83325 11.0007C1.83325 16.0633 5.93731 20.1673 10.9999 20.1673Z"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.70825 8.70768C8.70825 7.44203 9.73428 6.41602 10.9999 6.41602C12.2656 6.41602 13.2916 7.44203 13.2916 8.70768C13.2916 9.49317 12.8964 10.1864 12.294 10.5993C11.6675 11.0286 10.9999 11.615 10.9999 12.3743"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 15.584H11.0089"
      stroke="black"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.0267 3.66811C3.66675 4.23195 3.66675 4.96134 3.66675 6.4201V15.5812C3.66675 17.0399 3.66675 17.7693 4.0267 18.3332C4.09097 18.4339 4.16303 18.5294 4.2422 18.6189C4.68557 19.1198 5.38702 19.3201 6.78992 19.7209C8.19636 20.1227 8.89959 20.3235 9.40875 20.0222C9.49711 19.97 9.57925 19.908 9.65377 19.8375C10.0834 19.4308 10.0834 18.6995 10.0834 17.2371V4.76422C10.0834 3.30177 10.0834 2.57053 9.65377 2.16382C9.57925 2.09329 9.49711 2.03131 9.40875 1.97906C8.89959 1.67775 8.19636 1.87862 6.78992 2.28039C5.38702 2.68115 4.68557 2.88153 4.2422 3.38246C4.16303 3.47192 4.09097 3.56743 4.0267 3.66811Z"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0833 3.66602H11.9323C13.6755 3.66602 14.5471 3.66602 15.0886 4.20299C15.3906 4.50236 15.5241 4.90346 15.5833 5.49935M10.0833 18.3327H11.9323C13.6755 18.3327 14.5471 18.3327 15.0886 17.7957C15.3906 17.4963 15.5241 17.0953 15.5833 16.4993"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.2499 11.0007H12.8333M17.8749 8.70898C17.8749 8.70898 20.1666 10.3968 20.1666 11.0007C20.1666 11.6046 17.8749 13.2923 17.8749 13.2923"
      stroke="black"
      strokeWidth="1.375"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ProfileSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    profiles,
    userRoles,
    activeRole,
    setActiveRole,
    switchRole,
    currentProfile,
    currentProfileUI,
    initialProfileName,
    initialProfileAvatar,
    isLoading,
  } = useProfile();

  // Restore last active role when switching roles
  const handleSwitchRole = async (role: string) => {
    setIsOpen(false);
    try {
      if (switchRole) {
        await switchRole(role);
        // Navigate to the current path without query parameters to prevent re-triggering switchRole params
        window.location.href = window.location.pathname;
      } else {
        setActiveRole(role);
      }
    } catch (error) {
      console.error("Failed to switch role:", error);
    }
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  const handleSettings = () => {
    setIsOpen(false);
    router.push("/settings");
  };

  const handleAddNewRole = () => {
    setIsOpen(false);
    // Pass existing roles as query params to avoid stale data issues
    const rolesParam = userRoles.join(",");
    router.push(`/onboarding?mode=add-role&roles=${rolesParam}`);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    // Save the current active role before logging out
    await logout();
  };

  // Get display profile (use UI version if available, fallback to raw)
  const displayProfile =
    currentProfileUI ||
    currentProfile ||
    (activeRole === "recruiter"
      ? user?.recruiterProfile
      : activeRole === "talent"
        ? user?.talentProfile
        : user?.mentorProfile);

  const DEFAULT_AVATAR = "/default.png";

  // Use server-provided initial values as fallback while profile loads
  const cachedName = initialProfileName || null;
  const cachedAvatar = initialProfileAvatar || null;

  // Get profile image URL safely
  const getProfileImageUrl = (role: string, profile: any): string => {
    if (!profile) return DEFAULT_AVATAR;

    // Check UI format first (personal.profileImageUrl) - used for currentProfileUI
    if (profile.personal?.profileImageUrl) {
      return profile.personal.profileImageUrl;
    }

    // Check camelCase at root level
    if (profile.profileImageUrl) {
      return profile.profileImageUrl;
    }

    // Check snake_case (legacy API response format)
    if (profile.profile_image_url) {
      return profile.profile_image_url;
    }

    return DEFAULT_AVATAR;
  };

  // Helper to get profile for any role (current or switchable)
  const getProfileForRole = (role: string) => {
    if (profiles[role]) return profiles[role];
    if (role === "recruiter") return user?.recruiterProfile;
    if (role === "talent") return user?.talentProfile;
    if (role === "mentor") return user?.mentorProfile;
    return null;
  };

  // Get current active profile image (use cache while loading)
  const getCurrentProfileImageUrl = (): string => {
    const url = getProfileImageUrl(activeRole, displayProfile);
    if (url === DEFAULT_AVATAR && cachedAvatar) return cachedAvatar;
    return url;
  };

  // Get display name based on role
  const getDisplayName = (role: string, profile: any) => {
    if (role === "recruiter") {
      return (
        profile?.company ||
        profile?.companyName ||
        profile?.professional?.company ||
        profile?.fullName ||
        "Company"
      );
    }
    if (role === "mentor") {
      return (
        profile?.fullName ||
        `${profile?.personal?.firstName || ""} ${profile?.personal?.lastName || ""}`.trim() ||
        profile?.companyName ||
        "Mentor"
      );
    }
    // talent - try fullName first, then firstName + lastName
    if (profile?.fullName) {
      return profile.fullName;
    }
    const firstName =
      profile?.personal?.firstName ||
      profile?.firstName ||
      user?.fullName?.split(" ")[0] ||
      "";
    const lastName =
      profile?.personal?.lastName ||
      profile?.lastName ||
      user?.fullName?.split(" ").slice(1).join(" ") ||
      "";
    return `${firstName} ${lastName}`.trim() || user?.fullName || "User";
  };

  // Get display label based on role
  const getRoleLabel = (role: string) => {
    if (role === "talent") return "Independent Talent";
    if (role === "recruiter") return "Recruiter";
    if (role === "mentor") return "Mentor";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get available roles (all roles user is authorized for)
  const availableRoles = userRoles;

  // Get other roles to show in switcher (exclude current active role)
  const switchableRoles = availableRoles.filter((role) => role !== activeRole);

  const roleColors = getRoleColors(activeRole);

  // Show loading skeleton while profile data is being fetched
  if (isLoading) {
    return (
      <div className="w-full px-[10px] py-[12px] rounded-lg bg-gray-100 animate-pulse">
        <div className="flex items-center gap-[8px] min-w-0">
          <div className="w-[28px] h-[28px] rounded-full bg-gray-200" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
            <div className="h-2 w-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Don't render until we have an active role (prevents showing wrong role during initial load)
  if (!activeRole) {
    return null;
  }

  return (
    <div
      className="w-full px-[10px] py-[12px] rounded-lg"
      style={{ backgroundColor: roleColors.light }}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center justify-between gap-[8px] hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-[8px] min-w-0">
              <div
                className="w-[28px] h-[28px] rounded-full bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: `url(${getCurrentProfileImageUrl()})`,
                }}
              />
              <div className="min-w-0">
                <div className="text-[13px] font-normal text-black font-inter-tight truncate">
                  {displayProfile
                    ? getDisplayName(activeRole, displayProfile)
                    : cachedName || getDisplayName(activeRole, displayProfile)}
                </div>
                <div className="text-[11px] text-[rgba(0,0,0,0.30)] font-inter-tight truncate">
                  {getRoleLabel(activeRole)}
                </div>
              </div>
            </div>
            <CaretIcon />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="w-[220px] rounded-lg bg-white border-0 shadow-lg"
          sideOffset={31}
          alignOffset={-14}
        >
          {/* Profile Info */}
          <div className="flex items-center gap-[8px] px-[14px] py-[10px]">
            <div
              className="w-[32px] h-[32px] rounded-full bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: `url(${getCurrentProfileImageUrl()})`,
              }}
            />
            <div className="flex flex-col gap-[2px] min-w-0">
              <div className="text-[12px] font-normal text-black font-inter-tight truncate">
                {displayProfile
                  ? getDisplayName(activeRole, displayProfile)
                  : cachedName || getDisplayName(activeRole, displayProfile)}
              </div>
              <div className="text-[11px] font-light text-[#525866] font-inter-tight truncate">
                {getRoleLabel(activeRole)}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E1E4EA] my-[6px]" />

          {/* Your Profile & Settings */}
          <div className="flex flex-col gap-[4px] px-[14px] py-[6px]">
            <button
              onClick={handleProfile}
              className="flex items-center gap-[8px] hover:opacity-70 transition-opacity py-[6px]"
            >
              <UserIcon />
              <span className="text-[12px] text-black font-inter-tight">
                Your Profile
              </span>
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center gap-[8px] hover:opacity-70 transition-opacity py-[6px]"
            >
              <SettingsIconMenu />
              <span className="text-[12px] text-black font-inter-tight">
                Settings
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E1E4EA] my-[6px]" />

          {/* Switch Profile */}
          {switchableRoles.length > 0 && (
            <div className="px-[14px] py-[6px]">
              <div className="text-[10px] font-medium text-[rgba(0,0,0,0.30)] font-inter-tight mb-[6px]">
                SWITCH PROFILE
              </div>
              <div className="flex flex-col gap-[8px]">
                {switchableRoles.map((role) => {
                  const profile = getProfileForRole(role);
                  const displayName = getDisplayName(role, profile);
                  const profileImage = getProfileImageUrl(role, profile);

                  return (
                    <button
                      key={role}
                      onClick={() => handleSwitchRole(role)}
                      className="flex items-center justify-between hover:opacity-70 transition-opacity"
                    >
                      <div className="flex items-center gap-[8px] min-w-0">
                        <div
                          className="w-[28px] h-[28px] rounded-full bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: `url(${profileImage})`,
                          }}
                        />
                        <div className="flex flex-col gap-[2px] text-left min-w-0">
                          <div className="text-[12px] font-normal text-black font-inter-tight truncate">
                            {displayName}
                          </div>
                          <div className="text-[11px] font-light text-[#525866] font-inter-tight truncate">
                            {getRoleLabel(role)}
                          </div>
                        </div>
                      </div>
                      <ArrowRightIcon />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Role */}
          {userRoles.length < 3 && (
            <>
              <div className="h-px bg-[#E1E4EA] my-[6px]" />
              <div className="px-[14px] py-[6px]">
                <button
                  onClick={handleAddNewRole}
                  className="w-full flex items-center justify-center gap-[8px] px-[12px] py-[8px] rounded-[8px] bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="#5C30FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[12px] text-[#5C30FF] font-medium font-inter-tight">
                    Add New Role
                  </span>
                </button>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="h-px bg-[#E1E4EA] my-[6px]" />

          {/* Help & Logout */}
          <div className="flex flex-col gap-[4px] px-[14px] py-[6px]">
            <button className="flex items-center gap-[8px] hover:opacity-70 transition-opacity py-[6px]">
              <HelpIcon />
              <span className="text-[12px] text-black font-inter-tight">
                Help
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-[8px] hover:opacity-70 transition-opacity py-[6px]"
            >
              <LogoutIcon />
              <span className="text-[12px] text-black font-inter-tight">
                Log Out
              </span>
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
