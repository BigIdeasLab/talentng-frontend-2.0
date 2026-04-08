import { howItWorksSteps } from "@/lib/data/landing";

export function HowItWorksSection() {
  return (
    <section className="bg-white py-16 md:py-20 border-t border-[#F0F0F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-black">
            How It Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-md mx-auto">
            Get started in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {howItWorksSteps.map((step) => (
            <div
              key={step.step}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A6B3C] mb-2">
                  {step.step}
                </p>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-[#525866] text-sm sm:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
