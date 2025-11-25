import React from "react";

const CallToAction = () => {
  return (
    <section className="w-full max-w-[1216px] mx-auto px-4 py-12 md:py-16">
      <div className="relative flex items-center justify-center px-6 md:px-12 lg:px-[341px] py-12 md:py-16 lg:py-[67px] rounded-[44px] md:rounded-[88px] bg-gradient-to-r from-black via-[#181818] to-[#000000]">
        {/* Main Content */}
        <div className="flex flex-col items-center gap-2 w-full max-w-[533px]">
          {/* Heading with inline Talent Badge */}
          <div className="relative w-full flex flex-col items-center mb-6">
            <h2 className="text-white text-center font-geist text-4xl md:text-5xl font-semibold leading-[140%]">
              Join 100k+{" "}
              <span className="relative inline-flex items-center">
                <span className="inline-block px-6 md:px-8 py-2 rounded-[64px] bg-white transform rotate-[0.249deg]">
                  <span className="text-black text-center font-geist text-2xl md:text-[32px] font-bold leading-[140%]">
                    Talent
                  </span>
                </span>
              </span>
              <br className="hidden md:inline" />
              and 1M+ Recruiters
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mt-2">
            <button className="flex items-center justify-center h-12 px-6 py-1 rounded-3xl bg-gray-800 hover:bg-gray-700 transition-colors">
              <span className="text-white text-center font-geist text-base font-medium leading-6">
                Hire creatives
              </span>
            </button>
            <button className="flex items-center justify-center h-12 px-6 py-1 rounded-3xl border border-[#D0D4DC] bg-white hover:bg-gray-50 transition-colors">
              <span className="text-gray-600 text-center font-geist text-base font-medium leading-6">
                Get hired
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
