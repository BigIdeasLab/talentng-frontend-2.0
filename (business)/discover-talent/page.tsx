import { DiscoverTalentClient } from "./discover-talent-client";
import { getDiscoverTalentData } from "./server-data";

export default async function DiscoverTalentPage() {
  const { talents, error } = await getDiscoverTalentData();

  return (
    <DiscoverTalentClient
      initialTalents={talents}
      initialError={error}
    />
  );
}
