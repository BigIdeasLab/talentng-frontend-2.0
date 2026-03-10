import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HideOnTablet } from "./HideOnTablet";

describe("HideOnTablet", () => {
  it("renders children with correct visibility classes", () => {
    const { container } = render(
      <HideOnTablet>
        <div data-testid="content">Test content</div>
      </HideOnTablet>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("block", "md:hidden", "lg:block");
  });

  it("applies custom className", () => {
    const { container } = render(
      <HideOnTablet className="custom-class">
        <div>Test content</div>
      </HideOnTablet>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      "block",
      "md:hidden",
      "lg:block",
      "custom-class",
    );
  });

  it("renders children content", () => {
    const { getByTestId } = render(
      <HideOnTablet>
        <div data-testid="content">Test content</div>
      </HideOnTablet>,
    );

    expect(getByTestId("content")).toBeInTheDocument();
    expect(getByTestId("content")).toHaveTextContent("Test content");
  });
});
