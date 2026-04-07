import Link from "next/link";
import Image from "next/image";

export interface PublicCTAProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

export function PublicCTA({ title, subtitle, ctaText, ctaHref }: PublicCTAProps) {
  return (
    <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center gap-5">
          <Image
            src="/landing-page-logo.png"
            alt="Talent.ng Logo"
            width={400}
            height={200}
            className="h-[200px] w-auto object-contain"
            sizes="400px"
          />
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl sm:text-[56px] md:text-[60px] font-normal text-black leading-[1.05]">
              {title}
            </h2>
            <p className="text-base sm:text-xl text-black">{subtitle}</p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center px-8 py-4 rounded-full bg-[#5C30FF] border border-[#5C30FF] text-white text-lg font-medium hover:bg-[#4a26d4] transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
