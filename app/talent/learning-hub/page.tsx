"use client";
import React, { useState, useEffect } from "react";
import { getLearningResources } from "@/lib/api";
import { LearningResource } from "@/lib/types/learning";
import RecommendedLearningPaths from "@/components/learning/RecommendedLearningPaths";

export default function LearningHub() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: false,
    provider: false,
    tags: false,
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = { title: searchQuery };
        // This is a simplified implementation for now. 
        // A more robust implementation would handle the filter values.
        if (selectedFilters.category) {
          // params.category = ...
        }
        if (selectedFilters.provider) {
          // params.provider = ...
        }
        if (selectedFilters.tags) {
          // params.tags = ...
        }
        const data = await getLearningResources(params);
        setResources(data);
      } catch (err) {
        setError("Failed to fetch learning resources.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [searchQuery, selectedFilters]);

  const handleFilterChange = (filter: keyof typeof selectedFilters) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleReset = () => {
    setSelectedFilters({
      category: false,
      provider: false,
      tags: false,
    });
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Search and Filters Section */}
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-[44px] bg-white shadow-sm">
            <input
              type="text"
              placeholder="Looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-gray-700 font-geist text-base bg-transparent border-none outline-none placeholder-gray-700"
            />
            <button className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_search)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2 8.79942C2.00009 7.7151 2.25949 6.64651 2.75656 5.68283C3.25362 4.71914 3.97393 3.8883 4.8574 3.25961C5.74087 2.63092 6.76188 2.22263 7.83524 2.06879C8.90859 1.91495 10.0032 2.02002 11.0277 2.37524C12.0522 2.73047 12.9768 3.32554 13.7246 4.11081C14.4723 4.89608 15.0214 5.84879 15.3261 6.88943C15.6307 7.93008 15.6821 9.02849 15.4759 10.093C15.2697 11.1576 14.812 12.1574 14.1408 13.009L17.0624 15.9306C17.2081 16.0815 17.2888 16.2836 17.2869 16.4933C17.2851 16.7031 17.201 16.9037 17.0527 17.0521C16.9043 17.2004 16.7037 17.2845 16.4939 17.2864C16.2842 17.2882 16.0821 17.2075 15.9312 17.0618L13.0096 14.1402C12.0069 14.9306 10.8019 15.4228 9.53258 15.5603C8.26324 15.6979 6.98082 15.4753 5.83207 14.918C4.68333 14.3607 3.71468 13.4913 3.03699 12.4093C2.35929 11.3272 1.99991 10.0762 2 8.79942ZM8.8 5.19942C8.58783 5.19942 8.38434 5.28371 8.23431 5.43374C8.08429 5.58377 8 5.78725 8 5.99942C8 6.21159 8.08429 6.41508 8.23431 6.56511C8.38434 6.71514 8.58783 6.79942 8.8 6.79942C9.33043 6.79942 9.83914 7.01014 10.2142 7.38521C10.5893 7.76028 10.8 8.26899 10.8 8.79942C10.8 9.01159 10.8843 9.21508 11.0343 9.36511C11.1843 9.51514 11.3878 9.59942 11.6 9.59942C11.8122 9.59942 12.0157 9.51514 12.1657 9.36511C12.3157 9.21508 12.4 9.01159 12.4 8.79942C12.4 7.84464 12.0207 6.92897 11.3456 6.25384C10.6705 5.57871 9.75478 5.19942 8.8 5.19942Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_search">
                    <rect width="19.2" height="19.2" fill="white" transform="translate(0.399902 0.399902)"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleFilterChange('category')}
            className={`flex items-center gap-2 px-2.5 py-2.5 rounded-[20px] text-sm font-medium font-geist transition-colors ${
              selectedFilters.category 
                ? 'bg-black text-white' 
                : 'bg-white border border-gray-100 text-black'
            }`}
          >
            Category
          </button>

          <button
            onClick={() => handleFilterChange('provider')}
            className={`flex items-center gap-2 px-2.5 py-2.5 rounded-[20px] text-sm font-medium font-geist transition-colors ${
              selectedFilters.provider 
                ? 'bg-black text-white' 
                : 'bg-white border border-gray-100 text-black'
            }`}
          >
            Provider
          </button>

          <button
            onClick={() => handleFilterChange('tags')}
            className={`flex items-center gap-2 px-2.5 py-2.5 rounded-[20px] text-sm font-medium font-geist transition-colors ${
              selectedFilters.tags 
                ? 'bg-black text-white' 
                : 'bg-white border border-gray-100 text-black'
            }`}
          >
            Tags
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-2.5 border border-gray-100 rounded-[20px] bg-white text-gray-500 text-sm font-medium font-geist hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <RecommendedLearningPaths resources={resources} loading={loading} error={error} />
    </div>
  );
}
