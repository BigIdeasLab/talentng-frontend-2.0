import { cookies } from "next/headers";
import { ProfileProvider } from "./profile-provider";
import { AppLayoutClient } from "./layout-client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialRole = cookieStore.get("activeRole")?.value ?? "";
  const initialProfileName = cookieStore.get("profileName")?.value ?? "";
  const initialProfileAvatar = cookieStore.get("profileAvatar")?.value ?? "";

  return (
    <ProfileProvider initialRole={initialRole} initialProfileName={initialProfileName} initialProfileAvatar={initialProfileAvatar}>
      <AppLayoutClient>{children}</AppLayoutClient>
    </ProfileProvider>
  );
}
