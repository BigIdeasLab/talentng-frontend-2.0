import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ShowOnMobile } from "./ShowOnMobile";

describe("ShowOnMobile", () => {
  it("renders children with correct visibility classes", () => {
    const { container } = render(
      <ShowOnMobile>
        <div data-testid="content">Test content</div>
      </ShowOnMobile>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("block", "md:hidden");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ShowOnMobile className="custom-class">
        <div>Test content</div>
      </ShowOnMobile>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("block", "md:hidden", "custom-class");
  });

  it("renders children content", () => {
    const { getByTestId } = render(
      <ShowOnMobile>
        <div data-testid="content">Test content</div>
      </ShowOnMobile>,
    );

    expect(getByTestId("content")).toBeInTheDocument();
    expect(getByTestId("content")).toHaveTextContent("Test content");
  });
});
