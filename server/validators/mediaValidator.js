import { z } from "zod";

export const addMediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  director: z.string().min(1, "Director is required"),
  duration: z.string().min(1, "Duration is required"),
  budget: z.string().min(1, "Budget is required"),
  location: z.string().min(1, "Location is required"),
  year: z.string().min(1, "Year is required"),
  userId: z.number().int().positive("User ID must be a positive integer"),
  posterUrl: z
    .string()
    .url("Poster URL must be a valid URL")
    .min(1, "Poster URL is required"),
});
export const updateMediaSchema = z.object({
  mediaId: z.number().int(),
  title: z.string().min(1).optional(),
  type: z.enum(["Movie", "TVshow"]).optional(),
  director: z.string().min(1).optional(),
  budget: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  year: z.string().min(4).optional(),
  posterUrl: z.string().url().optional(),
});
export const getMediaByIdSchema = z.object({
  mediaId: z.coerce
    .number()
    .int()
    .positive("Media ID must be a positive integer"),
});

export const deleteMediaSchema = z.object({
  mediaId: z.coerce.number().int().positive("Invalid Media ID"),
});
