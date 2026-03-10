import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HideOnMobile } from "./HideOnMobile";

describe("HideOnMobile", () => {
  it("renders children with correct visibility classes", () => {
    const { container } = render(
      <HideOnMobile>
        <div data-testid="content">Test content</div>
      </HideOnMobile>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("hidden", "md:block");
  });

  it("applies custom className", () => {
    const { container } = render(
      <HideOnMobile className="custom-class">
        <div>Test content</div>
      </HideOnMobile>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("hidden", "md:block", "custom-class");
  });

  it("renders children content", () => {
    const { getByTestId } = render(
      <HideOnMobile>
        <div data-testid="content">Test content</div>
      </HideOnMobile>,
    );

    expect(getByTestId("content")).toBeInTheDocument();
    expect(getByTestId("content")).toHaveTextContent("Test content");
  });
});
