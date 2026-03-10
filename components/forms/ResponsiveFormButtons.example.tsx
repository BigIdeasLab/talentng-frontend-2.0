"use client";

import React from "react";
import { ResponsiveFormButtons } from "./ResponsiveFormButtons";
import { Button } from "@/components/ui/button";

/**
 * Example usage of ResponsiveFormButtons component
 */
export function ResponsiveFormButtonsExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Button Group</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons>
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Start Alignment</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons align="start">
              <Button>Back</Button>
              <Button>Next</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Center Alignment</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons align="center">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Between Alignment</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons align="between">
              <Button variant="outline">Back</Button>
              <Button>Next</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Reversed Order on Mobile</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons reverseOnMobile>
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </ResponsiveFormButtons>
            <p className="text-sm text-gray-500 mt-2">
              On mobile, Submit button appears first (above Cancel)
            </p>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Gap Spacing</h2>
        <form className="space-y-6">
          <div className="p-4 border rounded-lg">
            <p className="text-sm font-medium mb-2">Gap 2 (default)</p>
            <ResponsiveFormButtons gap={2}>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </ResponsiveFormButtons>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-sm font-medium mb-2">Gap 4</p>
            <ResponsiveFormButtons gap={4}>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </ResponsiveFormButtons>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-sm font-medium mb-2">Gap 6</p>
            <ResponsiveFormButtons gap={6}>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Multiple Buttons</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons>
              <Button variant="outline">Cancel</Button>
              <Button variant="secondary">Save Draft</Button>
              <Button>Publish</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Multi-Step Form Pattern</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons align="between">
              <Button variant="outline">Back</Button>
              <div className="flex gap-2">
                <Button variant="secondary">Save Draft</Button>
                <Button>Next</Button>
              </div>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Form with Different Button Variants</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons>
              <Button variant="ghost">Cancel</Button>
              <Button variant="outline">Save Draft</Button>
              <Button variant="default">Submit</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Disabled Buttons</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons>
              <Button variant="outline">Cancel</Button>
              <Button disabled>Submit (Disabled)</Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Loading State</h2>
        <form className="space-y-4">
          <div className="p-4 border rounded-lg">
            <ResponsiveFormButtons>
              <Button variant="outline">Cancel</Button>
              <Button disabled>
                <span className="mr-2">⏳</span>
                Submitting...
              </Button>
            </ResponsiveFormButtons>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ResponsiveFormButtonsExample;
