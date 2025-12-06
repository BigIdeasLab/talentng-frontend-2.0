"use client";

interface DescriptionStepProps {
  formData: {
    roleOverview: string;
    responsibilities: string;
    requirements: string;
    skills: string[];
    tools: string[];
  };
  updateFormData: (data: Partial<DescriptionStepProps["formData"]>) => void;
  onNext: () => void;
}

export function DescriptionStep({
  formData,
  updateFormData,
  onNext,
}: DescriptionStepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Section Title */}
      <h2 className="font-inter-tight text-[20px] font-medium text-black">
        Describe Your Opportunity
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        {/* Role overview */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Role overview
          </label>
          <textarea
            placeholder="About the Internship"
            value={formData.roleOverview}
            onChange={(e) => updateFormData({ roleOverview: e.target.value })}
            rows={6}
            className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors resize-none"
          />
        </div>

        {/* Responsibilities */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Responsibilities
          </label>
          <textarea
            placeholder="What talents will do"
            value={formData.responsibilities}
            onChange={(e) =>
              updateFormData({ responsibilities: e.target.value })
            }
            rows={6}
            className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors resize-none"
          />
        </div>

        {/* Requirement */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Requirement
          </label>
          <textarea
            placeholder="What talents must have"
            value={formData.requirements}
            onChange={(e) => updateFormData({ requirements: e.target.value })}
            rows={6}
            className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors resize-none"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Skills
          </label>
          <div className="relative">
            <select
              multiple
              value={formData.skills}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );
                updateFormData({ skills: selected });
              }}
              className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select Skills
              </option>
              <option value="ui-design">UI Design</option>
              <option value="ux-design">UX Design</option>
              <option value="web-design">Web Design</option>
              <option value="graphic-design">Graphic Design</option>
              <option value="user-research">User Research</option>
              <option value="prototyping">Prototyping</option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                fill="#B2B2B2"
              />
            </svg>
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Tools
          </label>
          <div className="relative">
            <select
              multiple
              value={formData.tools}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );
                updateFormData({ tools: selected });
              }}
              className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
            >
              <option value="" disabled className="text-[#99A0AE]">
                Select Tools
              </option>
              <option value="figma">Figma</option>
              <option value="sketch">Sketch</option>
              <option value="adobe-xd">Adobe XD</option>
              <option value="photoshop">Photoshop</option>
              <option value="illustrator">Illustrator</option>
              <option value="invision">InVision</option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2826 6.2209C11.3525 6.29058 11.4079 6.37338 11.4458 6.46454C11.4837 6.5557 11.5031 6.65344 11.5031 6.75215C11.5031 6.85086 11.4837 6.9486 11.4458 7.03977C11.4079 7.13093 11.3525 7.21373 11.2826 7.2834L8.28255 10.2834C8.21287 10.3533 8.13008 10.4088 8.03892 10.4467C7.94775 10.4845 7.85001 10.504 7.7513 10.504C7.65259 10.504 7.55485 10.4845 7.46369 10.4467C7.37252 10.4088 7.28973 10.3533 7.22005 10.2834L4.22005 7.2834C4.07915 7.14251 4 6.95141 4 6.75215C4 6.5529 4.07915 6.3618 4.22005 6.2209C4.36095 6.08001 4.55204 6.00085 4.7513 6.00085C4.95056 6.00085 5.14165 6.08001 5.28255 6.2209L7.75193 8.68903L10.2213 6.21903C10.2911 6.14942 10.3739 6.09425 10.465 6.05666C10.5561 6.01908 10.6538 5.99983 10.7523 6C10.8509 6.00018 10.9484 6.01977 11.0394 6.05768C11.1304 6.09558 11.213 6.15105 11.2826 6.2209Z"
                fill="#B2B2B2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full h-[54px] bg-[#181B25] border border-[#181B25] rounded-full font-inter-tight text-[18px] font-normal text-white hover:bg-[#2a2d35] transition-colors"
      >
        Next
      </button>
    </div>
  );
}
