export function MentorSessionSection() {
  return (
    <div className="flex flex-col w-full gap-3">
      {/* Add Session Button */}
      <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#5C30FF] bg-[#5C30FF] self-start">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99998 3.3335V16.6668M16.6666 10.0002H3.33331"
            stroke="white"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-white text-center font-inter-tight text-[13px] font-normal leading-normal">
          Add Session
        </span>
      </button>

      {/* Sessions List */}
      <div className="flex flex-col gap-3">
        {/* Session Card 1 */}
        <SessionCard
          title="Becoming The Top Of Your Game"
          description="A Data Scientist at Microsoft, specializing in machine learning and data visualization. With over 8 years of experience."
          date="Thu, 11:00 AM"
          duration="50 mins"
          location="Google Meet"
          attendee={{
            name: "Akanbi David",
            role: "Mentee",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
          }}
        />

        {/* Session Card 2 */}
        <SessionCard
          title="Mastering the Art of Communication"
          description="A seasoned AI researcher at Google, specializing in natural language processing and deep learning."
          date="Fri, 2:00 PM"
          duration="1 hr 15 mins"
          location="Zoom"
          attendees={[
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
          ]}
          extraAttendeesCount={13}
        />

        {/* Session Card 3 */}
        <SessionCard
          title="Unlocking Your Leadership Potential"
          description="A lead AI scientist at DeepMind, specializing in neural networks and cognitive computing."
          date="Wed, 3:30 PM"
          duration="1 hr 30 mins"
          location="Google Meet"
          attendees={[
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop",
          ]}
          extraAttendeesCount={13}
        />
      </div>
    </div>
  );
}

interface SessionCardProps {
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  attendee?: {
    name: string;
    role: string;
    image: string;
  };
  attendees?: string[];
  extraAttendeesCount?: number;
}

