"use client";

import { useState } from "react";
import { X, Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createService } from "@/lib/api/talent";
import type { CreateServiceInput } from "@/lib/api/talent";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message?: string) => void;
}

const COMMON_TAGS = [
  "UI Design",
  "UX Design",
  "Web Design",
  "Mobile Design",
  "Branding",
  "Logo Design",
  "Figma",
  "React",
  "JavaScript",
  "Frontend",
  "Responsive Design",
  "Wireframing",
  "Prototyping",
  "Design Systems",
];

export function CreateServiceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    about: "",
    price: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Service title is required");
      return;
    }

    if (!formData.about.trim()) {
      setError("Service description is required");
      return;
    }

    setIsLoading(true);
    try {
      const serviceData: CreateServiceInput = {
        title: formData.title,
        about: formData.about,
        price: formData.price || undefined,
        images: images.length > 0 ? images : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      await createService(serviceData);

      setFormData({ title: "", about: "", price: "" });
      setImages([]);
      setSelectedTags([]);
      onClose();
      onSuccess?.(
        "Service created successfully! It will appear in your services list.",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create service";
      setError(errorMessage);
      console.error("Error creating service:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Create Service</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Service Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., UI/UX Design"
              disabled={isLoading}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="about" className="text-sm font-medium">
              Service Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Describe your service, what you offer, and what clients can expect..."
              disabled={isLoading}
              maxLength={2000}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm font-inter"
            />
            <p className="text-xs text-gray-500">
              {formData.about.length}/2000 characters
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price (Optional)
            </Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., Starting from $500"
              disabled={isLoading}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              Format suggestion: "Starting from $500"
            </p>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Service Images (Optional)
            </Label>
            <div className="space-y-3">
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors">
                <div className="flex flex-col items-center">
                  <Plus className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  disabled={isLoading || images.length >= 5}
                  className="hidden"
                />
              </label>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={image}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        disabled={isLoading}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                {images.length}/5 images uploaded
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags (Optional)</Label>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isLoading}
                      className="p-0 hover:bg-blue-200 rounded disabled:opacity-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
                placeholder="Type a tag and press Enter"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={() => handleAddTag(newTag)}
                disabled={isLoading || !newTag.trim()}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {/* Suggested Tags */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-medium">
                Suggested tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.filter((tag) => !selectedTags.includes(tag)).map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      disabled={isLoading}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      + {tag}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Service"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
