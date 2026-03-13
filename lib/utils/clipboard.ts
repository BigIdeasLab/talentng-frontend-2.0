/**
 * Cross-browser clipboard utilities
 * Provides fallbacks for environments where navigator.clipboard is not available
 */

/**
 * Copy text to clipboard with fallback for older browsers
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback:', error);
      // Fall through to fallback
    }
  }

  // Fallback for older browsers or non-HTTPS contexts
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback clipboard copy using document.execCommand (deprecated but widely supported)
 * 
 * @param text - The text to copy
 * @returns True if successful, false otherwise
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but still selectable
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    
    // Select and copy the text
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback clipboard copy failed:', error);
    return false;
  }
}

/**
 * Check if clipboard functionality is available
 * 
 * @returns True if clipboard is supported
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && navigator.clipboard.writeText) ||
    document.execCommand
  );
}

/**
 * Copy text with user feedback (toast notification)
 * 
 * @param text - The text to copy
 * @param successMessage - Message to show on success
 * @param errorMessage - Message to show on error
 * @returns Promise that resolves to true if successful
 */
export async function copyWithFeedback(
  text: string,
  successMessage: string = 'Copied to clipboard!',
  errorMessage: string = 'Failed to copy to clipboard'
): Promise<boolean> {
  const success = await copyToClipboard(text);
  
  if (success) {
    // You can integrate with your toast system here
    console.log(successMessage);
  } else {
    console.error(errorMessage);
  }
  
  return success;
}