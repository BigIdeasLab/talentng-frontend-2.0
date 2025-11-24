
import React, { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validations/profile";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface BestWorkUploadStepProps {
  form: UseFormReturn<ProfileFormValues>;
  onNext: () => void;
  isLastStep?: boolean;
}

export function BestWorkUploadStep({
  form,
  onNext,
  isLastStep,
}: BestWorkUploadStepProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const galleryUploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("files", file);
        return api("/talent/gallery", {
          method: "POST",
          body: formData,
        });
      });
      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-profile", user?.id] });
      toast.success("Gallery images uploaded successfully!");
      setSelectedFiles([]); // Clear selected files after successful upload
    },
    onError: (error) => {
      console.error("Error uploading gallery images:", error);
      toast.error("Failed to upload gallery images. Please try again.");
    },
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      toast.error("You can upload a maximum of 10 files.");
      return;
    }
    setSelectedFiles(files);
    if (files.length > 0) {
      await galleryUploadMutation.mutateAsync(files);
    }
  };

  return (
    <div className="flex flex-col items-start gap-8 w-full max-w-[608px]">
      <div className="flex flex-col items-start gap-6 w-full">
        <FormField
          control={form.control}
          name="gallery"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
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
                            d="M19.9995 3.5C20.53 3.5 21.0387 3.71071 21.4137 4.08579C21.7888 4.46086 21.9995 4.96957 21.9995 5.5V19.5C21.9995 20.0304 21.7888 20.5391 21.4137 20.9142C21.0387 21.2893 20.53 21.5 19.9995 21.5H3.99952C3.46909 21.5 2.96038 21.2893 2.58531 20.9142C2.21024 20.5391 1.99952 20.0304 1.99952 19.5V13.5C1.99952 13.2348 2.10488 12.9804 2.29242 12.7929C2.47995 12.6054 2.73431 12.5 2.99952 12.5C3.26474 12.5 3.51909 12.6054 3.70663 12.7929C3.89417 12.9804 3.99952 13.2348 3.99952 13.5V15.6L8.99452 10.606C9.1106 10.4899 9.24842 10.3978 9.40009 10.335C9.55177 10.2721 9.71434 10.2398 9.87852 10.2398C10.0427 10.2398 10.2053 10.2721 10.357 10.335C10.5086 10.3978 10.6464 10.4899 10.7625 10.606L14.8275 14.672L16.0655 13.434C16.1816 13.3179 16.3194 13.2258 16.4711 13.1629C16.6228 13.1001 16.7853 13.0678 16.9495 13.0678C17.1137 13.0678 17.2763 13.1001 17.428 13.1629C17.5796 13.2258 17.7174 13.3179 17.8335 13.434L19.9995 15.601V5.5H11.9995C11.7343 5.5 11.48 5.39464 11.2924 5.20711C11.1049 5.01957 10.9995 4.76522 10.9995 4.5C10.9995 4.23478 11.1049 3.98043 11.2924 3.79289C11.48 3.60536 11.7343 3.5 11.9995 3.5H19.9995Z"
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
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} file(s) selected`
                          : "Click to upload Best Work"}
                      </div>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedFiles.length > 0 && (
          <div className="space-y-2 w-full">
            <h4 className="text-sm font-medium text-gray-700">
              Selected files:
            </h4>
            <ul className="space-y-1">
              {selectedFiles.map((file, index) => (
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
        onClick={onNext}
        className="flex py-[14px] justify-center items-center gap-[10px] self-stretch rounded-[24px] bg-black text-white font-geist text-base font-medium leading-[120%] hover:bg-gray-900 transition-colors"
      >
        {isLastStep ? "Submit" : "Next"}
      </button>
    </div>
  );
}
