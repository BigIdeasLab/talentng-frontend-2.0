import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResponsiveGrid } from "./ResponsiveGrid";

describe("ResponsiveGrid", () => {
  it("renders children correctly", () => {
    render(
      <ResponsiveGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ResponsiveGrid>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("applies default 3-column layout classes", () => {
    const { container } = render(
      <ResponsiveGrid>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-3");
  });

  it("applies 4-column layout when columns prop is 4", () => {
    const { container } = render(
      <ResponsiveGrid columns={4}>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("lg:grid-cols-4");
  });

  it("applies default gap-4 spacing", () => {
    const { container } = render(
      <ResponsiveGrid>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("gap-4");
  });

  it("applies custom gap spacing when provided", () => {
    const { container } = render(
      <ResponsiveGrid gap={6}>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("gap-6");
  });

  it("applies gap-2 spacing", () => {
    const { container } = render(
      <ResponsiveGrid gap={2}>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("gap-2");
  });

  it("applies gap-3 spacing", () => {
    const { container } = render(
      <ResponsiveGrid gap={3}>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("gap-3");
  });

  it("applies gap-8 spacing", () => {
    const { container } = render(
      <ResponsiveGrid gap={8}>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("gap-8");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ResponsiveGrid className="custom-class">
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("custom-class");
  });

  it("renders multiple children in grid layout", () => {
    render(
      <ResponsiveGrid>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} data-testid={`item-${num}`}>
            Item {num}
          </div>
        ))}
      </ResponsiveGrid>
    );

    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`item-${i}`)).toBeInTheDocument();
    }
  });

  it("maintains responsive classes with custom className", () => {
    const { container } = render(
      <ResponsiveGrid className="bg-gray-100" columns={4} gap={6}>
        <div>Child</div>
      </ResponsiveGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-4");
    expect(grid).toHaveClass("gap-6");
    expect(grid).toHaveClass("bg-gray-100");
  });

  it("renders empty grid when no children provided", () => {
    const { container } = render(<ResponsiveGrid>{null}</ResponsiveGrid>);

    const grid = container.firstChild as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid.children).toHaveLength(0);
  });

  it("renders with React fragments as children", () => {
    render(
      <ResponsiveGrid>
        <>
          <div data-testid="fragment-child-1">Child 1</div>
          <div data-testid="fragment-child-2">Child 2</div>
        </>
      </ResponsiveGrid>
    );

    expect(screen.getByTestId("fragment-child-1")).toBeInTheDocument();
    expect(screen.getByTestId("fragment-child-2")).toBeInTheDocument();
  });
});
