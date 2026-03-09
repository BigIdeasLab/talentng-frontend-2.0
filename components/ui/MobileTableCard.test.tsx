import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileTableCard, CardField, CardAction } from "./MobileTableCard";

describe("MobileTableCard", () => {
  const mockFields: CardField[] = [
    { key: "name", label: "Name", value: "John Doe" },
    { key: "email", label: "Email", value: "john@example.com" },
    { key: "role", label: "Role", value: "Developer" },
    { key: "status", label: "Status", value: "Active" },
  ];

  const mockActions: CardAction[] = [
    { key: "edit", label: "Edit", onClick: vi.fn() },
    { key: "delete", label: "Delete", onClick: vi.fn() },
  ];

  it("renders all fields with labels and values", () => {
    render(<MobileTableCard fields={mockFields} />);

    // Check labels
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check values
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders row number when provided", () => {
    render(<MobileTableCard fields={mockFields} rowNumber={5} />);

    expect(screen.getByText("#5")).toBeInTheDocument();
  });

  it("does not render row number when not provided", () => {
    render(<MobileTableCard fields={mockFields} />);

    expect(screen.queryByText(/#\d+/)).not.toBeInTheDocument();
  });

  it("renders actions dropdown when actions are provided", () => {
    render(<MobileTableCard fields={mockFields} actions={mockActions} />);

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("does not render actions dropdown when no actions provided", () => {
    render(<MobileTableCard fields={mockFields} />);

    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });

  it("renders actions button that can be clicked", () => {
    render(<MobileTableCard fields={mockFields} actions={mockActions} />);

    const actionsButton = screen.getByText("Actions").closest("button");
    expect(actionsButton).toBeInTheDocument();

    // Verify button has proper ARIA attributes
    expect(actionsButton).toHaveAttribute("aria-haspopup", "menu");
  });

  it("renders custom header when provided", () => {
    const customHeader = <div data-testid="custom-header">Custom Header</div>;
    render(<MobileTableCard fields={mockFields} header={customHeader} />);

    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });

  it("renders custom footer when provided", () => {
    const customFooter = <div data-testid="custom-footer">Custom Footer</div>;
    render(
      <MobileTableCard
        fields={mockFields}
        actions={mockActions}
        footer={customFooter}
      />,
    );

    expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
    expect(screen.getByText("Custom Footer")).toBeInTheDocument();
    // Actions dropdown should not be rendered when footer is provided
    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
  });

  it("renders dash for empty field values", () => {
    const fieldsWithEmpty: CardField[] = [
      { key: "name", label: "Name", value: "" },
      { key: "email", label: "Email", value: null },
    ];

    render(<MobileTableCard fields={fieldsWithEmpty} />);

    const dashes = screen.getAllByText("-");
    expect(dashes).toHaveLength(2);
  });

  it("applies custom className to card container", () => {
    const { container } = render(
      <MobileTableCard fields={mockFields} className="custom-class" />,
    );

    const card = container.firstChild;
    expect(card).toHaveClass("custom-class");
  });

  it("applies custom className to field", () => {
    const fieldsWithClass: CardField[] = [
      {
        key: "name",
        label: "Name",
        value: "John Doe",
        className: "col-span-2",
      },
    ];

    const { container } = render(<MobileTableCard fields={fieldsWithClass} />);

    const field = container.querySelector(".col-span-2");
    expect(field).toBeInTheDocument();
  });

  it("renders action icons in actions array", () => {
    const actionsWithIcons: CardAction[] = [
      {
        key: "edit",
        label: "Edit",
        onClick: vi.fn(),
        icon: <span data-testid="edit-icon">✏️</span>,
      },
    ];

    render(<MobileTableCard fields={mockFields} actions={actionsWithIcons} />);

    // Verify actions button is present
    const actionsButton = screen.getByText("Actions");
    expect(actionsButton).toBeInTheDocument();
  });

  it("has touch-friendly tap targets for actions button", () => {
    render(<MobileTableCard fields={mockFields} actions={mockActions} />);

    const actionsButton = screen.getByText("Actions").closest("button");
    expect(actionsButton).toHaveStyle({ minHeight: "44px" });
  });

  it("renders React nodes as field values", () => {
    const fieldsWithNodes: CardField[] = [
      {
        key: "status",
        label: "Status",
        value: <span className="text-green-500">Active</span>,
      },
    ];

    render(<MobileTableCard fields={fieldsWithNodes} />);

    const statusValue = screen.getByText("Active");
    expect(statusValue).toHaveClass("text-green-500");
  });

  it("displays fields in 2-column grid layout", () => {
    const { container } = render(<MobileTableCard fields={mockFields} />);

    const grid = container.querySelector(".grid-cols-2");
    expect(grid).toBeInTheDocument();
  });

  it("applies proper spacing and borders", () => {
    const { container } = render(<MobileTableCard fields={mockFields} />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      "border",
      "border-[#E1E4EA]",
      "rounded-[16px]",
      "p-4",
    );
  });
});
