"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { TalentProfile } from "@/lib/types/profile";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BestWorkUpload } from "@/components/BestWorkUpload";
import { cn } from "@/lib/utils";

type ProfileData = Omit<Partial<TalentProfile>, "skills"> & { skills?: string };

export default function MyProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPortfolioFile, setSelectedPortfolioFile] =
    useState<File | null>(null);

  const { data: profile, isLoading } = useQuery<TalentProfile>({
    queryKey: ["talent-profile", user?.id],
    queryFn: () => api("/talent/me"),
    enabled: !!user,
  });

  const [profileData, setProfileData] = useState<ProfileData>({});

  useEffect(() => {
    if (profile) {
      console.log("Fetched profile data on my-profile page:", profile);
      setProfileData({
        ...profile,
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
      });
    }
  }, [profile]);

  const profileUpdateMutation = useMutation({
    mutationFn: (updatedProfile: ProfileData) => {
      const payload = {
        ...updatedProfile,
        skills:
          typeof updatedProfile.skills === "string"
            ? updatedProfile.skills.split(",").map((s) => s.trim())
            : profile?.skills,
      };
      return api("/talent/me", {
        method: "PATCH",
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-profile", user?.id] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api("/talent/profile-image", {
        method: "PATCH",
        body: formData,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["talent-profile", user?.id], data);
      toast({
        title: "Profile Image Updated",
        description: "Your new profile image is now live.",
      });
      setSelectedFile(null);
      setImagePreview(null);
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const portfolioUploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api("/talent/portfolio", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-profile", user?.id] });
      toast({
        title: "Portfolio Item Uploaded",
        description: "Your new portfolio item has been added.",
      });
      setSelectedPortfolioFile(null);
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

  const portfolioDeleteMutation = useMutation({
    mutationFn: (id: string) => {
      return api(`/talent/portfolio/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-profile", user?.id] });
      toast({
        title: "Portfolio Item Deleted",
        description: "The portfolio item has been removed.",
      });
    },
    onError: (error) => {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item. Please try again.",
        variant: "destructive",
      });
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

  const handlePortfolioFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPortfolioFile(file);
    }
  };

  const handlePortfolioUpload = () => {
    if (selectedPortfolioFile) {
      portfolioUploadMutation.mutate(selectedPortfolioFile);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      links: { ...prev.links, [id]: value },
    }));
  };

  const handleAvailabilityChange = (
    value: "full_time" | "part_time" | "freelance",
  ) => {
    if (isEditing) {
      setProfileData((prev) => ({ ...prev, availability: value }));
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredProfileData = Object.entries(profileData).reduce(
      (acc, [key, value]) => {
        (acc as any)[key] = value;
        return acc;
      },
      {} as ProfileData,
    );

    if (filteredProfileData.links) {
      const filteredLinks = Object.entries(filteredProfileData.links).reduce(
        (acc, [key, value]) => {
          (acc as any)[key] = value;
          return acc;
        },
        {} as { [key: string]: string },
      );

      (filteredProfileData as any).links = filteredLinks;
    }

    delete (filteredProfileData as any).portfolioItems;
    delete (filteredProfileData as any).gallery;

    console.log("Data being sent to server:", filteredProfileData);
    profileUpdateMutation.mutate(filteredProfileData);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <form onSubmit={handleSaveChanges}>
        {/* Basic Info Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-medium text-black font-geist">
              Basic Info
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!isEditing || profileUpdateMutation.isPending}
                className="px-3.5 py-3.5 border border-gray-200 rounded-3xl bg-white text-black font-geist text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {profileUpdateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2.5 px-3.5 py-3.5 rounded-3xl bg-black text-white font-geist text-base font-medium hover:bg-gray-900 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit"}
                {!isEditing && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_edit)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.4207 2.60608C13.0456 2.23114 12.537 2.02051 12.0067 2.02051C11.4764 2.02051 10.9677 2.23114 10.5927 2.60608L10.1214 3.07808L13.4214 6.37808L13.892 5.90675C14.0778 5.72103 14.2251 5.50053 14.3256 5.25786C14.4262 5.01519 14.4779 4.75509 14.4779 4.49241C14.4779 4.22974 14.4262 3.96964 14.3256 3.72697C14.2251 3.4843 14.0778 3.2638 13.892 3.07808L13.4207 2.60608ZM12.478 7.32075L9.17802 4.02075L3.11802 10.0814C2.98541 10.214 2.89277 10.3813 2.85068 10.5641L2.16468 13.5341C2.13912 13.6443 2.14206 13.7593 2.1732 13.8681C2.20435 13.9769 2.26269 14.076 2.34272 14.156C2.42276 14.2361 2.52185 14.2944 2.63066 14.3256C2.73947 14.3567 2.85442 14.3596 2.96468 14.3341L5.93535 13.6487C6.11789 13.6065 6.2849 13.5139 6.41735 13.3814L12.478 7.32075Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_edit">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="text-base font-medium text-gray-500 font-geist">
            Setup your profile for this workspace
          </p>

          <div className="max-w-2xl space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : profileData.profileImageUrl ? (
                    <img
                      src={profileData.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
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
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full text-white hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
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
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {isEditing && selectedFile && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={imageUploadMutation.isPending}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  {imageUploadMutation.isPending
                    ? "Uploading..."
                    : "Upload Photo"}
                </button>
              )}
            </div>

            {/* Full Name */}
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={profileData.fullName || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.fullName && "bg-blue-100")}
            />

            {/* Short Bio */}
            <textarea
              id="bio"
              placeholder="Short Bio"
              value={profileData.bio || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className={cn("w-full p-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.bio && "bg-blue-100")}
            />
          </div>
        </div>

        {/* Skills & Experience Section */}
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-medium text-black font-geist">
            Skills & Experience
          </h2>
          <p className="text-base font-medium text-gray-500 font-geist">
            Showcase your expertise and work history.
          </p>

          <div className="max-w-2xl space-y-6">
            {/* Skills */}
            <input
              id="skills"
              type="text"
              placeholder="Skills (comma-separated)"
              value={profileData.skills || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.skills && "bg-blue-100")}
            />

            {/* Job Title */}
            <input
              id="headline"
              type="text"
              placeholder="Job Title / Headline"
              value={profileData.headline || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.headline && "bg-blue-100")}
            />

            {/* Company */}
            <input
              id="company"
              type="text"
              placeholder="Company"
              value={profileData.company || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.company && "bg-blue-100")}
            />

            {/* Duration */}
            <input
              id="duration"
              type="text"
              placeholder="Duration (e.g., 2023 - Present)"
              value={profileData.duration || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.duration && "bg-blue-100")}
            />

            {/* Work Experience Dropdown */}
            <div className="relative">
              <select
                id="workExperience"
                value={profileData.workExperience || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none disabled:opacity-50", profileData.workExperience && "bg-blue-100")}
              >
                <option value="">Work Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            {/* Description */}
            <textarea
              id="description"
              placeholder="Description of your experience"
              value={profileData.description || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className={cn("w-full p-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.description && "bg-blue-100")}
            />
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-medium text-black font-geist">
            Portfolio
          </h2>
          <p className="text-base font-medium text-gray-500 font-geist">
            Manage your portfolio items.
          </p>

          <div className="max-w-2xl space-y-4">
            {profile?.portfolioItems && profile.portfolioItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Uploaded Items:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {profile.portfolioItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.key ? item.key.split("/").pop() : "Untitled"}
                      </a>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() =>
                            portfolioDeleteMutation.mutate(item.id)
                          }
                          disabled={portfolioDeleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isEditing && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    ref={portfolioFileInputRef}
                    onChange={handlePortfolioFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => portfolioFileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-6 py-9 px-0 border border-dashed border-black rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
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
                      <span className="text-sm font-medium text-black font-geist">
                        {selectedPortfolioFile
                          ? selectedPortfolioFile.name
                          : "Click to upload Portfolio"}
                      </span>
                    </div>
                  </button>
                </div>
                {selectedPortfolioFile && (
                  <button
                    type="button"
                    onClick={handlePortfolioUpload}
                    disabled={portfolioUploadMutation.isPending}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    {portfolioUploadMutation.isPending
                      ? "Uploading..."
                      : "Upload Portfolio Item"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-medium text-black font-geist">
            Availability & Location
          </h2>
          <p className="text-base font-medium text-gray-500 font-geist">
            Let others know where you are and your availability.
          </p>

          <div className="max-w-2xl space-y-6">
            {/* Location */}
            <input
              id="location"
              type="text"
              placeholder="Location (e.g., Lagos, Nigeria)"
              value={profileData.location || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.location && "bg-blue-100")}
            />

            {/* GitHub Link */}
            <input
              id="github"
              type="text"
              placeholder="GitHub URL"
              value={profileData.links?.github || ""}
              onChange={handleLinksChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.links?.github && "bg-blue-100")}
            />
            {/* LinkedIn Link */}
            <input
              id="linkedin"
              type="text"
              placeholder="LinkedIn URL"
              value={profileData.links?.linkedin || ""}
              onChange={handleLinksChange}
              disabled={!isEditing}
              className={cn("w-full h-12 px-3.5 border border-gray-300 rounded-3xl bg-white text-gray-500 placeholder-gray-500 font-geist text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50", profileData.links?.linkedin && "bg-blue-100")}
            />
            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-950 font-geist">
                Availability
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAvailabilityChange("full_time")}
                    disabled={!isEditing}
                    className="w-4.5 h-4.5 rounded-full border border-gray-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  >
                    {profileData.availability === "full_time" && (
                      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    )}
                  </button>
                  <label
                    onClick={() => handleAvailabilityChange("full_time")}
                    className={`text-base font-medium text-gray-500 font-geist ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                  >
                    Full Time
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAvailabilityChange("part_time")}
                    disabled={!isEditing}
                    className="w-4.5 h-4.5 rounded-full border border-gray-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  >
                    {profileData.availability === "part_time" && (
                      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    )}
                  </button>
                  <label
                    onClick={() => handleAvailabilityChange("part_time")}
                    className={`text-base font-medium text-gray-500 font-geist ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                  >
                    Part Time
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAvailabilityChange("freelance")}
                    disabled={!isEditing}
                    className="w-4.5 h-4.5 rounded-full border border-gray-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  >
                    {profileData.availability === "freelance" && (
                      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                    )}
                  </button>
                  <label
                    onClick={() => handleAvailabilityChange("freelance")}
                    className={`text-base font-medium text-gray-500 font-geist ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                  >
                    Contract
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BestWorkUpload isEditing={isEditing} profile={profile} />

        <div className="max-w-2xl mt-8">
          <button
            type="submit"
            disabled={!isEditing || profileUpdateMutation.isPending}
            className="w-full py-3.5 bg-black text-white rounded-3xl font-geist text-base font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {profileUpdateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}