import { ProfileSidebar } from "@/components/business/ProfileSidebar";
import { ProfileInfo } from "@/components/business/ProfileInfo";
import { ProfileWorks } from "@/components/business/ProfileWorks";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-white">
      <ProfileSidebar />
      <ProfileInfo />
      <ProfileWorks />
    </div>
  );
}
