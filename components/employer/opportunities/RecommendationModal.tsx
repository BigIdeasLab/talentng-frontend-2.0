"use client";

import { useState, useEffect } from "react";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  onSubmit: (data: {
    title: string;
    comment: string;
    rating: number;
  }) => Promise<void>;
  initialData?: {
    title: string;
    comment: string;
    rating: number;
  };
  isEditing?: boolean;
}

export function RecommendationModal({
  isOpen,
  onClose,
  applicantName,
  onSubmit,
  initialData,
  isEditing,
}: RecommendationModalProps) {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setComment(initialData.comment);
        setRating(initialData.rating);
      } else {
        setTitle("");
        setComment("");
        setRating(5);
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ title, comment, rating });
      setTitle("");
      setComment("");
      setRating(5);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[12px] max-w-[500px] w-full p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-inter-tight text-[20px] font-semibold text-black">
              {isEditing ? "Edit Recommendation" : "Recommend"} {applicantName}
            </h2>
            <p className="font-inter-tight text-[13px] text-[#525866] mt-1">
              {isEditing
                ? "Update your feedback about this talent"
                : "Share your feedback about this talent"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black/30 hover:text-black/50 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-inter-tight text-[13px] font-semibold text-black">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Full-Stack Developer"
              className="px-3 py-2 rounded-[8px] border border-[#E1E4EA] font-inter-tight text-[13px] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#5C30FF]/20"
              required
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="font-inter-tight text-[13px] font-semibold text-black">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="font-inter-tight text-[13px] text-[#525866] ml-2">
                {rating}/5
              </span>
            </div>
          </div>

          {/* Comment/Review */}
          <div className="flex flex-col gap-2">
            <label className="font-inter-tight text-[13px] font-semibold text-black">
              Recommendation/Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback about this talent..."
              rows={4}
              className="px-3 py-2 rounded-[8px] border border-[#E1E4EA] font-inter-tight text-[13px] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#5C30FF]/20 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-[8px] border border-[#E1E4EA] font-inter-tight text-[13px] font-medium text-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title || !comment}
              className="flex-1 px-4 py-2 rounded-[8px] bg-[#5C30FF] hover:bg-[#4a26cc] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-medium text-white transition-colors"
            >
              {isLoading
                ? "Submitting..."
                : isEditing
                  ? "Update Recommendation"
                  : "Send Recommendation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
