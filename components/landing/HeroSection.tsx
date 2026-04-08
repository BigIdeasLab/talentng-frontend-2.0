import Link from "next/link";
import Image from "next/image";

function HeroMockup() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-white shadow-xl aspect-[642/483]">
      {/* Decorative circles */}
      <div
        className="absolute rounded-full bg-[#1CBB41] pointer-events-none"
        style={{
          width: "75.9%",
          paddingBottom: "75.9%",
          left: "-30.2%",
          top: "-41.6%",
        }}
      />
      <div
        className="absolute rounded-full bg-[#FEF32B] pointer-events-none"
        style={{
          width: "48.4%",
          paddingBottom: "48.4%",
          right: "-24.3%",
          top: "-13.9%",
        }}
      />
      <div
        className="absolute rounded-full bg-[#5C30FF] pointer-events-none"
        style={{
          width: "48.4%",
          paddingBottom: "48.4%",
          left: "-16.5%",
          bottom: "-26.5%",
        }}
      />
      {/* Platform screenshot */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/d694f83bf298a860b64aa722c354b702b33f2bcc?width=1614"
        alt="Talent.ng platform screenshot"
        width={1614}
        height={1000}
        className="absolute inset-0 w-full h-full object-cover object-left-top"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1614px"
        priority
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="bg-[#ECEEFF] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-12">
        {/* Left copy */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.05] text-black">
              Nigeria&rsquo;s Skills &amp;
              <br />
              Opportunities &mdash;{" "}
              <span className="text-[#1DBF73]">All in</span>
              <br />
              <span className="text-[#5C30FF]">One Place.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-gray-700 max-w-md leading-relaxed">
              Create your profile, discover opportunities, connect with mentors,
              and grow your career on Talent.ng.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#5C30FF] text-white text-base font-medium hover:bg-[#4a26d4] transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="#discover"
              className="inline-flex items-center px-6 py-3 rounded-full border border-[#ccc] bg-white text-gray-800 text-base font-medium hover:border-[#5C30FF] transition-colors"
            >
              Browse Opportunities
            </Link>
          </div>
          <p className="text-sm text-[#525866]">
            Free to join &bull; Built for Nigeria
          </p>
        </div>

        {/* Right mockup */}
        <div className="flex-1 min-w-0 max-w-[580px] w-full">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
