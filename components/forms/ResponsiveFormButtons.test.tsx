import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResponsiveFormButtons } from "./ResponsiveFormButtons";

// Mock Button component for testing
const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={className} {...props}>
    {children}
  </button>
);

describe("ResponsiveFormButtons", () => {
  it("renders children correctly", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="cancel-btn">Cancel</Button>
        <Button data-testid="submit-btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    expect(screen.getByTestId("cancel-btn")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("applies default responsive classes", () => {
    const { container } = render(
      <ResponsiveFormButtons>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("flex");
    expect(buttonGroup).toHaveClass("flex-col");
    expect(buttonGroup).toHaveClass("md:flex-row");
    expect(buttonGroup).toHaveClass("w-full");
  });

  it("applies default gap-2 spacing", () => {
    const { container } = render(
      <ResponsiveFormButtons>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("gap-2");
  });

  it("applies custom gap spacing when provided", () => {
    const { container } = render(
      <ResponsiveFormButtons gap={4}>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("gap-4");
  });

  it("applies gap-3 spacing", () => {
    const { container } = render(
      <ResponsiveFormButtons gap={3}>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("gap-3");
  });

  it("applies gap-6 spacing", () => {
    const { container } = render(
      <ResponsiveFormButtons gap={6}>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("gap-6");
  });

  it("applies default end alignment", () => {
    const { container } = render(
      <ResponsiveFormButtons>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("md:justify-end");
  });

  it("applies start alignment when specified", () => {
    const { container } = render(
      <ResponsiveFormButtons align="start">
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("md:justify-start");
  });

  it("applies center alignment when specified", () => {
    const { container } = render(
      <ResponsiveFormButtons align="center">
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("md:justify-center");
  });

  it("applies between alignment when specified", () => {
    const { container } = render(
      <ResponsiveFormButtons align="between">
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("md:justify-between");
  });

  it("applies reverseOnMobile class when specified", () => {
    const { container } = render(
      <ResponsiveFormButtons reverseOnMobile>
        <Button>Cancel</Button>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("flex-col-reverse");
    expect(buttonGroup).toHaveClass("md:flex-row");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ResponsiveFormButtons className="custom-class">
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("custom-class");
  });

  it("maintains responsive classes with custom className", () => {
    const { container } = render(
      <ResponsiveFormButtons className="mt-4" align="start" gap={4}>
        <Button>Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("flex");
    expect(buttonGroup).toHaveClass("flex-col");
    expect(buttonGroup).toHaveClass("md:flex-row");
    expect(buttonGroup).toHaveClass("gap-4");
    expect(buttonGroup).toHaveClass("md:justify-start");
    expect(buttonGroup).toHaveClass("mt-4");
  });

  it("adds responsive width classes to button children", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("md:w-auto");
  });

  it("adds full width classes when fullWidth is true", () => {
    render(
      <ResponsiveFormButtons fullWidth>
        <Button data-testid="btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("w-full");
    expect(button).not.toHaveClass("md:w-auto");
  });

  it("applies default responsive width when fullWidth is false", () => {
    render(
      <ResponsiveFormButtons fullWidth={false}>
        <Button data-testid="btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("md:w-auto");
  });

  it("adds minimum height class to button children", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("min-h-[44px]");
  });

  it("preserves existing button classes when adding responsive classes", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn" className="bg-blue-500 text-white">
          Submit
        </Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("bg-blue-500");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("md:w-auto");
    expect(button).toHaveClass("min-h-[44px]");
  });

  it("renders multiple buttons with responsive classes", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="cancel-btn">Cancel</Button>
        <Button data-testid="save-btn">Save</Button>
        <Button data-testid="submit-btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const cancelBtn = screen.getByTestId("cancel-btn");
    const saveBtn = screen.getByTestId("save-btn");
    const submitBtn = screen.getByTestId("submit-btn");

    [cancelBtn, saveBtn, submitBtn].forEach((btn) => {
      expect(btn).toHaveClass("w-full");
      expect(btn).toHaveClass("md:w-auto");
      expect(btn).toHaveClass("min-h-[44px]");
    });
  });

  it("renders empty container when no children provided", () => {
    const { container } = render(
      <ResponsiveFormButtons>{null}</ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup.children).toHaveLength(0);
  });

  it("handles non-element children gracefully", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn">Submit</Button>
        {null}
        {undefined}
        {false}
      </ResponsiveFormButtons>,
    );

    expect(screen.getByTestId("btn")).toBeInTheDocument();
  });

  it("combines multiple props correctly", () => {
    const { container } = render(
      <ResponsiveFormButtons
        align="center"
        gap={6}
        reverseOnMobile
        className="custom-class"
      >
        <Button data-testid="btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = container.firstChild as HTMLElement;
    expect(buttonGroup).toHaveClass("flex");
    expect(buttonGroup).toHaveClass("flex-col-reverse");
    expect(buttonGroup).toHaveClass("md:flex-row");
    expect(buttonGroup).toHaveClass("gap-6");
    expect(buttonGroup).toHaveClass("md:justify-center");
    expect(buttonGroup).toHaveClass("custom-class");

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("md:w-auto");
    expect(button).toHaveClass("min-h-[44px]");
  });

  it("works with different button types", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="outline-btn" className="variant-outline">
          Cancel
        </Button>
        <Button data-testid="primary-btn" className="variant-primary">
          Submit
        </Button>
      </ResponsiveFormButtons>,
    );

    const outlineBtn = screen.getByTestId("outline-btn");
    const primaryBtn = screen.getByTestId("primary-btn");

    expect(outlineBtn).toHaveClass("variant-outline");
    expect(outlineBtn).toHaveClass("w-full");
    expect(outlineBtn).toHaveClass("md:w-auto");

    expect(primaryBtn).toHaveClass("variant-primary");
    expect(primaryBtn).toHaveClass("w-full");
    expect(primaryBtn).toHaveClass("md:w-auto");
  });

  it("maintains button order without reverseOnMobile", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="first">First</Button>
        <Button data-testid="second">Second</Button>
        <Button data-testid="third">Third</Button>
      </ResponsiveFormButtons>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("First");
    expect(buttons[1]).toHaveTextContent("Second");
    expect(buttons[2]).toHaveTextContent("Third");
  });

  it("applies responsive classes to buttons with various props", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn" type="submit" disabled>
          Submit
        </Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("md:w-auto");
    expect(button).toHaveClass("min-h-[44px]");
  });
});

describe("ResponsiveFormButtons accessibility", () => {
  it("maintains button accessibility attributes", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn" aria-label="Submit form">
          Submit
        </Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveAttribute("aria-label", "Submit form");
  });

  it("ensures minimum touch target height of 44px", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="btn">Submit</Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("min-h-[44px]");
  });
});

describe("ResponsiveFormButtons layout patterns", () => {
  it("supports cancel and submit button pattern", () => {
    render(
      <ResponsiveFormButtons>
        <Button data-testid="cancel" className="variant-outline">
          Cancel
        </Button>
        <Button data-testid="submit" type="submit">
          Submit
        </Button>
      </ResponsiveFormButtons>,
    );

    expect(screen.getByTestId("cancel")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeInTheDocument();
  });

  it("supports back and next button pattern", () => {
    render(
      <ResponsiveFormButtons align="between">
        <Button data-testid="back">Back</Button>
        <Button data-testid="next">Next</Button>
      </ResponsiveFormButtons>,
    );

    const buttonGroup = screen.getByTestId("back").parentElement;
    expect(buttonGroup).toHaveClass("md:justify-between");
  });

  it("supports multi-step form button pattern", () => {
    render(
      <ResponsiveFormButtons align="between">
        <Button data-testid="back">Back</Button>
        <div className="flex gap-2">
          <Button data-testid="save">Save Draft</Button>
          <Button data-testid="next">Next</Button>
        </div>
      </ResponsiveFormButtons>,
    );

    expect(screen.getByTestId("back")).toBeInTheDocument();
    expect(screen.getByTestId("save")).toBeInTheDocument();
    expect(screen.getByTestId("next")).toBeInTheDocument();
  });

  it("supports single full-width button pattern", () => {
    render(
      <ResponsiveFormButtons fullWidth>
        <Button data-testid="continue">Continue</Button>
      </ResponsiveFormButtons>,
    );

    const button = screen.getByTestId("continue");
    expect(button).toHaveClass("w-full");
    expect(button).not.toHaveClass("md:w-auto");
  });
});
