import { getBusinessLayoutData } from "./layout-data";
import { ProfileProvider } from "./profile-provider";
import { BusinessLayoutClient } from "./layout-client";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileData, profileRaw, userId, stats, recommendations, error } = await getBusinessLayoutData();

  return (
    <ProfileProvider
      initialProfileData={profileData}
      initialProfileRaw={profileRaw}
      userId={userId}
      stats={stats}
      recommendations={recommendations}
      error={error}
    >
      <BusinessLayoutClient>{children}</BusinessLayoutClient>
    </ProfileProvider>
  );
}
