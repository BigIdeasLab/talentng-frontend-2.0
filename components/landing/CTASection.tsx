import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#5C30FF] to-[#7C6CF0] rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-md mx-auto mb-8">
            Join thousands of Nigerian talents, recruiters, and mentors building
            their future on Talent.ng.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-[#5C30FF] text-base font-medium hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white text-white text-base font-medium hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
