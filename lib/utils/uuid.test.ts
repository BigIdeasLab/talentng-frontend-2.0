import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateUUID,
  generateShortUUID,
  isValidUUID,
  generatePrefixedUUID,
} from "./uuid";

describe("UUID utilities", () => {
  describe("generateUUID", () => {
    it("should generate a valid UUID v4 format", () => {
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it("should use crypto.randomUUID when available", () => {
      const mockRandomUUID = vi.fn(
        () => "550e8400-e29b-41d4-a716-446655440000",
      );

      // Mock crypto.randomUUID
      Object.defineProperty(global, "crypto", {
        value: { randomUUID: mockRandomUUID },
        writable: true,
      });

      const uuid = generateUUID();
      expect(mockRandomUUID).toHaveBeenCalled();
      expect(uuid).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should fall back to polyfill when crypto.randomUUID is not available", () => {
      // Mock crypto as undefined
      Object.defineProperty(global, "crypto", {
        value: undefined,
        writable: true,
      });

      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it("should fall back to polyfill when crypto.randomUUID throws error", () => {
      const mockRandomUUID = vi.fn(() => {
        throw new Error("Not supported");
      });

      Object.defineProperty(global, "crypto", {
        value: { randomUUID: mockRandomUUID },
        writable: true,
      });

      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });
  });

  describe("generateShortUUID", () => {
    it("should generate an 8-character string", () => {
      const shortUuid = generateShortUUID();
      expect(shortUuid).toHaveLength(8);
    });

    it("should generate unique short UUIDs", () => {
      const uuid1 = generateShortUUID();
      const uuid2 = generateShortUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it("should only contain hexadecimal characters", () => {
      const shortUuid = generateShortUUID();
      expect(shortUuid).toMatch(/^[0-9a-f]{8}$/);
    });
  });

  describe("isValidUUID", () => {
    it("should validate correct UUID v4 format", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(isValidUUID(validUuid)).toBe(true);
    });

    it("should reject invalid UUID formats", () => {
      expect(isValidUUID("invalid-uuid")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
      expect(isValidUUID("550e8400-e29b-31d4-a716-446655440000")).toBe(false); // Wrong version
      expect(isValidUUID("")).toBe(false);
    });

    it("should be case insensitive", () => {
      const upperCaseUuid = "550E8400-E29B-41D4-A716-446655440000";
      const lowerCaseUuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(isValidUUID(upperCaseUuid)).toBe(true);
      expect(isValidUUID(lowerCaseUuid)).toBe(true);
    });
  });

  describe("generatePrefixedUUID", () => {
    it("should generate UUID with prefix", () => {
      const prefixedUuid = generatePrefixedUUID("user");
      expect(prefixedUuid).toMatch(
        /^user_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should generate unique prefixed UUIDs", () => {
      const uuid1 = generatePrefixedUUID("session");
      const uuid2 = generatePrefixedUUID("session");
      expect(uuid1).not.toBe(uuid2);
      expect(uuid1.startsWith("session_")).toBe(true);
      expect(uuid2.startsWith("session_")).toBe(true);
    });
  });

  describe("cross-browser compatibility", () => {
    let originalCrypto: any;

    beforeEach(() => {
      originalCrypto = global.crypto;
    });

    afterEach(() => {
      Object.defineProperty(global, "crypto", {
        value: originalCrypto,
        writable: true,
      });
    });

    it("should work in environments without crypto", () => {
      Object.defineProperty(global, "crypto", {
        value: undefined,
        writable: true,
      });

      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it("should work in environments with partial crypto support", () => {
      Object.defineProperty(global, "crypto", {
        value: { getRandomValues: vi.fn() }, // Has crypto but no randomUUID
        writable: true,
      });

      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });
  });
});
