"use client";

import React from "react";
import { ResponsiveTable, ColumnDef, RowAction } from "./ResponsiveTable";
import { Eye, Edit, Trash2, Mail } from "lucide-react";

/**
 * Example usage of ResponsiveTable component
 *
 * This file demonstrates various use cases:
 * 1. Basic table with all columns
 * 2. Table with essential columns for tablet view
 * 3. Table with row actions
 * 4. Table with custom mobile card renderer
 * 5. Table with row numbers
 */

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinedDate: string;
  avatar?: string;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Developer",
    status: "active",
    joinedDate: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Designer",
    status: "active",
    joinedDate: "2024-02-20",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Manager",
    status: "inactive",
    joinedDate: "2023-12-10",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export function BasicTableExample() {
  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Name",
      essential: true,
      accessor: (user) => user.name,
    },
    {
      key: "email",
      label: "Email",
      essential: true,
      accessor: (user) => user.email,
    },
    {
      key: "role",
      label: "Role",
      essential: false,
      accessor: (user) => user.role,
    },
    {
      key: "status",
      label: "Status",
      essential: true,
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "joinedDate",
      label: "Joined Date",
      essential: false,
      accessor: (user) => new Date(user.joinedDate).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Table Example</h2>
      <ResponsiveTable data={sampleUsers} columns={columns} showRowNumbers />
    </div>
  );
}

export function TableWithActionsExample() {
  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Name",
      essential: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{user.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      essential: true,
      accessor: (user) => user.email,
    },
    {
      key: "role",
      label: "Role",
      essential: false,
      accessor: (user) => user.role,
    },
  ];

  const actions: RowAction<User>[] = [
    {
      key: "view",
      label: "View",
      onClick: (user) => console.log("View user:", user),
      icon: <Eye className="w-4 h-4" />,
    },
    {
      key: "edit",
      label: "Edit",
      onClick: (user) => console.log("Edit user:", user),
      icon: <Edit className="w-4 h-4" />,
    },
    {
      key: "email",
      label: "Send Email",
      onClick: (user) => console.log("Email user:", user),
      icon: <Mail className="w-4 h-4" />,
    },
    {
      key: "delete",
      label: "Delete",
      onClick: (user) => console.log("Delete user:", user),
      icon: <Trash2 className="w-4 h-4" />,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Table with Actions Example</h2>
      <ResponsiveTable
        data={sampleUsers}
        columns={columns}
        actions={actions}
        showRowNumbers
      />
    </div>
  );
}

export function CustomMobileCardExample() {
  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Name",
      essential: true,
      accessor: (user) => user.name,
    },
    {
      key: "email",
      label: "Email",
      essential: true,
      accessor: (user) => user.email,
    },
    {
      key: "role",
      label: "Role",
      essential: false,
      accessor: (user) => user.role,
    },
  ];

  const customMobileCard = (user: User, index: number) => (
    <div className="space-y-3">
      {/* User header with avatar */}
      <div className="flex items-center gap-3">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-inter-tight text-[14px] font-semibold text-black">
            {user.name}
          </div>
          <div className="font-inter-tight text-[12px] text-[#525866]">
            {user.role}
          </div>
        </div>
      </div>

      {/* User details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#525866]" />
          <span className="font-inter-tight text-[12px] text-black">
            {user.email}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-inter-tight text-[11px] text-[#525866]">
            Status
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-[#E1E4EA]">
        <button className="flex-1 px-3 py-2 bg-[#181B25] text-white rounded-lg font-inter-tight text-[12px] font-medium hover:bg-[#2a2d35] transition-colors">
          View Profile
        </button>
        <button className="flex-1 px-3 py-2 border border-[#E1E4EA] text-black rounded-lg font-inter-tight text-[12px] font-medium hover:bg-gray-50 transition-colors">
          Send Email
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Custom Mobile Card Example</h2>
      <p className="text-sm text-gray-600 mb-4">
        Resize your browser to mobile width to see the custom card layout
      </p>
      <ResponsiveTable
        data={sampleUsers}
        columns={columns}
        mobileCardRenderer={customMobileCard}
      />
    </div>
  );
}

export function EmptyStateExample() {
  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Name",
      essential: true,
      accessor: (user) => user.name,
    },
    {
      key: "email",
      label: "Email",
      essential: true,
      accessor: (user) => user.email,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Empty State Example</h2>
      <ResponsiveTable
        data={[]}
        columns={columns}
        emptyMessage="No users found. Try adjusting your filters."
      />
    </div>
  );
}

// Main example component showing all variations
export default function ResponsiveTableExamples() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">ResponsiveTable Examples</h1>
        <p className="text-gray-600">
          Demonstrating various use cases of the ResponsiveTable component.
          Resize your browser to see responsive behavior.
        </p>
      </div>

      <BasicTableExample />
      <TableWithActionsExample />
      <CustomMobileCardExample />
      <EmptyStateExample />
    </div>
  );
}
