import React from "react";
import { MobileTableCard, CardField, CardAction } from "./MobileTableCard";
import { Edit, Trash2, Eye } from "lucide-react";

/**
 * Example usage of MobileTableCard component
 */
export default function MobileTableCardExample() {
  // Basic example with simple fields
  const basicFields: CardField[] = [
    { key: "name", label: "Name", value: "John Doe" },
    { key: "email", label: "Email", value: "john@example.com" },
    { key: "role", label: "Role", value: "Developer" },
    { key: "status", label: "Status", value: "Active" },
  ];

  const basicActions: CardAction[] = [
    {
      key: "view",
      label: "View Details",
      onClick: () => console.log("View clicked"),
      icon: <Eye className="w-4 h-4" />,
    },
    {
      key: "edit",
      label: "Edit",
      onClick: () => console.log("Edit clicked"),
      icon: <Edit className="w-4 h-4" />,
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => console.log("Delete clicked"),
      icon: <Trash2 className="w-4 h-4" />,
      className: "text-red-600",
    },
  ];

  // Example with React node values
  const styledFields: CardField[] = [
    { key: "name", label: "Applicant", value: "Jane Smith" },
    { key: "position", label: "Position", value: "Senior Designer" },
    {
      key: "status",
      label: "Status",
      value: (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Approved
        </span>
      ),
    },
    {
      key: "salary",
      label: "Salary",
      value: <span className="font-semibold">$120,000</span>,
    },
  ];

  // Example with custom header
  const customHeader = (
    <div className="flex items-center justify-between pb-2 border-b border-[#E1E4EA]">
      <span className="font-inter-tight text-[14px] font-semibold text-black">
        Application #12345
      </span>
      <span className="text-xs text-gray-500">2 days ago</span>
    </div>
  );

  // Example with custom footer
  const customFooter = (
    <div className="flex gap-2">
      <button className="flex-1 px-4 py-2 bg-[#181B25] text-white rounded-lg font-inter-tight text-[13px] font-medium hover:bg-[#2a2d35] transition-colors">
        Approve
      </button>
      <button className="flex-1 px-4 py-2 border border-[#E1E4EA] text-black rounded-lg font-inter-tight text-[13px] font-medium hover:bg-gray-50 transition-colors">
        Reject
      </button>
    </div>
  );

  // Example with full-width field
  const fullWidthFields: CardField[] = [
    { key: "title", label: "Job Title", value: "Full Stack Developer", className: "col-span-2" },
    { key: "company", label: "Company", value: "Tech Corp" },
    { key: "location", label: "Location", value: "San Francisco, CA" },
    { key: "type", label: "Type", value: "Full-time" },
    { key: "salary", label: "Salary Range", value: "$100k - $150k" },
    {
      key: "description",
      label: "Description",
      value: "Looking for an experienced developer to join our team...",
      className: "col-span-2",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-black">
          MobileTableCard Examples
        </h1>

        {/* Basic card with actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Basic Card with Actions
          </h2>
          <MobileTableCard fields={basicFields} actions={basicActions} />
        </div>

        {/* Card with row number */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Card with Row Number
          </h2>
          <MobileTableCard
            fields={basicFields}
            actions={basicActions}
            rowNumber={1}
          />
        </div>

        {/* Card with styled values */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Card with Styled Values
          </h2>
          <MobileTableCard fields={styledFields} actions={basicActions} />
        </div>

        {/* Card with custom header */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Card with Custom Header
          </h2>
          <MobileTableCard
            fields={basicFields}
            actions={basicActions}
            header={customHeader}
          />
        </div>

        {/* Card with custom footer */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Card with Custom Footer
          </h2>
          <MobileTableCard
            fields={styledFields}
            footer={customFooter}
          />
        </div>

        {/* Card without actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Card without Actions
          </h2>
          <MobileTableCard fields={basicFields} />
        </div>

        {/* Card with full-width fields */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Card with Full-Width Fields
          </h2>
          <MobileTableCard fields={fullWidthFields} actions={basicActions} />
        </div>

        {/* Multiple cards in a list */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-black">
            Multiple Cards (List View)
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((num) => (
              <MobileTableCard
                key={num}
                fields={[
                  { key: "name", label: "Name", value: `User ${num}` },
                  { key: "email", label: "Email", value: `user${num}@example.com` },
                  { key: "role", label: "Role", value: "Member" },
                  { key: "status", label: "Status", value: "Active" },
                ]}
                actions={basicActions}
                rowNumber={num}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
