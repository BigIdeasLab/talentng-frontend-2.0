import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResponsiveFormField, ResponsiveFormRow } from "./ResponsiveFormField";

describe("ResponsiveFormField", () => {
  it("renders children correctly", () => {
    render(
      <ResponsiveFormField>
        <label data-testid="label">Email</label>
        <input data-testid="input" type="email" />
      </ResponsiveFormField>,
    );

    expect(screen.getByTestId("label")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("applies default responsive classes", () => {
    const { container } = render(
      <ResponsiveFormField>
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("flex");
    expect(field).toHaveClass("flex-col");
    expect(field).toHaveClass("gap-2");
    expect(field).toHaveClass("w-full");
    expect(field).toHaveClass("lg:w-auto");
  });

  it("applies fullWidth prop correctly", () => {
    const { container } = render(
      <ResponsiveFormField fullWidth>
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("w-full");
    expect(field).not.toHaveClass("lg:w-auto");
  });

  it("applies alwaysStack prop correctly", () => {
    const { container } = render(
      <ResponsiveFormField alwaysStack>
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("flex-col");
  });

  it("applies spanFull prop correctly", () => {
    const { container } = render(
      <ResponsiveFormField spanFull>
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("lg:col-span-2");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ResponsiveFormField className="custom-class">
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("custom-class");
  });

  it("maintains responsive classes with custom className", () => {
    const { container } = render(
      <ResponsiveFormField className="bg-gray-100" fullWidth>
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("flex");
    expect(field).toHaveClass("flex-col");
    expect(field).toHaveClass("w-full");
    expect(field).toHaveClass("bg-gray-100");
  });

  it("renders with label and input in vertical stack", () => {
    const { container } = render(
      <ResponsiveFormField>
        <label>Username</label>
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("flex-col");
    expect(field.children).toHaveLength(2);
  });

  it("renders with multiple children", () => {
    render(
      <ResponsiveFormField>
        <label data-testid="label">Password</label>
        <input data-testid="input" type="password" />
        <span data-testid="helper">Must be at least 8 characters</span>
      </ResponsiveFormField>,
    );

    expect(screen.getByTestId("label")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByTestId("helper")).toBeInTheDocument();
  });

  it("renders empty field when no children provided", () => {
    const { container } = render(
      <ResponsiveFormField>{null}</ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toBeInTheDocument();
    expect(field.children).toHaveLength(0);
  });

  it("combines multiple props correctly", () => {
    const { container } = render(
      <ResponsiveFormField
        fullWidth
        alwaysStack
        spanFull
        className="custom-class"
      >
        <input type="text" />
      </ResponsiveFormField>,
    );

    const field = container.firstChild as HTMLElement;
    expect(field).toHaveClass("flex");
    expect(field).toHaveClass("flex-col");
    expect(field).toHaveClass("w-full");
    expect(field).toHaveClass("lg:col-span-2");
    expect(field).toHaveClass("custom-class");
  });
});

describe("ResponsiveFormRow", () => {
  it("renders children correctly", () => {
    render(
      <ResponsiveFormRow>
        <div data-testid="field-1">Field 1</div>
        <div data-testid="field-2">Field 2</div>
      </ResponsiveFormRow>,
    );

    expect(screen.getByTestId("field-1")).toBeInTheDocument();
    expect(screen.getByTestId("field-2")).toBeInTheDocument();
  });

  it("applies default 2-column layout classes", () => {
    const { container } = render(
      <ResponsiveFormRow>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("grid");
    expect(row).toHaveClass("grid-cols-1");
    expect(row).toHaveClass("lg:grid-cols-2");
  });

  it("applies 3-column layout when columns prop is 3", () => {
    const { container } = render(
      <ResponsiveFormRow columns={3}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("lg:grid-cols-3");
  });

  it("applies 4-column layout when columns prop is 4", () => {
    const { container } = render(
      <ResponsiveFormRow columns={4}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("lg:grid-cols-4");
  });

  it("applies default gap-4 spacing", () => {
    const { container } = render(
      <ResponsiveFormRow>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("gap-4");
  });

  it("applies custom gap spacing when provided", () => {
    const { container } = render(
      <ResponsiveFormRow gap={6}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("gap-6");
  });

  it("applies gap-2 spacing", () => {
    const { container } = render(
      <ResponsiveFormRow gap={2}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("gap-2");
  });

  it("applies gap-3 spacing", () => {
    const { container } = render(
      <ResponsiveFormRow gap={3}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("gap-3");
  });

  it("applies gap-8 spacing", () => {
    const { container } = render(
      <ResponsiveFormRow gap={8}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("gap-8");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ResponsiveFormRow className="custom-class">
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("custom-class");
  });

  it("renders multiple fields in grid layout", () => {
    render(
      <ResponsiveFormRow>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} data-testid={`field-${num}`}>
            Field {num}
          </div>
        ))}
      </ResponsiveFormRow>,
    );

    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`field-${i}`)).toBeInTheDocument();
    }
  });

  it("maintains responsive classes with custom className", () => {
    const { container } = render(
      <ResponsiveFormRow className="bg-gray-100" columns={3} gap={6}>
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("grid");
    expect(row).toHaveClass("grid-cols-1");
    expect(row).toHaveClass("lg:grid-cols-3");
    expect(row).toHaveClass("gap-6");
    expect(row).toHaveClass("bg-gray-100");
  });

  it("renders empty row when no children provided", () => {
    const { container } = render(<ResponsiveFormRow>{null}</ResponsiveFormRow>);

    const row = container.firstChild as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(row.children).toHaveLength(0);
  });

  it("combines multiple props correctly", () => {
    const { container } = render(
      <ResponsiveFormRow columns={4} gap={8} className="custom-class">
        <div>Field</div>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    expect(row).toHaveClass("grid");
    expect(row).toHaveClass("grid-cols-1");
    expect(row).toHaveClass("lg:grid-cols-4");
    expect(row).toHaveClass("gap-8");
    expect(row).toHaveClass("custom-class");
  });
});

describe("ResponsiveFormField and ResponsiveFormRow integration", () => {
  it("works together in a multi-column form layout", () => {
    render(
      <ResponsiveFormRow columns={2}>
        <ResponsiveFormField>
          <label data-testid="label-1">First Name</label>
          <input data-testid="input-1" type="text" />
        </ResponsiveFormField>
        <ResponsiveFormField>
          <label data-testid="label-2">Last Name</label>
          <input data-testid="input-2" type="text" />
        </ResponsiveFormField>
      </ResponsiveFormRow>,
    );

    expect(screen.getByTestId("label-1")).toBeInTheDocument();
    expect(screen.getByTestId("input-1")).toBeInTheDocument();
    expect(screen.getByTestId("label-2")).toBeInTheDocument();
    expect(screen.getByTestId("input-2")).toBeInTheDocument();
  });

  it("supports spanFull field in multi-column layout", () => {
    const { container } = render(
      <ResponsiveFormRow columns={2}>
        <ResponsiveFormField>
          <label>First Name</label>
          <input type="text" />
        </ResponsiveFormField>
        <ResponsiveFormField>
          <label>Last Name</label>
          <input type="text" />
        </ResponsiveFormField>
        <ResponsiveFormField spanFull>
          <label>Bio</label>
          <textarea />
        </ResponsiveFormField>
      </ResponsiveFormRow>,
    );

    const row = container.firstChild as HTMLElement;
    const spanFullField = row.children[2] as HTMLElement;
    expect(spanFullField).toHaveClass("lg:col-span-2");
  });
});