function SessionCard({
  title,
  description,
  date,
  duration,
  location,
  attendee,
  attendees,
  extraAttendeesCount,
}: SessionCardProps) {
  return (
    <div className="flex flex-col gap-3 p-2.5 lg:p-3 rounded-lg border border-[#E1E4EA] bg-white">
      <div className="flex flex-col gap-3.5">
        <div className="flex items-start gap-3">
          <div className="w-1 min-h-full rounded-full bg-[#5C30FF] flex-shrink-0"></div>
          <div className="flex flex-col gap-3 flex-1">
            <h3 className="text-black font-inter-tight text-[15px] lg:text-[16px] font-semibold leading-normal">
              {title}
            </h3>
            <p className="text-[#525866] font-inter-tight text-[11px] lg:text-[12px] font-light leading-normal">
              {description}
            </p>

            <div className="flex flex-col gap-2">
              {/* Date */}
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6663 1.83398V5.50065M7.33301 1.83398V5.50065"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9167 3.66602H10.0833C6.62636 3.66602 4.89789 3.66602 3.82394 4.73995C2.75 5.8139 2.75 7.54238 2.75 10.9993V12.8327C2.75 16.2896 2.75 18.0182 3.82394 19.092C4.89789 20.166 6.62636 20.166 10.0833 20.166H11.9167C15.3736 20.166 17.1022 20.166 18.176 19.092C19.25 18.0182 19.25 16.2896 19.25 12.8327V10.9993C19.25 7.54238 19.25 5.8139 18.176 4.73995C17.1022 3.66602 15.3736 3.66602 11.9167 3.66602Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.75 9.16602H19.25"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.9955 12.834H11.0038M10.9955 16.5007H11.0038M14.6581 12.834H14.6663M7.33301 12.834H7.34123M7.33301 16.5007H7.34123"
                    stroke="#525866"
                    strokeWidth="1.83333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-black font-inter-tight text-[13px] font-normal leading-normal">
                  Date: {date}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.67733 2.75C7.48125 2.82327 7.28841 2.90319 7.09908 2.98949M18.9908 14.9427C19.0845 14.7399 19.1708 14.533 19.2496 14.3225M16.9568 17.751C17.1142 17.604 17.2664 17.4516 17.4128 17.2938M13.9961 19.5913C14.174 19.5242 14.3492 19.4517 14.5215 19.3738M11.1426 20.1611C10.9309 20.1684 10.7178 20.1684 10.506 20.1611M7.13794 19.3787C7.30367 19.4532 7.47208 19.523 7.64297 19.5876M4.28274 17.3441C4.40804 17.4769 4.53734 17.6059 4.67045 17.7309M2.41288 14.3591C2.48152 14.5404 2.55585 14.7188 2.63565 14.8943M1.83746 11.4632C1.83151 11.2724 1.83153 11.0805 1.83746 10.8895M2.40624 8.00905C2.47367 7.82985 2.54666 7.65337 2.625 7.47982M4.26759 5.02263C4.4002 4.88138 4.5373 4.74442 4.6787 4.61197"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.375 11C12.375 11.7594 11.7594 12.375 11 12.375C10.2406 12.375 9.625 11.7594 9.625 11C9.625 10.2406 10.2406 9.625 11 9.625M12.375 11C12.375 10.2406 11.7594 9.625 11 9.625M12.375 11H14.6667M11 9.625V5.5"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20.1667 11.0006C20.1667 5.93804 16.0626 1.83398 11 1.83398"
                    stroke="#525866"
                    strokeWidth="1.375"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-black font-inter-tight text-[13px] font-normal leading-normal">
                  Duration: {duration}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.2087 10.0833C14.2087 11.8552 12.7722 13.2917 11.0003 13.2917C9.22841 13.2917 7.79199 11.8552 7.79199 10.0833C7.79199 8.31142 9.22841 6.875 11.0003 6.875C12.7722 6.875 14.2087 8.31142 14.2087 10.0833Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                  />
                  <path
                    d="M11 1.83398C15.4647 1.83398 19.25 5.53088 19.25 10.016C19.25 14.5724 15.403 17.77 11.8498 19.9443C11.5908 20.0905 11.2979 20.1673 11 20.1673C10.7021 20.1673 10.4092 20.0905 10.1503 19.9443C6.60357 17.7488 2.75 14.5882 2.75 10.016C2.75 5.53088 6.53532 1.83398 11 1.83398Z"
                    stroke="#525866"
                    strokeWidth="1.375"
                  />
                </svg>
                <span className="text-black font-inter-tight text-[13px] font-normal leading-normal">
                  Location: {location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E1E4EA]"></div>

        {/* Bottom Section - Attendees & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 lg:gap-0">
          {/* Attendee(s) */}
          {attendee ? (
            <div className="flex items-center gap-2">
              <img
                src={attendee.image}
                alt={attendee.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-black font-inter-tight text-[13px] font-medium leading-normal">
                  {attendee.name}
                </span>
                <span className="text-black/30 font-inter-tight text-[12px] font-light leading-normal">
                  {attendee.role}
                </span>
              </div>
            </div>
          ) : attendees ? (
            <div className="flex items-center -space-x-1.5">
              {attendees.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Attendee"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white flex-shrink-0"
                />
              ))}
              {extraAttendeesCount && (
                <div className="w-8 h-8 rounded-full bg-[#F5F5F5] border-2 border-white flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-inter-tight text-[11px] font-normal">
                    +{extraAttendeesCount}
                  </span>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded-full bg-[#5C30FF]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2087 16.5C14.2087 18.2719 12.7722 19.7083 11.0003 19.7083C9.22841 19.7083 7.79199 18.2719 7.79199 16.5"
                  stroke="white"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.6285 16.4993H4.37146C3.47595 16.4993 2.75 15.7733 2.75 14.8779C2.75 14.4478 2.92083 14.0354 3.22492 13.7313L3.77788 13.1784C4.2936 12.6626 4.58333 11.9631 4.58333 11.2338V8.70768C4.58333 5.16386 7.45618 2.29102 11 2.29102C14.5438 2.29102 17.4167 5.16385 17.4167 8.70768V11.2338C17.4167 11.9631 17.7064 12.6626 18.2221 13.1784L18.7751 13.7313C19.0791 14.0354 19.25 14.4478 19.25 14.8779C19.25 15.7733 18.524 16.4993 17.6285 16.4993Z"
                  stroke="white"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-white font-inter-tight text-[12px] font-normal leading-normal">
                Remind Me
              </span>
            </button>
            <button className="flex px-3 py-2.5 justify-center items-center gap-1.5 rounded-full bg-[#F5F5F5]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.6777 2.75C7.48162 2.82327 7.28878 2.90319 7.09945 2.98949M18.9912 14.9427C19.0848 14.7399 19.1712 14.533 19.2499 14.3225M16.9572 17.751C17.1146 17.604 17.2667 17.4516 17.4132 17.2938M13.9964 19.5913C14.1744 19.5242 14.3495 19.4517 14.5219 19.3738M11.1429 20.1611C10.9313 20.1684 10.7182 20.1684 10.5064 20.1611M7.13831 19.3787C7.30404 19.4532 7.47245 19.523 7.64334 19.5876M4.28311 17.3441C4.40841 17.4769 4.53771 17.6059 4.67081 17.7309M2.41325 14.3591C2.48189 14.5404 2.55622 14.7188 2.63602 14.8943M1.83783 11.4632C1.83188 11.2724 1.8319 11.0805 1.83783 10.8895M2.4066 8.00904C2.47403 7.82985 2.54703 7.65337 2.62536 7.47982M4.26796 5.02263C4.40056 4.88138 4.53767 4.74442 4.67906 4.61197"
                  stroke="#525866"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.375 11C12.375 11.7594 11.7594 12.375 11 12.375C10.2406 12.375 9.625 11.7594 9.625 11C9.625 10.2406 10.2406 9.625 11 9.625M12.375 11C12.375 10.2406 11.7594 9.625 11 9.625M12.375 11H14.6667M11 9.625V5.5"
                  stroke="#525866"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                />
                <path
                  d="M20.1667 11.0002C20.1667 5.93755 16.0626 1.8335 11 1.8335"
                  stroke="#525866"
                  strokeWidth="1.375"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[#525866] font-inter-tight text-[12px] font-normal leading-normal">
                Reschedule
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
