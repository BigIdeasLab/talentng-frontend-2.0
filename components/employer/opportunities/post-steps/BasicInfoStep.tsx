"use client";

interface BasicInfoStepProps {
  formData: {
    title: string;
    company: string;
    opportunityType: string;
    category: string;
    workType: string;
    location: string;
    compensationType: string;
  };
  updateFormData: (data: Partial<BasicInfoStepProps["formData"]>) => void;
  onNext: () => void;
}

export function BasicInfoStep({
  formData,
  updateFormData,
  onNext,
}: BasicInfoStepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Section Title */}
      <h2 className="font-inter-tight text-[20px] font-medium text-black">
        Basic Information
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Title
          </label>
          <input
            type="text"
            placeholder="Add A descriptive Title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
          />
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Company
          </label>
          <input
            type="text"
            placeholder="Enter Company Name"
            value={formData.company}
            onChange={(e) => updateFormData({ company: e.target.value })}
            className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
          />
        </div>

        {/* Opportunity Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-3">
            <label className="font-inter-tight text-[15px] font-normal text-black">
              Opportunity Type
            </label>
            <div className="relative">
              <select
                value={formData.opportunityType}
                onChange={(e) =>
                  updateFormData({ opportunityType: e.target.value })
                }
                className="w-full h-[57px] px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
              >
                <option value="" disabled className="text-[#99A0AE]">
                  Select
                </option>
                <option value="job-listing">Job Listing</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
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

          <div className="flex flex-col gap-3">
            <label className="font-inter-tight text-[15px] font-normal text-black">
              Category / Role
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => updateFormData({ category: e.target.value })}
                className="w-full h-[57px] px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
              >
                <option value="" disabled className="text-[#99A0AE]">
                  Select
                </option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
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

        {/* Work Type & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-3">
            <label className="font-inter-tight text-[15px] font-normal text-black">
              Work Type
            </label>
            <div className="relative">
              <select
                value={formData.workType}
                onChange={(e) => updateFormData({ workType: e.target.value })}
                className="w-full h-[57px] px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] appearance-none outline-none focus:border-[#5C30FF] transition-colors bg-white"
              >
                <option value="" disabled className="text-[#99A0AE]">
                  Remote / Hybrid / On-Site
                </option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
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

          <div className="flex flex-col gap-3">
            <label className="font-inter-tight text-[15px] font-normal text-black">
              Location
            </label>
            <input
              type="text"
              placeholder="Select"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
            />
          </div>
        </div>

        {/* Compensation Type */}
        <div className="flex flex-col gap-3">
          <label className="font-inter-tight text-[15px] font-normal text-black">
            Compensation Type
          </label>
          <input
            type="text"
            placeholder="Paid (Fixed / Hourly \ Range)"
            value={formData.compensationType}
            onChange={(e) =>
              updateFormData({ compensationType: e.target.value })
            }
            className="w-full px-4 py-4 border border-[#E1E4EA] rounded-[10px] font-inter-tight text-[15px] text-black placeholder:text-[#99A0AE] outline-none focus:border-[#5C30FF] transition-colors"
          />
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
