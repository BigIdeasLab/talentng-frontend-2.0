"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BookingModal from "@/components/BookingModal";
import { getMentorById } from "@/lib/api";
import { Mentor } from "@/lib/types/mentor";

export default function MentorDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const fetchedMentor = await getMentorById(id as string);
        setMentor(fetchedMentor);
      } catch (err) {
        setError("Failed to fetch mentor details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentor();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!mentor) {
    return <p>Mentor not found.</p>;
  }

  return (
    <>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="max-w-[1118px] mx-auto space-y-6">
            {/* Top bar with back and CTA */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold font-geist">
                  Mentorship
                </h1>
                <div className="text-sm text-gray-500 mt-1">
                  <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-600 underline"
                  >
                    Back
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center justify-center rounded-3xl bg-black text-white h-11 px-4 text-sm font-medium"
              >
                Book a session
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <img
                  src={mentor.profileImageUrl ?? ''}
                  alt={mentor.fullName}
                  className="w-32 h-32 rounded-full object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-semibold font-geist text-black">
                      {mentor.fullName}
                    </h2>
                    {mentor.user.isVerified && <span>✓</span>}
                  </div>

                  <div className="text-base text-black mt-1">
                    {mentor.headline}, {mentor.company}
                  </div>
                  <div className="text-base text-black mt-1">
                    {mentor.location}
                  </div>

                  <p className="text-base text-gray-500 mt-4 leading-7">
                    {mentor.bio}
                  </p>

                  <div className="mt-6 max-w-xl">
                    <div className="text-base font-semibold text-[#0C111D]">
                      Available for
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {mentor.expertise.slice(0, 3).map((a) => (
                        <div
                          key={a}
                          className="px-3 py-2 border border-gray-200 rounded-full text-[13px] text-[#0C111D] bg-white"
                        >
                          {a}
                        </div>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <div className="px-3 py-2 border border-gray-200 rounded-full text-[13px] text-[#0C111D] bg-gray-50">
                          +{mentor.expertise.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social icons */}
                  <div className="mt-6 flex items-center gap-8 text-gray-500">
                    {/* Twitter */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_tw)">
                        <path
                          d="M4.59404 4.98439C4.7751 4.96335 4.95846 4.99219 5.12431 5.0678C5.29016 5.14342 5.43219 5.26292 5.53504 5.41339C7.01104 7.57239 8.78304 8.47039 10.75 8.67439C10.846 7.83339 11.073 7.00239 11.5 6.27039C12.126 5.19639 13.144 4.40639 14.598 4.11439C16.608 3.71039 18.138 4.43839 19.025 5.32939L20.817 4.99439C21.0046 4.95926 21.1982 4.9785 21.3752 5.04984C21.5521 5.12119 21.7049 5.24166 21.8157 5.39704C21.9264 5.55242 21.9903 5.73623 21.9999 5.92677C22.0096 6.11731 21.9645 6.30663 21.87 6.47239L20.15 9.49439C20.307 13.8554 19.095 16.8994 16.511 18.9964C15.141 20.1084 13.179 20.7394 11.026 20.9344C8.85604 21.1304 6.40304 20.8934 3.96504 20.1814C3.75674 20.1206 3.57384 19.9938 3.44397 19.8199C3.31409 19.6461 3.24428 19.4347 3.24507 19.2178C3.24587 19.0008 3.31721 18.7899 3.44835 18.617C3.57949 18.4442 3.7633 18.3186 3.97204 18.2594C5.19804 17.9104 6.13204 17.6094 6.97504 17.0824C5.77604 16.4464 4.89304 15.6144 4.26804 14.6664C3.40004 13.3484 3.07804 11.8784 3.01404 10.5534C2.95004 9.22839 3.14104 8.00039 3.34304 7.11539C3.45804 6.61039 3.59204 6.10439 3.77704 5.62039C3.8423 5.44978 3.95304 5.3003 4.09725 5.18818C4.24145 5.07606 4.41261 5.00558 4.59404 4.98439Z"
                          fill="#475467"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_tw">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    {/* Instagram */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_ig)">
                        <path
                          d="M16 3C17.3261 3 18.5979 3.52678 19.5355 4.46447C20.4732 5.40215 21 6.67392 21 8V16C21 17.3261 20.4732 18.5979 19.5355 19.5355C18.5979 20.4732 17.3261 21 16 21H8C6.67392 21 5.40215 20.4732 4.46447 19.5355C3.52678 18.5979 3 17.3261 3 16V8C3 6.67392 3.52678 5.40215 4.46447 4.46447C5.40215 3.52678 6.67392 3 8 3H16ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10ZM16.5 6.5C16.2348 6.5 15.9804 6.60536 15.7929 6.79289C15.6054 6.98043 15.5 7.23478 15.5 7.5C15.5 7.76522 15.6054 8.01957 15.7929 8.20711C15.9804 8.39464 16.2348 8.5 16.5 8.5C16.7652 8.5 17.0196 8.39464 17.2071 8.20711C17.3946 8.01957 17.5 7.76522 17.5 7.5C17.5 7.23478 17.3946 6.98043 17.2071 6.79289C17.0196 6.60536 16.7652 6.5 16.5 6.5Z"
                          fill="#475467"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_ig">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    {/* LinkedIn */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_in)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18 3C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V18C21 18.7956 20.6839 19.5587 20.1213 20.1213C19.5587 20.6839 18.7956 21 18 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7956 3 18V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H18ZM8 10C7.73478 10 7.48043 10.1054 7.29289 10.2929C7.10536 10.4804 7 10.7348 7 11V16C7 16.2652 7.10536 16.5196 7.29289 16.7071C7.48043 16.8946 7.73478 17 8 17C8.26522 17 8.51957 16.8946 8.70711 16.7071C8.89464 16.5196 9 16.2652 9 16V11C9 10.7348 8.89464 10.4804 8.70711 10.2929C8.51957 10.1054 8.26522 10 8 10ZM11 9C10.7348 9 10.4804 9.10536 10.29289 9.29289C10.1054 9.48043 10 9.73478 10 10V16C10 16.2652 10.1054 16.5196 10.2929 16.7071C10.4804 16.8946 10.7348 17 11 17C11.2652 17 11.5196 16.8946 11.7071 16.7071C11.8946 16.5196 12 16.2652 12 16V12.34C12.305 11.996 12.82 11.592 13.393 11.347C13.726 11.205 14.227 11.147 14.575 11.257C14.6904 11.2863 14.7933 11.3523 14.868 11.445C14.92 11.515 15 11.671 15 12V16C15 16.2652 15.1054 16.5196 15.2929 16.7071C15.4804 16.8946 15.7348 17 16 17C16.2652 17 16.5196 16.8946 16.7071 16.7071C16.8946 16.5196 17 16.2652 17 16V12C17 11.33 16.83 10.734 16.476 10.256C16.1503 9.82256 15.6944 9.50472 15.175 9.349C14.273 9.066 13.274 9.223 12.607 9.509C12.3933 9.60046 12.1852 9.70465 11.984 9.821C11.9421 9.59059 11.8206 9.3822 11.6408 9.23216C11.461 9.08213 11.2342 8.99996 11 9ZM8 7C7.73478 7 7.48043 7.10536 7.29289 7.29289C7.10536 7.48043 7 7.73478 7 8C7 8.26522 7.10536 8.51957 7.29289 8.70711C7.48043 8.89464 7.73478 9 8 9C8.26522 9 8.51957 8.89464 8.70711 8.70711C8.89464 8.51957 9 8.26522 9 8C9 7.73478 8.89464 7.48043 8.70711 7.29289C8.51957 7.10536 8.26522 7 8 7Z"
                          fill="#475467"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_in">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    {/* Dribbble */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_db)">
                        <path
                          d="M13.7742 14.439C14.5402 16.7093 15.0552 19.0566 15.3102 21.439C14.2464 21.8114 13.1272 22.0011 12.0002 22C10.0174 22.003 8.07888 21.4139 6.43315 20.308C7.2 18.887 8.2451 17.635 9.50613 16.6265C10.7672 15.618 12.2183 14.8737 13.7732 14.438L13.7742 14.439ZM21.5732 14.902C20.8591 17.2482 19.3097 19.2513 17.2182 20.532C16.9385 18.3344 16.4496 16.1686 15.7582 14.064C17.7359 13.8596 19.7336 14.1475 21.5732 14.902ZM12.1452 10.485C12.4772 11.163 12.7882 11.855 13.0752 12.558C9.61176 13.5731 6.67256 15.8834 4.86815 19.009C3.85421 17.97 3.07668 16.7243 2.58876 15.357C2.10084 13.9897 1.91404 12.5332 2.04115 11.087C5.38415 11.795 8.91115 11.589 12.1452 10.485ZM19.7201 5.644C21.3862 7.67864 22.1902 10.2843 21.9601 12.904C19.7603 12.076 17.3884 11.8113 15.0602 12.134C14.7387 11.3217 14.3868 10.5218 14.0052 9.736C16.1475 8.7383 18.0855 7.35068 19.7201 5.644ZM7.26615 3.19C8.76054 4.88504 10.0774 6.72865 11.1962 8.692C8.35797 9.59595 5.33311 9.74416 2.42015 9.122C3.18682 6.58128 4.92945 4.44812 7.26615 3.19ZM12.0002 2C14.3882 2 16.5811 2.837 18.3001 4.234C16.8116 5.79515 15.0403 7.05953 13.0802 7.96C11.9762 5.9838 10.6835 4.1191 9.22015 2.392C10.1238 2.13132 11.0597 1.99936 12.0002 2Z"
                          fill="#475467"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_db">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-black font-geist">
                  Resume
                </h3>
                <div className="mt-6 space-y-6">
                  <div className="pb-4 border-b border-gray-200">
                    <div className="text-[13px] text-black">
                      Aug 2022 - Present
                    </div>
                    <div className="text-base font-semibold text-black">
                      Product Designer, ConnectNigeria
                    </div>
                  </div>
                  <div className="pb-4">
                    <div className="text-[13px] text-black">
                      Aug 2021 - Sept 2021
                    </div>
                    <div className="text-base font-semibold text-black">
                      Product Designer, Eonsfleet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

      <BookingModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mentor={mentor}
      />
    </>
  );
}
