"use client";

import { useState } from "react";
import { faqs } from "@/lib/data/landing";
import { ChevronDownIcon } from "./icons";

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="bg-white py-20 md:py-28 border-t border-[#F0F0F0]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-black">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-md mx-auto">
            Everything you need to know about Talent.ng.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[#E1E4EA] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-black pr-4">
                  {faq.q}
                </span>
                <ChevronDownIcon
                  className={`flex-shrink-0 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-base text-[#525866] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
