import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { KeyboardNavigationManager, keyboardHandlers } from "./keyboard-navigation";

describe("KeyboardNavigationManager", () => {
  let manager: KeyboardNavigationManager;
  let mockContainer: HTMLElement;

  beforeEach(() => {
    // Reset the singleton instance
    (KeyboardNavigationManager as any).instance = undefined;
    manager = KeyboardNavigationManager.getInstance();
    
    // Create mock container with focusable elements
    mockContainer = document.createElement("div");
    mockContainer.innerHTML = `
      <button id="btn1">Button 1</button>
      <input id="input1" type="text" />
      <a id="link1" href="#">Link 1</a>
      <button id="btn2" disabled>Disabled Button</button>
      <div id="hidden" style="display: none;">
        <button id="btn3">Hidden Button</button>
      </div>
    `;
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
    manager.clearElements();
  });

  it("should be a singleton", () => {
    const manager1 = KeyboardNavigationManager.getInstance();
    const manager2 = KeyboardNavigationManager.getInstance();
    expect(manager1).toBe(manager2);
  });

  it("should register focusable elements correctly", () => {
    manager.setTabletMode(true);
    manager.registerFocusableElements(mockContainer);

    // Should return true when elements are registered and tablet mode is on
    expect(manager.focusFirst()).toBe(true);
  });

  it("should navigate between elements", () => {
    manager.setTabletMode(true);
    manager.registerFocusableElements(mockContainer);

    // Should return true for successful navigation
    expect(manager.focusFirst()).toBe(true);
    expect(manager.focusNext()).toBe(true);
    expect(manager.focusPrevious()).toBe(true);
    expect(manager.focusLast()).toBe(true);
  });

  it("should not navigate when not in tablet mode", () => {
    manager.setTabletMode(false);
    manager.registerFocusableElements(mockContainer);

    expect(manager.focusFirst()).toBe(false);
    expect(manager.focusNext()).toBe(false);
    expect(manager.focusPrevious()).toBe(false);
    expect(manager.focusLast()).toBe(false);
  });

  it("should handle empty element list", () => {
    manager.setTabletMode(true);
    // Don't register any elements

    expect(manager.focusFirst()).toBe(false);
    expect(manager.focusNext()).toBe(false);
    expect(manager.focusPrevious()).toBe(false);
    expect(manager.focusLast()).toBe(false);
  });

  it("should clear elements", () => {
    manager.setTabletMode(true);
    manager.registerFocusableElements(mockContainer);

    expect(manager.focusFirst()).toBe(true);

    manager.clearElements();
    expect(manager.focusFirst()).toBe(false);
  });
});

describe("keyboardHandlers", () => {
  it("should handle activation keys", () => {
    const mockCallback = vi.fn();
    const handler = keyboardHandlers.handleActivation(mockCallback);

    // Test Enter key
    const enterEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
    } as any;
    handler(enterEvent);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(enterEvent.preventDefault).toHaveBeenCalled();

    // Test Space key
    const spaceEvent = {
      key: " ",
      preventDefault: vi.fn(),
    } as any;
    handler(spaceEvent);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(spaceEvent.preventDefault).toHaveBeenCalled();

    // Test other key (should not trigger)
    const otherEvent = {
      key: "a",
      preventDefault: vi.fn(),
    } as any;
    handler(otherEvent);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(otherEvent.preventDefault).not.toHaveBeenCalled();
  });

  it("should handle escape key", () => {
    const mockCallback = vi.fn();
    const handler = keyboardHandlers.handleEscape(mockCallback);

    const escapeEvent = {
      key: "Escape",
      preventDefault: vi.fn(),
    } as any;
    handler(escapeEvent);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(escapeEvent.preventDefault).toHaveBeenCalled();
  });

  it("should handle arrow navigation", () => {
    const mockUp = vi.fn();
    const mockDown = vi.fn();
    const mockLeft = vi.fn();
    const mockRight = vi.fn();
    
    const handler = keyboardHandlers.handleArrowNavigation(
      mockUp,
      mockDown,
      mockLeft,
      mockRight
    );

    // Test all arrow keys
    const events = [
      { key: "ArrowUp", callback: mockUp },
      { key: "ArrowDown", callback: mockDown },
      { key: "ArrowLeft", callback: mockLeft },
      { key: "ArrowRight", callback: mockRight },
    ];

    events.forEach(({ key, callback }) => {
      const event = {
        key,
        preventDefault: vi.fn(),
      } as any;
      handler(event);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});