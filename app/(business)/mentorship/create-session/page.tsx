"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSessionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionType, setSessionType] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [description, setDescription] = useState("");

  const steps = [
    { number: 1, title: "Session Basics", active: currentStep === 1 },
    { number: 2, title: "Time & Pricing", active: currentStep === 2 },
    { number: 3, title: "Availability", active: currentStep === 3 },
  ];

  const handleCancel = () => {
    router.push("/mentorship");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleContinue = () => {
    // Handle form submission
    console.log({ sessionType, sessionTitle, description });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white px-5 py-5">
        <div className="flex items-center justify-between">
          <h1 className="font-inter-tight text-xl font-medium leading-5 text-black">
            Create A New Session
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-[30px] border border-[#F5F5F5] bg-[#F5F5F5] px-8 py-[18px] text-base font-normal text-black hover:bg-[#E5E5E5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              className="rounded-[30px] bg-[#5C30FF] px-8 py-[18px] text-base font-normal text-white hover:bg-[#4A26CC]"
            >
              Continue
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex max-w-[1440px] gap-8 px-6 py-8 lg:px-12">
        {/* Left Sidebar - Steps */}
        <aside className="w-full max-w-[354px]">
          <div className="flex flex-col gap-3">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center justify-between rounded-lg px-3 py-5 transition-colors ${
                  step.active
                    ? "bg-[#F5F5F5] text-black"
                    : "bg-[#F5F5F5] text-[#525866]"
                }`}
              >
                <span className="font-inter-tight text-[15px] font-normal">
                  {step.number}. {step.title}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M13.875 9H3.75"
                    stroke={step.active ? "#141B34" : "#525866"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 13.5C9.75 13.5 14.25 10.1858 14.25 9C14.25 7.8141 9.75 4.5 9.75 4.5"
                    stroke={step.active ? "#141B34" : "#525866"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1">
          <div className="rounded-lg bg-white px-4 pb-5 pt-2.5">
            {currentStep === 1 && (
              <div className="flex flex-col gap-9">
                <h2 className="font-inter-tight text-xl font-medium leading-5 text-black">
                  Session Basics
                </h2>

                <div className="flex flex-col gap-5">
                  {/* Session Type */}
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="session-type"
                      className="font-inter-tight text-[15px] font-normal text-black"
                    >
                      Session Type
                    </Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger id="session-type">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-on-1">1-on-1 Mentoring</SelectItem>
                        <SelectItem value="portfolio-review">
                          Portfolio Review
                        </SelectItem>
                        <SelectItem value="career-advice">
                          Career Advice
                        </SelectItem>
                        <SelectItem value="skill-development">
                          Skill Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Session Title */}
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="session-title"
                      className="font-inter-tight text-[15px] font-normal text-black"
                    >
                      Session Title
                    </Label>
                    <Input
                      id="session-title"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="e.g., Mobile Design Portfolio Review"
                      className="h-14 rounded-lg border border-[#E1E4EA] px-4 py-6 font-inter-tight text-[15px] font-normal placeholder:text-[#99A0AE]"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="description"
                      className="font-inter-tight text-[15px] font-normal text-black"
                    >
                      Short Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what this session covers"
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="rounded-[30px] bg-[#181B25] px-12 py-5 font-inter-tight text-base font-normal text-white hover:bg-[#0F1117]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-9">
                <h2 className="font-inter-tight text-xl font-medium leading-5 text-black">
                  Time & Pricing
                </h2>
                <p className="text-gray-600">
                  Time & Pricing configuration coming soon...
                </p>
                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="rounded-[30px] border border-[#F5F5F5] bg-[#F5F5F5] px-12 py-5 font-inter-tight text-base font-normal text-black hover:bg-[#E5E5E5]"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="rounded-[30px] bg-[#181B25] px-12 py-5 font-inter-tight text-base font-normal text-white hover:bg-[#0F1117]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col gap-9">
                <h2 className="font-inter-tight text-xl font-medium leading-5 text-black">
                  Availability
                </h2>
                <p className="text-gray-600">
                  Availability configuration coming soon...
                </p>
                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="rounded-[30px] border border-[#F5F5F5] bg-[#F5F5F5] px-12 py-5 font-inter-tight text-base font-normal text-black hover:bg-[#E5E5E5]"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="rounded-[30px] bg-[#181B25] px-12 py-5 font-inter-tight text-base font-normal text-white hover:bg-[#0F1117]"
                  >
                    Create Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
