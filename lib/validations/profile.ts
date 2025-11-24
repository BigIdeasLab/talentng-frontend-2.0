import * as z from "zod";

export const profileSchema = z.object({
  fullName: z // Changed from fullname
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must not exceed 100 characters."),
  profileImageUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  headline: z
    .string()
    .min(10, "Headline must be at least 10 characters.")
    .max(100, "Headline must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters.")
    .max(1000, "Bio must not exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
  skills: z.string().optional().or(z.literal("")), // was z.array(z.string())
  workExperience: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  availability: z
    .enum(["full_time", "part_time", "freelance", "unavailable"]) // "contract" is "freelance" in my-profile
    .optional(),
  location: z.string().optional().or(z.literal("")),
  links: z
    .object({
      github: z
        .string()
        .url("Invalid GitHub URL.")
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url("Invalid LinkedIn URL.")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
  portfolioItems: z.array(z.any()).optional(), // Portfolio files are optional
  gallery: z.array(z.any()).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
