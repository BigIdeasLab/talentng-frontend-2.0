import React from "react";
import { HideOnMobile } from "./HideOnMobile";

export default function HideOnMobileExample() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">HideOnMobile Component Examples</h2>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Basic Usage</h3>
        <p className="text-sm text-gray-600 mb-2">
          This content is hidden on mobile (&lt; 768px) and visible on tablet
          and desktop (≥ 768px)
        </p>
        <HideOnMobile>
          <div className="bg-blue-100 p-3 rounded">
            <p>This content is only visible on tablet and desktop viewports!</p>
            <p className="text-sm text-gray-600">
              Resize your browser to see the visibility change at 768px
              breakpoint.
            </p>
          </div>
        </HideOnMobile>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">With Custom Styling</h3>
        <HideOnMobile className="bg-green-50 border border-green-200 rounded-lg">
          <div className="p-3">
            <h4 className="font-medium text-green-800">
              Desktop/Tablet Only Feature
            </h4>
            <p className="text-green-700">
              This could be a detailed sidebar, advanced controls, or decorative
              elements that are hidden on mobile to save space.
            </p>
          </div>
        </HideOnMobile>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Navigation Example</h3>
        <div className="flex items-center space-x-4">
          <span>Logo</span>
          <HideOnMobile>
            <nav className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Home
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                About
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Services
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Contact
              </a>
            </nav>
          </HideOnMobile>
          <span className="ml-auto">User Menu</span>
        </div>
      </div>
    </div>
  );
}
