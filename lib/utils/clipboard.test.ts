import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, isClipboardSupported, copyWithFeedback } from './clipboard';

// Mock DOM methods
const mockExecCommand = vi.fn();
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockFocus = vi.fn();
const mockSelect = vi.fn();
const mockSetSelectionRange = vi.fn();

describe('Clipboard utilities', () => {
  let originalNavigator: any;
  let originalDocument: any;

  beforeEach(() => {
    originalNavigator = global.navigator;
    originalDocument = global.document;

    // Reset mocks
    mockExecCommand.mockClear();
    mockCreateElement.mockClear();
    mockAppendChild.mockClear();
    mockRemoveChild.mockClear();
    mockFocus.mockClear();
    mockSelect.mockClear();
    mockSetSelectionRange.mockClear();
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true
    });
    Object.defineProperty(global, 'document', {
      value: originalDocument,
      writable: true
    });
  });

  describe('copyToClipboard', () => {
    it('should use navigator.clipboard.writeText when available', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      
      Object.defineProperty(global, 'navigator', {
        value: {
          clipboard: { writeText: mockWriteText }
        },
        writable: true
      });

      const result = await copyToClipboard('test text');
      
      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should fall back to execCommand when clipboard API fails', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Not allowed'));
      
      Object.defineProperty(global, 'navigator', {
        value: {
          clipboard: { writeText: mockWriteText }
        },
        writable: true
      });

      const mockTextArea = {
        value: '',
        style: {},
        setAttribute: vi.fn(),
        focus: mockFocus,
        select: mockSelect,
        setSelectionRange: mockSetSelectionRange
      };

      mockCreateElement.mockReturnValue(mockTextArea);
      mockExecCommand.mockReturnValue(true);

      Object.defineProperty(global, 'document', {
        value: {
          createElement: mockCreateElement,
          execCommand: mockExecCommand,
          body: {
            appendChild: mockAppendChild,
            removeChild: mockRemoveChild
          }
        },
        writable: true
      });

      const result = await copyToClipboard('test text');
      
      expect(mockWriteText).toHaveBeenCalled();
      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('should use fallback when clipboard API is not available', async () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true
      });

      const mockTextArea = {
        value: '',
        style: {},
        setAttribute: vi.fn(),
        focus: mockFocus,
        select: mockSelect,
        setSelectionRange: mockSetSelectionRange
      };

      mockCreateElement.mockReturnValue(mockTextArea);
      mockExecCommand.mockReturnValue(true);

      Object.defineProperty(global, 'document', {
        value: {
          createElement: mockCreateElement,
          execCommand: mockExecCommand,
          body: {
            appendChild: mockAppendChild,
            removeChild: mockRemoveChild
          }
        },
        writable: true
      });

      const result = await copyToClipboard('test text');
      
      expect(mockCreateElement).toHaveBeenCalledWith('textarea');
      expect(mockTextArea.value).toBe('test text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('should return false when all methods fail', async () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true
      });

      mockCreateElement.mockImplementation(() => {
        throw new Error('DOM not available');
      });

      Object.defineProperty(global, 'document', {
        value: {
          createElement: mockCreateElement,
          execCommand: mockExecCommand,
          body: {
            appendChild: mockAppendChild,
            removeChild: mockRemoveChild
          }
        },
        writable: true
      });

      const result = await copyToClipboard('test text');
      expect(result).toBe(false);
    });
  });

  describe('isClipboardSupported', () => {
    it('should return true when clipboard API is available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          clipboard: { writeText: vi.fn() }
        },
        writable: true
      });

      Object.defineProperty(global, 'document', {
        value: {
          execCommand: vi.fn()
        },
        writable: true
      });

      expect(isClipboardSupported()).toBe(true);
    });

    it('should return true when execCommand is available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true
      });

      Object.defineProperty(global, 'document', {
        value: {
          execCommand: vi.fn()
        },
        writable: true
      });

      expect(isClipboardSupported()).toBe(true);
    });

    it('should return false when no clipboard methods are available', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true
      });

      Object.defineProperty(global, 'document', {
        value: {},
        writable: true
      });

      expect(isClipboardSupported()).toBe(false);
    });
  });

  describe('copyWithFeedback', () => {
    it('should log success message when copy succeeds', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      Object.defineProperty(global, 'navigator', {
        value: {
          clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
        },
        writable: true
      });

      const result = await copyWithFeedback('test', 'Success!', 'Error!');
      
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Success!');
      
      consoleSpy.mockRestore();
    });

    it('should log error message when copy fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true
      });

      Object.defineProperty(global, 'document', {
        value: {},
        writable: true
      });

      const result = await copyWithFeedback('test', 'Success!', 'Error!');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error!');
      
      consoleSpy.mockRestore();
    });
  });
});