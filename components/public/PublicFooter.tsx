import Link from "next/link";
import Image from "next/image";

const footerLinks: Record<string, string[]> = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Private Policy", "Terms od Service"],
};

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-[#F0F0F0] shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-16 pb-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          <div className="md:w-[320px] flex-shrink-0 flex flex-col gap-6">
            <Image
              src="/landing-page-logo.png"
              alt="Talent.ng"
              width={200}
              height={70}
              className="h-[70px] w-auto object-contain self-start"
              sizes="200px"
            />
            <p className="text-[#525866] text-base leading-6 max-w-xs">
              Nigeria&rsquo;s centralized platform connecting talents,
              recruiters, and mentors in one structured ecosystem.
            </p>
          </div>

          <div className="flex flex-1 flex-wrap gap-8 sm:gap-12">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="flex flex-col gap-4 min-w-[100px]">
                <h4 className="text-black font-semibold text-base">{heading}</h4>
                <div className="flex flex-col gap-3">
                  {links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="text-[#525866] text-base hover:text-black transition-colors flex items-center gap-2"
                    >
                      {link}
                      {link === "Learning Hub" && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#525866]">
                          Coming Soon
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#F0F0F0] text-center text-sm text-[#525866]">
          &copy;2026 Talent.ng. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
