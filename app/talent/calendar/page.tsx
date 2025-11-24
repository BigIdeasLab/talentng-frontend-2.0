"use client";

export default function CalendarPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* My Schedule Section */}
      <h2 className="text-xl font-bold text-black font-geist mb-8">
        My Schedule
      </h2>

      {/* Appointment Card */}
      <div className="w-full max-w-[461px] p-6 rounded-[32px] border border-gray-200 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="flex flex-wrap gap-3 p-6">
            {Array.from({ length: 27 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/585122567c01b40a4c45c259801ea50ecc3435b9?width=48"
                  alt=""
                  className="w-6 h-[18px]"
                />
                {(i + 1) % 9 !== 0 && <div className="w-px h-4 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* Profile Image */}
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d24e56855e47e75fe627c7b79b23ca484452b9c0?width=128"
            alt="Promise"
            className="w-16 h-16 rounded-full"
          />

          {/* Meeting Details */}
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <g clipPath="url(#clip0_video)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16 7.00049C16.0013 7.71562 15.81 8.4179 15.446 9.03349C16.1564 9.14029 16.805 9.4985 17.2737 10.043C17.7423 10.5875 18.0001 11.2821 18 12.0005V12.2105L19.713 11.1545C19.9402 11.0145 20.2006 10.9376 20.4674 10.9318C20.7343 10.926 20.9978 10.9915 21.2308 11.1215C21.4639 11.2516 21.658 11.4414 21.7933 11.6715C21.9285 11.9016 21.9998 12.1636 22 12.4305V17.5685C22 17.8355 21.9288 18.0976 21.7936 18.3278C21.6585 18.558 21.4644 18.748 21.2313 18.8782C20.9982 19.0083 20.7346 19.0739 20.4677 19.0682C20.2008 19.0624 19.9403 18.9856 19.713 18.8455L18 17.7905V18.0005C18 18.7961 17.6839 19.5592 17.1213 20.1218C16.5587 20.6844 15.7956 21.0005 15 21.0005H5C4.20435 21.0005 3.44129 20.6844 2.87868 20.1218C2.31607 19.5592 2 18.7961 2 18.0005V12.0005C1.99992 11.465 2.14315 10.9393 2.41483 10.4779C2.68651 10.0165 3.07674 9.63619 3.545 9.37649C3.10085 8.67737 2.91903 7.84339 3.03187 7.02284C3.14472 6.20228 3.5449 5.44834 4.16128 4.89506C4.77766 4.34179 5.57028 4.02503 6.39821 4.00112C7.22614 3.97722 8.03572 4.2477 8.683 4.76449C9.16186 4.05397 9.85621 3.51599 10.6638 3.22977C11.4714 2.94356 12.3496 2.92423 13.169 3.17463C13.9884 3.42503 14.7058 3.93194 15.2154 4.6207C15.7251 5.30946 16.0001 6.14367 16 7.00049ZM12 5.00049C11.4696 5.00049 10.9609 5.2112 10.5858 5.58628C10.2107 5.96135 10 6.47006 10 7.00049C10 7.53092 10.2107 8.03963 10.5858 8.4147C10.9609 8.78977 11.4696 9.00049 12 9.00049C12.5304 9.00049 13.0391 8.78977 13.4142 8.4147C13.7893 8.03963 14 7.53092 14 7.00049C14 6.47006 13.7893 5.96135 13.4142 5.58628C13.0391 5.2112 12.5304 5.00049 12 5.00049ZM6.5 9.00049C6.89782 9.00049 7.27936 8.84245 7.56066 8.56115C7.84196 8.27984 8 7.89831 8 7.50049C8 7.10266 7.84196 6.72113 7.56066 6.43983C7.27936 6.15852 6.89782 6.00049 6.5 6.00049C6.10218 6.00049 5.72064 6.15852 5.43934 6.43983C5.15804 6.72113 5 7.10266 5 7.50049C5 7.89831 5.15804 8.27984 5.43934 8.56115C5.72064 8.84245 6.10218 9.00049 6.5 9.00049Z"
                      fill="#667085"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_video">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-xl font-semibold text-black font-geist">
                  Meet with Promise
                </h3>
              </div>
              <p className="text-base text-black font-geist">
                Discuss about your life
              </p>
            </div>

            {/* Time and Date */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                >
                  <g clipPath="url(#clip0_time)">
                    <path
                      d="M7.00033 1.16602C10.2221 1.16602 12.8337 3.7776 12.8337 6.99935C12.8337 10.2211 10.2221 12.8327 7.00033 12.8327C3.77858 12.8327 1.16699 10.2211 1.16699 6.99935C1.16699 3.7776 3.77858 1.16602 7.00033 1.16602ZM7.00033 3.49935C6.84562 3.49935 6.69724 3.56081 6.58785 3.6702C6.47845 3.7796 6.41699 3.92797 6.41699 4.08268V6.99935C6.41703 7.15405 6.47851 7.3024 6.58791 7.41177L8.33791 9.16177C8.44793 9.26802 8.59528 9.32682 8.74823 9.32549C8.90117 9.32416 9.04748 9.26282 9.15564 9.15466C9.26379 9.04651 9.32514 8.9002 9.32647 8.74725C9.3278 8.5943 9.269 8.44695 9.16274 8.33693L7.58366 6.75785V4.08268C7.58366 3.92797 7.5222 3.7796 7.4128 3.6702C7.30341 3.56081 7.15504 3.49935 7.00033 3.49935Z"
                      fill="#09244B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_time">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[13px] text-black font-geist">
                  09:30 PM - 10:00 PM
                </span>
              </div>

              <div className="w-1 h-1 rounded-full bg-black" />

              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                >
                  <g clipPath="url(#clip0_calendar)">
                    <path
                      d="M12.25 7V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V7H12.25ZM9.33333 1.75C9.48804 1.75 9.63642 1.81146 9.74581 1.92085C9.85521 2.03025 9.91667 2.17862 9.91667 2.33333V2.91667H11.0833C11.3928 2.91667 11.6895 3.03958 11.9083 3.25838C12.1271 3.47717 12.25 3.77391 12.25 4.08333V5.83333H1.75V4.08333C1.75 3.77391 1.87292 3.47717 2.09171 3.25838C2.3105 3.03958 2.60725 2.91667 2.91667 2.91667H4.08333V2.33333C4.08333 2.17862 4.14479 2.03025 4.25419 1.92085C4.36358 1.81146 4.51196 1.75 4.66667 1.75C4.82138 1.75 4.96975 1.81146 5.07915 1.92085C5.18854 2.03025 5.25 2.17862 5.25 2.33333V2.91667H8.75V2.33333C8.75 2.17862 8.81146 2.03025 8.92085 1.92085C9.03025 1.81146 9.17862 1.75 9.33333 1.75Z"
                      fill="#09244B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_calendar">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[13px] text-black font-geist">
                  30th Aug, 2025
                </span>
              </div>
            </div>
          </div>

          {/* Join Meeting Button */}
          <button className="w-full py-2.5 px-3 bg-black text-white rounded-3xl font-geist text-[13px] font-medium hover:bg-gray-800 transition-colors">
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
