"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to handle mobile input scrolling behavior
 * Automatically scrolls input fields into view when focused on mobile devices
 */
export const useMobileInputScroll = () => {
  const inputRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerInput = (id: string, element: HTMLElement | null) => {
    if (element) {
      inputRefs.current.set(id, element);
    } else {
      inputRefs.current.delete(id);
    }
  };

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      // Only handle input elements on mobile
      if (!target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      // Check if we're on mobile (viewport width < 768px)
      if (window.innerWidth >= 768) {
        return;
      }

      // Small delay to ensure virtual keyboard is shown
      setTimeout(() => {
        const rect = target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const keyboardHeight = viewportHeight * 0.4; // Estimate keyboard height
        const availableHeight = viewportHeight - keyboardHeight;
        
        // Calculate desired position (input should be in upper third of available space)
        const desiredTop = availableHeight * 0.25;
        
        if (rect.top > desiredTop || rect.bottom > availableHeight) {
          const scrollOffset = rect.top - desiredTop;
          
          window.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
          });
        }
      }, 300); // Wait for keyboard animation
    };

    const handleBlur = () => {
      // Optional: scroll back to top when input loses focus
      // Uncomment if needed
      // if (window.innerWidth < 768) {
      //   setTimeout(() => {
      //     window.scrollTo({ top: 0, behavior: 'smooth' });
      //   }, 100);
      // }
    };

    // Add event listeners to document
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return { registerInput };
};