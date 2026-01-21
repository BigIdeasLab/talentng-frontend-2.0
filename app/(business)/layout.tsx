import { ProfileProvider } from "./profile-provider";
import { AppLayoutClient } from "./layout-client";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Profile data is now fetched client-side by AppLayoutClient
  // This allows proper authentication handling with localStorage tokens
  
  return (
    <ProfileProvider>
      <AppLayoutClient>{children}</AppLayoutClient>
    </ProfileProvider>
  );
}
