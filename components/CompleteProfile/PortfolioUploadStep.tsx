import React, { useRef, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileFormValues } from "@/lib/validations/profile";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import apiClient from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { PortfolioItem } from "@/lib/types/profile";

import { TalentProfile } from "@/lib/types/profile";

interface PortfolioUploadStepProps {
  form: UseFormReturn<ProfileFormValues>;
  onNext: () => void;
  userId: string | undefined;
  isLastStep?: boolean;
}

export function PortfolioUploadStep({
  form,
  onNext,
  userId,
  isLastStep,
}: PortfolioUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedFilesToUpload, setSelectedFilesToUpload] = useState<File[]>(
    [],
  );
  const [uploadedPortfolioItems, setUploadedPortfolioItems] = useState<
    PortfolioItem[]
  >(form.getValues("portfolioItems") || []);

  const portfolioUploadMutation = useMutation<PortfolioItem, Error, File>({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient("/talent/portfolio", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData<TalentProfile | undefined>(
        ["talent-profile", userId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            portfolioItems: [...(oldData.portfolioItems || []), newItem],
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error uploading portfolio item:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload portfolio item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFilesToUpload(files);

    // Update form with file names or file objects
    // For now, we\'ll store the file names as strings
    const fileNames = files.map((file) => file.name);
    form.setValue("portfolioItems", fileNames);
  };

  const { handleSubmit } = form;

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadAndSubmit = async () => {
    if (selectedFilesToUpload.length === 0) {
      onNext();
      return;
    }

    setIsUploading(true);

    try {
      await Promise.all(
        selectedFilesToUpload.map((file) =>
          portfolioUploadMutation.mutateAsync(file),
        ),
      );

      toast({
        title: "Portfolio Uploaded",
        description: "Your portfolio items have been successfully uploaded.",
      });

      onNext();
    } catch (error) {
      // The onError in the mutation will handle the toast
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-8 w-full max-w-[608px]">
      <div className="flex flex-col items-start gap-6 w-full">
        <FormField
          control={form.control}
          name="portfolioItems"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    multiple
                    className="hidden"
                  />
                  <div
                    onClick={handleFileSelect}
                    className="flex py-9 justify-center items-center flex-1 self-stretch rounded-[32px] border border-dashed border-black bg-[#EAECF0] cursor-pointer hover:bg-gray-100 transition-colors"
                    style={{ minHeight: "120px" }}
                  >
                    <div className="flex w-[158px] flex-col items-center gap-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_2193_3733)">
                          <path
                            d="M19.9995 3.5C20.53 3.5 21.0387 3.71071 21.4137 4.08579C21.7888 4.46086 21.9995 4.96957 21.9995 5.5V19.5C21.9995 20.0304 21.7888 20.5391 21.4137 20.9142C21.0387 21.2893 20.53 21.5 19.9995 21.5H3.99952C3.46909 21.5 2.96038 21.2893 2.58531 20.9142C2.21024 20.5391 1.99952 20.0304 1.99952 19.5V13.5C1.99952 13.2348 2.10488 12.9804 2.29242 12.7929C2.47995 12.6054 2.73431 12.5 2.99952 12.5C3.26474 12.5 3.51909 12.6054 3.70663 12.7929C3.89417 12.9804 3.99952 13.2348 3.99952 13.5V15.6L8.99452 10.606C9.1106 10.4899 9.24842 10.3978 9.40009 10.335C9.55177 10.2721 9.71434 10.2398 9.87852 10.2398C10.0427 10.2398 10.2053 10.2721 10.357 10.335C10.5086 10.3978 10.6464 10.4899 10.7625 10.606L14.8275 14.672L16.0655 13.434C16.1816 13.3179 16.3194 13.2258 16.4711 13.1629C16.6228 13.1001 16.7853 13.0678 16.9495 13.0678C17.1137 13.0678 17.2763 13.1001 17.428 13.1629C17.5796 13.2258 17.7174 13.3179 17.8335 13.434L19.9995 15.601V5.5H11.9995C11.7343 5.5 11.48 5.39464 11.2924 5.20711C11.1049 5.01957 10.9995 4.76522 10.9995 4.5C10.9995 4.23478 11.1049 3.98043 11.2924 3.79289C11.48 3.60536 11.7343 3.5 11.9995 3.5H19.9995ZM4.99952 2.5C5.1866 2.5 5.36993 2.55248 5.52868 2.65147C5.68742 2.75046 5.81521 2.892 5.89752 3.06L5.94552 3.177L6.07552 3.555C6.21273 3.95718 6.4338 4.32563 6.72412 4.63594C7.01443 4.94626 7.36736 5.19135 7.75952 5.355L7.94452 5.425L8.32252 5.554C8.50966 5.61797 8.67363 5.736 8.79369 5.89316C8.91375 6.05031 8.98452 6.23954 8.99704 6.43691C9.00956 6.63429 8.96328 6.83094 8.86404 7.00201C8.76481 7.17308 8.61707 7.31089 8.43952 7.398L8.32252 7.446L7.94452 7.576C7.54234 7.7132 7.17389 7.93428 6.86358 8.22459C6.55327 8.51491 6.30817 8.86783 6.14452 9.26L6.07452 9.445L5.94552 9.823C5.88155 10.0101 5.76352 10.1741 5.60637 10.2942C5.44921 10.4142 5.25998 10.485 5.06261 10.4975C4.86524 10.51 4.66858 10.4638 4.49751 10.3645C4.32644 10.2653 4.18864 10.1176 4.10152 9.94L4.05352 9.823L3.92352 9.445C3.78632 9.04282 3.56524 8.67437 3.27493 8.36406C2.98462 8.05375 2.63169 7.80865 2.23952 7.645L2.05452 7.575L1.67652 7.446C1.48939 7.38203 1.32542 7.264 1.20536 7.10684C1.0853 6.94969 1.01453 6.76046 1.00201 6.56309C0.989484 6.36571 1.03577 6.16906 1.135 5.99799C1.23424 5.82692 1.38197 5.68911 1.55952 5.602L1.67652 5.554L2.05452 5.424C2.45671 5.2868 2.82515 5.06572 3.13547 4.77541C3.44578 4.48509 3.69087 4.13217 3.85452 3.74L3.92452 3.555L4.05352 3.177C4.1209 2.97959 4.24832 2.80818 4.41795 2.68679C4.58758 2.56539 4.79093 2.50008 4.99952 2.5ZM15.4995 7.5C15.8973 7.5 16.2789 7.65804 16.5602 7.93934C16.8415 8.22064 16.9995 8.60218 16.9995 9C16.9995 9.39783 16.8415 9.77936 16.5602 10.0607C16.2789 10.342 15.8973 10.5 15.4995 10.5C15.1017 10.5 14.7202 10.342 14.4389 10.0607C14.1576 9.77936 13.9995 9.39783 13.9995 9C13.9995 8.60218 14.1576 8.22064 14.4389 7.93934C14.7202 7.65804 15.1017 7.5 15.4995 7.5Z"
                            fill="black"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2193_3733">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(0 0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="text-black font-geist text-[13px] font-medium leading-[120%]">
                        {selectedFilesToUpload.length > 0
                          ? `${selectedFilesToUpload.length} file(s) selected`
                          : "Click to upload Portfolio"}
                      </div>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedFilesToUpload.length > 0 && (
          <div className="space-y-2 w-full">
            <h4 className="text-sm font-medium text-gray-700">
              Selected files:
            </h4>
            <ul className="space-y-1">
              {selectedFilesToUpload.map((file, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 px-3 py-1 bg-gray-50 rounded"
                >
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleUploadAndSubmit}
        disabled={isUploading}
        className="flex py-[14px] justify-center items-center gap-[10px] self-stretch rounded-[24px] bg-black text-white font-geist text-base font-medium leading-[120%] hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
                {isUploading
          ? "Uploading..."
          : selectedFilesToUpload.length > 0
          ? "Upload"
          : isLastStep
          ? "Submit"
          : "Next"}
      </button>
    </div>
  );
}
