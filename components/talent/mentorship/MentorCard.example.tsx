import { MentorCard } from "./MentorCard";

export default function MentorCardExample() {
  const mentors = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Senior Product Manager",
      imageUrl: "/mentors/sarah.jpg",
      rating: 4.9,
      totalReviews: 42,
      expertise: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
      company: "Tech Innovations",
      location: "San Francisco, CA",
      category: "Product Management",
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Staff Software Engineer",
      imageUrl: "/mentors/michael.jpg",
      rating: 4.8,
      totalReviews: 35,
      expertise: ["System Design", "React", "Node.js"],
      company: "Cloud Systems Inc",
      location: "Seattle, WA",
      category: "Engineering",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "UX Design Lead",
      imageUrl: "/mentors/emily.jpg",
      rating: 5.0,
      totalReviews: 28,
      expertise: ["User Research", "Design Systems", "Figma"],
      company: "Design Studio",
      location: "New York, NY",
      category: "Design",
    },
    {
      id: "4",
      name: "David Kim",
      title: "Engineering Manager",
      imageUrl: "/mentors/david.jpg",
      rating: 4.7,
      totalReviews: 31,
      expertise: ["Leadership", "Team Building", "Career Growth"],
      company: "Startup Labs",
      location: "Austin, TX",
      category: "Leadership",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Mentor Card - Responsive Grid
          </h2>
          <p className="text-gray-600 mb-6">
            Resize your browser to see how the mentor cards adapt to different
            screen sizes:
            <br />
            • Mobile (&lt;640px): 1 column
            <br />
            • Tablet (640px-1024px): 2 columns
            <br />
            • Desktop (1024px-1280px): 3 columns
            <br />• Large Desktop (&gt;1280px): 4 columns
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} {...mentor} />
          ))}
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Mentor Without Rating
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <MentorCard
                id="5"
                name="Alex Thompson"
                title="Data Science Lead"
                imageUrl="/mentors/alex.jpg"
                rating={0}
                totalReviews={0}
                expertise={["Machine Learning", "Python", "Data Analysis"]}
                company="Analytics Corp"
                location="Boston, MA"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Mentor Without Company/Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <MentorCard
                id="6"
                name="Jordan Lee"
                title="Freelance Designer"
                imageUrl="/mentors/jordan.jpg"
                rating={4.6}
                totalReviews={18}
                expertise={["UI Design", "Branding", "Illustration"]}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Mentor With Many Expertise Areas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <MentorCard
                id="7"
                name="Taylor Martinez"
                title="Full Stack Developer"
                imageUrl="/mentors/taylor.jpg"
                rating={4.9}
                totalReviews={52}
                expertise={[
                  "React",
                  "Node.js",
                  "TypeScript",
                  "GraphQL",
                  "AWS",
                  "Docker",
                ]}
                company="Tech Solutions"
                location="Remote"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">
            Mobile Responsiveness Features:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>
              Responsive grid adapts from 1 to 4 columns based on screen size
            </li>
            <li>Touch-friendly buttons with minimum 44px height and width</li>
            <li>
              Responsive image sizing with proper srcset for optimal loading
            </li>
            <li>
              Expertise tags wrap naturally and show "+N" for additional skills
            </li>
            <li>Card hover effects work on both mouse and touch devices</li>
            <li>
              All text truncates properly to prevent overflow on small screens
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
