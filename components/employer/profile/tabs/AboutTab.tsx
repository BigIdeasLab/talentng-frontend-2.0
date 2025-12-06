"use client";

export function AboutTab() {
  return (
    <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5 w-full max-w-[700px]">
      {/* About Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black font-inter-tight">
          About Chowdeck Nigeria
        </h2>
        <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
          <p>
            Chowdeck is Nigeria's premier on-demand delivery service, connecting
            customers with a wide array of restaurants and stores. Since our
            founding in 2021, we've been dedicated to providing fast, reliable,
            and convenient delivery solutions across Lagos, Abuja, and Port
            Harcourt.
          </p>
          <p>
            We partner with over 500 restaurants and retailers, offering
            everything from local cuisine to everyday essentials. Our mission is
            to simplify life for our customers, empower local businesses, and
            create job opportunities for riders. Whether you're craving a meal
            or need groceries delivered, Chowdeck is here to serve you.
          </p>
          <p>
            At Chowdeck, we are committed to innovation, customer satisfaction,
            and community development. Join us as we continue to revolutionize
            the delivery landscape in Nigeria.
          </p>
        </div>
      </div>

      {/* Company Details Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black font-inter-tight">
          Company Details
        </h2>
        <div className="flex flex-col gap-2">
          {/* Industry */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Industry
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                Logistics & Delivery
              </span>
              <span className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                SaaS
              </span>
              <span className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                Food
              </span>
            </div>
          </div>

          {/* Company Size */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Company Size
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              1 - 10
            </div>
          </div>

          {/* Company Stage */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Company Stage
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Early Startup
            </div>
          </div>

          {/* Operating Model */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Operating Model
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Remote
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
