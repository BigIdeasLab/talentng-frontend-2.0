"use client";

import Image from "next/image";

interface Recommendation {
  id: string;
  name: string;
  date: string;
  avatar: string;
  text: string;
}

interface RecommendationsGridProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

const defaultRecommendations: Recommendation[] = [
  {
    id: "1",
    name: "Adeola Ogunniyi",
    date: "Apr 15, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/01cb677bd95bceffde4832706067054e07742b6d?width=80",
    text: "Adeola's work on our e-commerce platform transformed the user checkout experience. She integrated user feedback seamlessly, ensuring a smooth transaction flow.",
  },
  {
    id: "2",
    name: "Chinedu Eze",
    date: "May 20, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/17e0f8649d5b2acbdf3b84f9659212f2c54c411f?width=80",
    text: "Chinedu's innovative approach to our educational app has increased user engagement significantly. His designs are not only visually appealing but also functionally robust.",
  },
  {
    id: "3",
    name: "Ngozi Okafor",
    date: "Jun 10, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/f25e66bac38da7360668fa7a0c3be5e28bf26714?width=80",
    text: "Ngozi's expertise in UI design made our healthcare application more accessible. She has an exceptional ability to simplify complex information.",
  },
  {
    id: "4",
    name: "Uche Nwankwo",
    date: "Jul 5, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/d2d5c07ec3c8a76d67b41bc18c688b38f8aa3e9c?width=80",
    text: "Uche's vibrant designs for our travel app captured the essence of adventure. His attention to detail enhances user experience and brand identity.",
  },
  {
    id: "5",
    name: "Chinonso Obi",
    date: "Aug 22, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/bbf2e154aac73c36beae6c0e53a329fb237a4bf3?width=80",
    text: "Chinonso's creative strategies helped us redefine our music streaming service's interface. His unique style attracts a diverse audience.",
  },
  {
    id: "6",
    name: "Oluchi Nwosu",
    date: "Oct 30, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/1461b9e5fcd47d64b053df42baf38ee3fcbdae04?width=80",
    text: "Oluchi's work on the social media platform breathed new life into our user interface. Her innovative designs resonate with younger audiences.",
  },
  {
    id: "7",
    name: "Efe Aruware",
    date: "Sep 18, 2025",
    avatar:
      "https://api.builder.io/api/v1/image/assets/TEMP/87ce74c19b2f896eb0af92f5338b866048bfa1eb?width=80",
    text: "Efe took charge of our gaming app's UI, making it more interactive and user-friendly. His designs engage players on a deeper level.",
  },
];

export function RecommendationsGrid({
  recommendations = defaultRecommendations,
  isLoading = false,
  onRecommendationClick,
}: RecommendationsGridProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading recommendations...
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">No recommendations yet</p>
          <p className="text-sm">
            Recommendations from clients will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
        {recommendations.map((recommendation) => (
          <button
            key={recommendation.id}
            onClick={() => onRecommendationClick?.(recommendation)}
            className="flex flex-col items-start gap-[10px] p-[15px_12px] rounded-[15px] border border-[#E1E4EA] text-left hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-start gap-[20px] w-full">
              {/* Header with Avatar and Info */}
              <div className="flex flex-col items-start gap-[6px] w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[10px]">
                    {/* Avatar */}
                    <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={recommendation.avatar}
                        alt={recommendation.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Name and Date */}
                    <div className="flex flex-col items-start gap-[10px]">
                      <h3 className="text-[15px] font-medium leading-normal font-inter-tight text-black">
                        {recommendation.name}
                      </h3>
                      <span className="text-[14px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)]">
                        {recommendation.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Text */}
              <p className="text-[14px] font-normal leading-[20px] font-inter-tight text-[#525866] w-full">
                {recommendation.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
