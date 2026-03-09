"use client";

import React from "react";
import {
  ResponsiveFormField,
  ResponsiveFormRow,
} from "./ResponsiveFormField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/**
 * Example usage of ResponsiveFormField and ResponsiveFormRow components
 */
export function ResponsiveFormFieldExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Single Column Form</h2>
        <form className="space-y-4">
          <ResponsiveFormField>
            <Label>Email Address</Label>
            <Input type="email" placeholder="you@example.com" />
          </ResponsiveFormField>

          <ResponsiveFormField>
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" />
          </ResponsiveFormField>

          <ResponsiveFormField>
            <Label>Bio</Label>
            <textarea
              className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2"
              placeholder="Tell us about yourself"
              rows={4}
            />
          </ResponsiveFormField>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Two Column Form</h2>
        <form className="space-y-4">
          <ResponsiveFormRow columns={2}>
            <ResponsiveFormField>
              <Label>First Name</Label>
              <Input type="text" placeholder="John" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>Last Name</Label>
              <Input type="text" placeholder="Doe" />
            </ResponsiveFormField>
          </ResponsiveFormRow>

          <ResponsiveFormRow columns={2}>
            <ResponsiveFormField>
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>Phone</Label>
              <Input type="tel" placeholder="+1 (555) 000-0000" />
            </ResponsiveFormField>
          </ResponsiveFormRow>

          <ResponsiveFormField spanFull>
            <Label>Address</Label>
            <Input type="text" placeholder="123 Main St, City, State, ZIP" />
          </ResponsiveFormField>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Three Column Form</h2>
        <form className="space-y-4">
          <ResponsiveFormRow columns={3}>
            <ResponsiveFormField>
              <Label>City</Label>
              <Input type="text" placeholder="San Francisco" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>State</Label>
              <Input type="text" placeholder="CA" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>ZIP Code</Label>
              <Input type="text" placeholder="94102" />
            </ResponsiveFormField>
          </ResponsiveFormRow>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Full Width Fields</h2>
        <form className="space-y-4">
          <ResponsiveFormField fullWidth>
            <Label>Company Name</Label>
            <Input type="text" placeholder="Acme Corporation" />
          </ResponsiveFormField>

          <ResponsiveFormField fullWidth>
            <Label>Website</Label>
            <Input type="url" placeholder="https://example.com" />
          </ResponsiveFormField>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Mixed Layout</h2>
        <form className="space-y-4">
          <ResponsiveFormRow columns={2}>
            <ResponsiveFormField>
              <Label>Project Name</Label>
              <Input type="text" placeholder="My Project" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>Budget</Label>
              <Input type="number" placeholder="10000" />
            </ResponsiveFormField>
          </ResponsiveFormRow>

          <ResponsiveFormField spanFull>
            <Label>Project Description</Label>
            <textarea
              className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2"
              placeholder="Describe your project"
              rows={4}
            />
          </ResponsiveFormField>

          <ResponsiveFormRow columns={3} gap={6}>
            <ResponsiveFormField>
              <Label>Start Date</Label>
              <Input type="date" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>End Date</Label>
              <Input type="date" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>Priority</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </ResponsiveFormField>
          </ResponsiveFormRow>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Gap Spacing</h2>
        <form className="space-y-6">
          <ResponsiveFormRow columns={2} gap={8}>
            <ResponsiveFormField>
              <Label>Field with Large Gap</Label>
              <Input type="text" placeholder="Field 1" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>Field with Large Gap</Label>
              <Input type="text" placeholder="Field 2" />
            </ResponsiveFormField>
          </ResponsiveFormRow>

          <ResponsiveFormRow columns={2} gap={2}>
            <ResponsiveFormField>
              <Label>Field with Small Gap</Label>
              <Input type="text" placeholder="Field 1" />
            </ResponsiveFormField>

            <ResponsiveFormField>
              <Label>Field with Small Gap</Label>
              <Input type="text" placeholder="Field 2" />
            </ResponsiveFormField>
          </ResponsiveFormRow>
        </form>
      </section>
    </div>
  );
}

export default ResponsiveFormFieldExample;
