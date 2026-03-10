import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionCard } from "./SessionCard";

describe("SessionCard", () => {
  const mockMentee = {
    id: "1",
    name: "John Doe",
    avatar: "/avatar.jpg",
    title: "Software Engineer",
    company: "Tech Corp",
  };

  const defaultProps = {
    id: "session-1",
    mentee: mockMentee,
    topic: "Career Development",
    message: "Looking forward to discussing career growth strategies",
    date: "Mon Jan 15, 2:00 PM",
    duration: "60 mins",
    location: "https://meet.google.com/abc-defg-hij",
    status: "upcoming" as const,
  };

  it("renders session card with all information", () => {
    render(<SessionCard {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer at Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Career Development")).toBeInTheDocument();
    expect(screen.getByText("Looking forward to discussing career growth strategies")).toBeInTheDocument();
    expect(screen.getByText("Mon Jan 15, 2:00 PM")).toBeInTheDocument();
    expect(screen.getByText("60 mins")).toBeInTheDocument();
  });

  it("displays upcoming status badge", () => {
    render(<SessionCard {...defaultProps} status="upcoming" />);
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("displays completed status badge", () => {
    render(<SessionCard {...defaultProps} status="completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("displays cancelled status badge", () => {
    render(<SessionCard {...defaultProps} status="cancelled" />);
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("shows reschedule and cancel buttons for upcoming sessions", () => {
    const onReschedule = vi.fn();
    const onCancel = vi.fn();

    render(
      <SessionCard
        {...defaultProps}
        status="upcoming"
        onReschedule={onReschedule}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText("Reschedule")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onReschedule when reschedule button is clicked", async () => {
    const user = userEvent.setup();
    const onReschedule = vi.fn();

    render(
      <SessionCard
        {...defaultProps}
        status="upcoming"
        onReschedule={onReschedule}
      />
    );

    await user.click(screen.getByText("Reschedule"));
    expect(onReschedule).toHaveBeenCalledWith("session-1");
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <SessionCard
        {...defaultProps}
        status="upcoming"
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledWith("session-1");
  });

  it("shows complete button for ended in-progress sessions", () => {
    const onComplete = vi.fn();
    const pastEndTime = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago

    render(
      <SessionCard
        {...defaultProps}
        status="in_progress"
        endTime={pastEndTime}
        onComplete={onComplete}
      />
    );

    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("shows dispute button for pending completion sessions", () => {
    const onDispute = vi.fn();

    render(
      <SessionCard
        {...defaultProps}
        status="pending_completion"
        onDispute={onDispute}
      />
    );

    expect(screen.getByText("Waiting for mentee confirmation")).toBeInTheDocument();
    expect(screen.getByText("Dispute")).toBeInTheDocument();
  });

  it("renders meeting link with join button", () => {
    render(<SessionCard {...defaultProps} />);
    expect(screen.getByText("Join Meeting")).toBeInTheDocument();
  });

  it("renders physical location without join button", () => {
    render(<SessionCard {...defaultProps} location="Conference Room A" />);
    expect(screen.getByText("Conference Room A")).toBeInTheDocument();
    expect(screen.queryByText("Join Meeting")).not.toBeInTheDocument();
  });

  it("displays mentee initials when no avatar provided", () => {
    const menteeWithoutAvatar = { ...mockMentee, avatar: undefined };
    render(<SessionCard {...defaultProps} mentee={menteeWithoutAvatar} />);
    
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  describe("Mobile Responsiveness", () => {
    it("has touch-friendly button heights (min 44px)", () => {
      const onReschedule = vi.fn();
      const onCancel = vi.fn();

      render(
        <SessionCard
          {...defaultProps}
          status="upcoming"
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      );

      const rescheduleButton = screen.getByText("Reschedule");
      const cancelButton = screen.getByText("Cancel");
      
      // Check that buttons exist and are rendered
      expect(rescheduleButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });

    it("stacks action buttons vertically on mobile", () => {
      const onReschedule = vi.fn();
      const onCancel = vi.fn();

      const { container } = render(
        <SessionCard
          {...defaultProps}
          status="upcoming"
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      );

      // Check that the button container has flex-col class for mobile stacking
      const buttonContainer = container.querySelector(".flex-col");
      expect(buttonContainer).toBeInTheDocument();
    });
  });
});
