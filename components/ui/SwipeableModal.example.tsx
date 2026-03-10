import { useState } from "react";
import { SwipeableModal } from "./SwipeableModal";
import { X } from "lucide-react";

export default function SwipeableModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | "left" | "right">("down");

  return (
    <div className="p-8 space-y-4">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Swipeable Modal Example</h2>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isMobile}
              onChange={(e) => setIsMobile(e.target.checked)}
            />
            Mobile Mode
          </label>
          
          <div>
            <label className="block text-sm font-medium mb-1">Swipe Direction:</label>
            <select
              value={swipeDirection}
              onChange={(e) => setSwipeDirection(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="down">Down</option>
              <option value="up">Up</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Open Swipeable Modal
        </button>
      </div>

      <SwipeableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isMobile={isMobile}
        swipeDirection={swipeDirection}
        swipeEnabled={true}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Swipeable Modal</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-gray-700">
            This modal can be dismissed by swiping in the {swipeDirection} direction.
          </p>
          
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-800">
              <strong>Try it:</strong> Swipe {swipeDirection} to close this modal, 
              or use the close button above.
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Current settings:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Mobile mode: {isMobile ? "On" : "Off"}</li>
              <li>Swipe direction: {swipeDirection}</li>
              <li>Swipe enabled: Yes</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded"
          >
            Close Modal
          </button>
        </div>
      </SwipeableModal>
    </div>
  );
}