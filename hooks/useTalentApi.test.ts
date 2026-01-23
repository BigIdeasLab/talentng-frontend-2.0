import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCurrentProfile, useTalentProfile } from './useTalentApi';
import * as talentService from '@/lib/api/talent-service';
import React from 'react';

// Mock the talent service
vi.mock('@/lib/api/talent-service', () => ({
  talentProfileApi: {
    getCurrentProfile: vi.fn(),
    getTalentProfileByUserId: vi.fn(),
  },
}));

// Create test wrapper with QueryClient
function createWrapper() {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: testQueryClient },
      children,
    );
}

describe('useTalentApi Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCurrentProfile', () => {
    it('should fetch current profile successfully', async () => {
      const mockProfile = {
        id: '1',
        userId: 'user-1',
        fullName: 'John Doe',
        headline: 'Software Developer',
        bio: 'Test bio',
        profileImageUrl: '',
        coverImageUrl: '',
        availabilityType: 'AVAILABLE',
        hourlyRate: 50,
        skills: [],
        languages: [],
        education: [],
        experience: [],
        portfolio: [],
        socialLinks: {},
        recommendations: [],
        services: [],
      } as any;

      vi.mocked(talentService.talentProfileApi.getCurrentProfile).mockResolvedValue(
        mockProfile,
      );

      const { result } = renderHook(() => useCurrentProfile(), {
        wrapper: createWrapper(),
      });

      // Initially in loading state
      expect(result.current.isLoading).toBe(true);

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProfile);
      expect(result.current.error).toBe(null);
    });

    it('should handle profile fetch error', async () => {
      const error = new Error('Failed to fetch profile');
      vi.mocked(talentService.talentProfileApi.getCurrentProfile).mockRejectedValue(
        error,
      );

      const { result } = renderHook(() => useCurrentProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useTalentProfile', () => {
    it('should fetch talent profile by userId', async () => {
      const userId = 'test-user-123';
      const mockProfile = {
        id: '1',
        userId,
        fullName: 'Jane Doe',
        headline: 'Designer',
        bio: 'Test bio',
        profileImageUrl: '',
        coverImageUrl: '',
        availabilityType: 'AVAILABLE',
        hourlyRate: 60,
        skills: [],
        languages: [],
        education: [],
        experience: [],
        portfolio: [],
        socialLinks: {},
        recommendations: [],
        services: [],
      } as any;

      vi.mocked(
        talentService.talentProfileApi.getTalentProfileByUserId,
      ).mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useTalentProfile(userId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProfile);
      expect(talentService.talentProfileApi.getTalentProfileByUserId).toHaveBeenCalledWith(
        userId,
      );
    });
  });
});
