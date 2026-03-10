import { SessionCard } from "./SessionCard";

export default function SessionCardExample() {
  const mockMentee = {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    title: "Product Designer",
    company: "Design Studio",
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Session Card - Responsive Examples</h2>
          <p className="text-gray-600 mb-6">
            Resize your browser to see how the session cards adapt to different screen sizes.
            On mobile (&lt;768px), action buttons stack vertically with full width and 44px minimum height.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Upcoming Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                id="1"
                mentee={mockMentee}
                topic="Portfolio Review & Career Guidance"
                message="I'd love to get feedback on my portfolio and discuss career transition strategies."
                date="Mon Jan 15, 2:00 PM"
                duration="60 mins"
                location="https://meet.google.com/abc-defg-hij"
                status="upcoming"
                onReschedule={(id) => console.log("Reschedule:", id)}
                onCancel={(id) => console.log("Cancel:", id)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">In Progress Session (Ended)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                id="2"
                mentee={{
                  id: "2",
                  name: "Michael Chen",
                  title: "Frontend Developer",
                }}
                topic="React Best Practices"
                date="Today, 10:00 AM"
                duration="45 mins"
                location="https://zoom.us/j/123456789"
                endTime={new Date(Date.now() - 3600000).toISOString()}
                status="in_progress"
                onComplete={(id) => console.log("Complete:", id)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Pending Completion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                id="3"
                mentee={{
                  id: "3",
                  name: "Emily Rodriguez",
                  avatar: "/avatars/emily.jpg",
                  title: "UX Researcher",
                  company: "Research Lab",
                }}
                topic="User Research Methodologies"
                message="Looking forward to learning about advanced research techniques."
                date="Yesterday, 3:00 PM"
                duration="60 mins"
                location="Conference Room B"
                status="pending_completion"
                onDispute={(id) => console.log("Dispute:", id)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Completed Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                id="4"
                mentee={{
                  id: "4",
                  name: "David Kim",
                  title: "Software Engineer",
                }}
                topic="System Design Interview Prep"
                date="Fri Jan 12, 4:00 PM"
                duration="90 mins"
                location="https://meet.google.com/xyz-abcd-efg"
                status="completed"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cancelled Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                id="5"
                mentee={{
                  id: "5",
                  name: "Lisa Anderson",
                  avatar: "/avatars/lisa.jpg",
                  title: "Marketing Manager",
                }}
                topic="Career Transition Discussion"
                date="Wed Jan 10, 1:00 PM"
                duration="60 mins"
                location="https://teams.microsoft.com/l/meetup"
                status="cancelled"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Disputed Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SessionCard
                id="6"
                mentee={{
                  id: "6",
                  name: "James Wilson",
                  title: "Data Scientist",
                }}
                topic="Machine Learning Career Path"
                date="Tue Jan 9, 11:00 AM"
                duration="60 mins"
                location="https://meet.google.com/disputed-session"
                status="disputed"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Mobile Responsiveness Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Action buttons stack vertically on mobile with full width</li>
            <li>Minimum 44px touch target height for all interactive elements</li>
            <li>Session details display as flexible pills that wrap naturally</li>
            <li>Status text centers on mobile for better readability</li>
            <li>Meeting links show copy button for easy sharing on mobile</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
