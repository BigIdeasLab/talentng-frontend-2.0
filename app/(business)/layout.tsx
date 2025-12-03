import { getBusinessLayoutData } from "./layout-data";
import { ProfileProvider } from "./profile-provider";
import { AppLayoutClient } from "./layout-client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData, profileRaw, userId, userRoles, stats, recommendations, error } = await getBusinessLayoutData();

  return (
    <ProfileProvider
      initialProfileData={profileData}
      initialProfileRaw={profileRaw}
      userId={userId}
      userRoles={userRoles}
      stats={stats}
      recommendations={recommendations}
      error={error}
    >
      <AppLayoutClient>{children}</AppLayoutClient>
    </ProfileProvider>
  );
}
