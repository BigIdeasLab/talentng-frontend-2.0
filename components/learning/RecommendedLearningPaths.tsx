import React from 'react';
import { formatDuration } from '@/lib/utils';
import { LearningPathCardSkeleton } from './LearningPathCardSkeleton';
import { LearningResource } from '@/lib/types/learning';

interface RecommendedLearningPathsProps {
  resources: LearningResource[];
  loading: boolean;
  error: string | null;
}

export default function RecommendedLearningPaths({ resources, loading, error }: RecommendedLearningPathsProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <LearningPathCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">
            <div
              className="relative flex-shrink-0 h-[300px] rounded-[32px] overflow-hidden"
            >
              <img
                src={resource.backgroundImage}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[114px] bg-black bg-opacity-50 rounded-b-[32px] p-4 flex flex-col justify-between">
                <h3 className="text-base font-semibold text-white font-geist">
                  {resource.title}
                </h3>
                <p className="text-[13px] text-white font-geist">
                  <span className="font-normal">{formatDuration(resource.duration)}</span>
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-2xl font-medium text-[#14171F] font-geist">
          Recommended Learning Paths
        </h2>
        <div className="flex justify-between items-center">
          <p className="text-base text-[#667085] font-geist">
            Reach your learning goals with hand picked sequential classes
          </p>
          <button className="text-base text-[#373F51] font-geist underline hover:no-underline">
            View more
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}