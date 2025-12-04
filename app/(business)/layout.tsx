import { getBusinessLayoutData } from "./layout-data";
import { ProfileProvider } from "./profile-provider";
import { AppLayoutClient } from "./layout-client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { 
    profiles,
    profilesUI,
    stats,
    activeRole,
    profileData, 
    profileRaw, 
    userId, 
    userRoles, 
    recommendations, 
    error 
  } = await getBusinessLayoutData();

  return (
    <ProfileProvider
      profiles={profiles}
      profilesUI={profilesUI}
      stats={stats}
      activeRole={activeRole}
      initialProfileData={profileData as any}
      initialProfileRaw={profileRaw as any}
      userId={userId ?? null}
      userRoles={userRoles}
      recommendations={recommendations}
      error={error}
    >
      <AppLayoutClient>{children}</AppLayoutClient>
    </ProfileProvider>
  );
}
