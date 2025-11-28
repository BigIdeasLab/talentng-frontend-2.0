import React from "react";

interface SmoothCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const SmoothCollapse = ({ isOpen, children }: SmoothCollapseProps) => {
  return (
    <div
      style={{
        display: isOpen ? "block" : "none",
        animation: isOpen ? "slideDown 0.3s ease-in-out" : undefined,
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            overflow: hidden;
          }
          to {
            opacity: 1;
            max-height: 1000px;
            overflow: visible;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 1000px;
          }
          to {
            opacity: 0;
            max-height: 0;
            overflow: hidden;
          }
        }
      `}</style>
      {children}
    </div>
  );
};
