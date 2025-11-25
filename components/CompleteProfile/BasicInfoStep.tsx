import React, { useRef, useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { ProfileFormValues } from "@/lib/validations/profile";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils"; // Added cn import

interface BasicInfoStepProps {
  form: UseFormReturn<ProfileFormValues>;
  onNext: () => void;
  isLastStep?: boolean;
}

export function BasicInfoStep({ form, onNext, isLastStep }: BasicInfoStepProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const profileImageUrl = form.watch("profileImageUrl");

  useEffect(() => {
    if (profileImageUrl) {
      setImagePreview(profileImageUrl);
    }
  }, [profileImageUrl]);

  const imageUploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api("/talent/profile-image", {
        method: "PATCH",
        body: formData,
      });
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["talent-profile", user?.id], data);
      form.setValue("profileImageUrl", data.profileImageUrl);
      toast.success("Profile Image Updated");
      setSelectedFile(null);
      setImagePreview(data.profileImageUrl);
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile image. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = () => {
    if (selectedFile) {
      imageUploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="space-y-8">
      <FormItem>
        <div>
          <FormLabel>Profile Image</FormLabel>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 3C20.5304 3 21.0392 3.71071 21.4142 4.08579C21.7893 4.46086 22 4.96957 22 5.5V19.5C22 20.0304 21.7893 20.5391 21.4142 20.9142C21.0392 21.2893 20.5304 21.5 20 21.5H4C3.46957 21.5 2.96086 21.2893 2.58579 20.9142C2.21073 20.5391 2.00001 20.0304 2.00001 19.5V13.5C2.00001 13.2348 2.10537 12.9804 2.29291 12.7929C2.48044 12.6054 2.7348 12.5 3.00001 12.5C3.26523 12.5 3.51958 12.6054 3.70712 12.7929C3.89466 12.9804 4.00001 13.2348 4.00001 13.5V15.6L8.99501 10.606C9.11109 10.4899 9.2489 10.3978 9.40058 10.335C9.55226 10.2721 9.71483 10.2398 9.87901 10.2398C10.0432 10.2398 10.2058 10.2721 10.3574 10.335C10.5091 10.3978 10.6469 10.4899 10.763 10.606L14.828 14.672L16.066 13.434C16.1821 13.3179 16.3199 13.2258 16.4716 13.1629C16.6233 13.1001 16.7858 13.0678 16.95 13.0678C17.1142 13.0678 17.2768 13.1001 17.4284 13.1629C17.5801 13.2258 17.7179 13.3179 17.834 13.434L20 15.601V5.5H12C11.7348 5.5 11.4804 5.39464 11.2929 5.20711C11.1054 5.01957 11 4.76522 11 4.5C11 4.23478 11.1054 3.98043 11.2929 3.79289C11.4804 3.60536 11.7348 3.5 12 3.5H20Z"
                      fill="black"
                    />
                  </svg>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full text-white hover:bg-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </button>
            </div>
            {selectedFile && (
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={imageUploadMutation.isPending}
              >
                {imageUploadMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Upload
              </Button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </FormItem>

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Full Name"
                {...field}
                className={cn(field.value && "bg-blue-100")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us a bit about yourself"
                {...field}
                rows={4}
                className={cn(field.value && "bg-blue-100")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="button" onClick={onNext} className="w-full">
        {isLastStep ? "Submit" : "Next"}
      </Button>
    </div>
  );
}
