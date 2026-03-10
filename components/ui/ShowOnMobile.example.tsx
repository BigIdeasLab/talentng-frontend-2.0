import React from "react";
import { ShowOnMobile } from "./ShowOnMobile";
import { HideOnMobile } from "./HideOnMobile";

export default function ShowOnMobileExample() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">ShowOnMobile Component Examples</h2>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Basic Usage</h3>
        <p className="text-sm text-gray-600 mb-2">
          This content is visible only on mobile (&lt; 768px) and hidden on
          tablet and desktop (≥ 768px)
        </p>
        <ShowOnMobile>
          <div className="bg-purple-100 p-3 rounded">
            <p>This content is only visible on mobile viewports!</p>
            <p className="text-sm text-gray-600">
              Resize your browser to see the visibility change at 768px
              breakpoint.
            </p>
          </div>
        </ShowOnMobile>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Mobile Navigation Example</h3>
        <div className="flex items-center justify-between">
          <span>Logo</span>

          <ShowOnMobile>
            <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm">
              ☰ Menu
            </button>
          </ShowOnMobile>

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
        </div>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Mobile-Specific Actions</h3>
        <div className="space-y-2">
          <ShowOnMobile>
            <button className="w-full bg-green-600 text-white py-3 rounded font-medium">
              Mobile: Tap to Call
            </button>
          </ShowOnMobile>

          <ShowOnMobile>
            <button className="w-full bg-blue-600 text-white py-3 rounded font-medium">
              Mobile: Get Directions
            </button>
          </ShowOnMobile>

          <HideOnMobile>
            <div className="bg-gray-100 p-3 rounded">
              <p>Desktop version with different actions and layout</p>
              <div className="flex space-x-2 mt-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Call
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Directions
                </button>
              </div>
            </div>
          </HideOnMobile>
        </div>
      </div>
    </div>
  );
}
