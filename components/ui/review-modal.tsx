"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rating: number, comment: string) => void;
  isLoading?: boolean;
  accentColor?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  accentColor = "#5C30FF",
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleClose = () => {
    onClose();
    setRating(0);
    setHoveredRating(0);
    setComment("");
  };

  const handleConfirm = () => {
    if (rating > 0) {
      onConfirm(rating, comment);
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="flex flex-col">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}1A` }}
        >
          <Star className="h-6 w-6" style={{ color: accentColor }} />
        </div>

        <h3 className="mb-2 font-inter-tight text-[16px] font-semibold text-black">
          Leave a Review
        </h3>

        <p className="mb-6 font-inter-tight text-[14px] text-[#525866]">
          Share your experience with this mentorship session
        </p>

        <div className="flex flex-col gap-4">
          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="font-inter-tight text-[13px] font-medium text-black">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className="h-8 w-8"
                    fill={
                      star <= (hoveredRating || rating)
                        ? accentColor
                        : "transparent"
                    }
                    stroke={
                      star <= (hoveredRating || rating)
                        ? accentColor
                        : "#E1E4EA"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label className="font-inter-tight text-[13px] font-medium text-black">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the session..."
              rows={4}
              className="w-full rounded-lg border border-[#E1E4EA] px-3 py-2 font-inter-tight text-[13px] text-black placeholder:text-[#A3A3A3] focus:border-[#5C30FF] focus:outline-none focus:ring-1 focus:ring-[#5C30FF]"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 rounded-[30px] border-[#E1E4EA] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-[#525866] hover:bg-[#F5F5F5]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || rating === 0}
            className="flex-1 rounded-[30px] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-white hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
