"use client";

import { useState } from "react";
import {
  DiscoverTalentHeader,
  TalentGrid,
  talentData,
} from "@/components/business/DiscoverTalent";

export default function DiscoverTalentPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DiscoverTalentHeader
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <TalentGrid talents={talentData} />
    </div>
  );
}
