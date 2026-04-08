import Link from "next/link";
import Image from "next/image";
import { roles } from "@/lib/data/landing";

function PlatformMockup({ images, bg }: { images: string[]; bg: string }) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-2xl`}
      style={{ backgroundColor: bg }}
    >
      <Image
        src={images[0]}
        alt="Platform mockup"
        width={1200}
        height={800}
        className="w-full h-auto object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 600px"
        loading="lazy"
      />
    </div>
  );
}

export function RolesSection() {
  return (
    <section className="bg-white py-6 md:py-10 pb-20 md:pb-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`flex flex-col ${
              role.reversed ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-10 md:gap-16 mb-20 md:mb-28 last:mb-0`}
          >
            {/* Text content */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <div className={`rounded-3xl p-8 md:p-10 ${role.cardBg}`}>
                <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                  {role.title}
                </h2>
                <p className="text-base sm:text-lg text-[#525866] leading-relaxed mb-6">
                  {role.desc}
                </p>
                <Link
                  href="/signup"
                  className={`inline-flex items-center px-6 py-3 rounded-full ${role.ctaStyle} text-base font-medium hover:opacity-90 transition-opacity`}
                >
                  {role.cta}
                </Link>
              </div>
            </div>

            {/* Mockup */}
            <div className="flex-1 min-w-0 max-w-[580px] w-full">
              <PlatformMockup images={role.images} bg={role.mockupBg} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
