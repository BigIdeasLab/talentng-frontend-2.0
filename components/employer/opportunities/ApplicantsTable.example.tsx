/**
 * ApplicantsTable Example
 * 
 * This example demonstrates the refactored ApplicantsTable component
 * that now uses the ResponsiveTable component for responsive behavior.
 * 
 * Features:
 * - Desktop: Traditional table with all columns (S/N, Talents, Hires, Opportunity, Location, Date Applied, Status, Actions)
 * - Tablet: Horizontal scrolling with essential columns only (Talents, Location, Date Applied, Status)
 * - Mobile: Card-based layout with custom mobile card renderer
 * - Maintains sorting, filtering, and action functionality across all breakpoints
 * - Touch-friendly action buttons on mobile
 */

import { ApplicantsTable } from "./ApplicantsTable";

const mockApplicants = [
  {
    id: "app-1",
    userId: "user-1",
    opportunityId: "opp-1",
    status: "pending",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    user: {
      id: "user-1",
      username: "johndoe",
      email: "john@example.com",
      talentProfile: {
        id: "profile-1",
        fullName: "John Doe",
        headline: "Senior Software Engineer",
        bio: "Experienced full-stack developer",
        skills: ["React", "TypeScript", "Node.js"],
        location: "New York, NY",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        category: "Engineering",
      },
    },
  },
  {
    id: "app-2",
    userId: "user-2",
    opportunityId: "opp-1",
    status: "interviewing",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    user: {
      id: "user-2",
      username: "janedoe",
      email: "jane@example.com",
      talentProfile: {
        id: "profile-2",
        fullName: "Jane Smith",
        headline: "Product Designer",
        bio: "UX/UI specialist with 5 years experience",
        skills: ["Figma", "Sketch", "User Research"],
        location: "San Francisco, CA",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        category: "Design",
      },
    },
  },
  {
    id: "app-3",
    userId: "user-3",
    opportunityId: "opp-1",
    status: "hired",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-17T16:00:00Z",
    user: {
      id: "user-3",
      username: "bobsmith",
      email: "bob@example.com",
      talentProfile: {
        id: "profile-3",
        fullName: "Bob Johnson",
        headline: "DevOps Engineer",
        bio: "Cloud infrastructure expert",
        skills: ["AWS", "Docker", "Kubernetes"],
        location: "Austin, TX",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        category: "Engineering",
      },
    },
  },
];

export default function ApplicantsTableExample() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">ApplicantsTable - Default View</h2>
        <p className="text-gray-600 mb-4">
          Shows all applicants with sorting and filtering capabilities.
          Resize your browser to see responsive behavior.
        </p>
        <ApplicantsTable
          searchQuery=""
          sortBy="newest"
          applicants={mockApplicants}
          opportunityTitle="Senior Full Stack Developer"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">ApplicantsTable - With Search</h2>
        <p className="text-gray-600 mb-4">
          Filtered to show only applicants matching "john"
        </p>
        <ApplicantsTable
          searchQuery="john"
          sortBy="newest"
          applicants={mockApplicants}
          opportunityTitle="Senior Full Stack Developer"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">ApplicantsTable - With Filters</h2>
        <p className="text-gray-600 mb-4">
          Filtered to show only "pending" status applicants
        </p>
        <ApplicantsTable
          searchQuery=""
          sortBy="newest"
          applicants={mockApplicants}
          opportunityTitle="Senior Full Stack Developer"
          appliedFilters={{
            status: ["pending"],
            location: "",
            dateRange: "all",
          }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">ApplicantsTable - Sorted by Oldest</h2>
        <p className="text-gray-600 mb-4">
          Applicants sorted by oldest first
        </p>
        <ApplicantsTable
          searchQuery=""
          sortBy="oldest"
          applicants={mockApplicants}
          opportunityTitle="Senior Full Stack Developer"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">ApplicantsTable - Empty State</h2>
        <p className="text-gray-600 mb-4">
          Shows empty state when no applicants match the criteria
        </p>
        <ApplicantsTable
          searchQuery=""
          sortBy="newest"
          applicants={[]}
          opportunityTitle="Senior Full Stack Developer"
        />
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Responsive Behavior:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Desktop (≥ 1024px):</strong> Traditional table with all columns and row numbers</li>
          <li><strong>Tablet (768px - 1023px):</strong> Horizontal scrolling with essential columns (Talents, Location, Date Applied, Status)</li>
          <li><strong>Mobile (&lt; 768px):</strong> Card-based layout with custom mobile card renderer showing applicant details</li>
          <li><strong>Actions:</strong> Desktop shows inline buttons, mobile shows full-width buttons in card footer</li>
          <li><strong>Touch-friendly:</strong> All interactive elements meet 44x44px minimum tap target size on mobile</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-bold mb-2">Essential Columns for Tablet:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Talents (with profile image and headline)</li>
          <li>Location</li>
          <li>Date Applied</li>
          <li>Status</li>
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          Non-essential columns (Hires, Opportunity) are hidden on tablet to reduce horizontal scrolling.
        </p>
      </div>
    </div>
  );
}
