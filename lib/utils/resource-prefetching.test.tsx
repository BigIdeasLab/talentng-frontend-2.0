import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import {
  PrefetchOnInteraction,
  preloadImage,
  preloadImages,
} from "./resource-prefetching";

// Mock Next.js router
const mockPrefetch = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
  }),
}));

// Mock useIsMobile hook
vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: () => true,
}));

describe("resource-prefetching utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PrefetchOnInteraction", () => {
    it("should call custom onPrefetch callback", () => {
      const onPrefetch = vi.fn();

      render(
        <PrefetchOnInteraction onPrefetch={onPrefetch}>
          <button>Test Button</button>
        </PrefetchOnInteraction>,
      );

      const button = screen.getByText("Test Button");
      fireEvent.mouseEnter(button);

      expect(onPrefetch).toHaveBeenCalled();
    });

    it("should only call onPrefetch once", () => {
      const onPrefetch = vi.fn();

      render(
        <PrefetchOnInteraction onPrefetch={onPrefetch}>
          <button>Test Button</button>
        </PrefetchOnInteraction>,
      );

      const button = screen.getByText("Test Button");

      // Trigger multiple interactions
      fireEvent.mouseEnter(button);
      fireEvent.focus(button);
      fireEvent.mouseEnter(button);

      expect(onPrefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("image preloading utilities", () => {
    beforeEach(() => {
      // Mock Image constructor
      global.Image = vi.fn().mockImplementation(() => ({
        onload: null,
        onerror: null,
        src: "",
      }));
    });

    describe("preloadImage", () => {
      it("should resolve when image loads", async () => {
        const mockImage: any = {
          onload: null,
          onerror: null,
          src: "",
        };

        (global.Image as any).mockImplementation(() => mockImage);

        const promise = preloadImage("/test-image.jpg");

        // Simulate image load immediately
        if (mockImage.onload) {
          mockImage.onload.call(mockImage, {} as any);
        }

        await expect(promise).resolves.toBeUndefined();
        expect(mockImage.src).toBe("/test-image.jpg");
      });

      it("should reject when image fails to load", async () => {
        const mockImage: any = {
          onload: null,
          onerror: null,
          src: "",
        };

        (global.Image as any).mockImplementation(() => mockImage);

        const promise = preloadImage("/test-image.jpg");

        // Simulate image error immediately
        if (mockImage.onerror) {
          mockImage.onerror.call(mockImage, {} as any);
        }

        await expect(promise).rejects.toBeDefined();
      });
    });

    describe("preloadImages", () => {
      it("should preload multiple images", async () => {
        const images = ["/image1.jpg", "/image2.jpg"];
        const mockImages: any[] = [];

        (global.Image as any).mockImplementation(() => {
          const mockImage = {
            onload: null,
            onerror: null,
            src: "",
          };
          mockImages.push(mockImage);
          return mockImage;
        });

        const promise = preloadImages(images);

        // Simulate all images loading immediately
        mockImages.forEach((img) => {
          if (img.onload) {
            img.onload({});
          }
        });

        await expect(promise).resolves.toHaveLength(2);
        expect(mockImages).toHaveLength(2);
        expect(mockImages[0].src).toBe("/image1.jpg");
        expect(mockImages[1].src).toBe("/image2.jpg");
      });
    });
  });
});
