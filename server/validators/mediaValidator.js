import { z } from "zod";

export const MediaSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.enum(["Movie", "TVshow"], { required_error: "Type is required" }),
  director: z.string().trim().min(1, "Director is required"),
  duration: z.string().trim(),
  budget: z.string().trim().min(1, "Budget is required"),
  location: z.string().trim().min(1, "Location is required"),
  year: z.string().trim().min(4, "Year is required"),
  userId: z.coerce.number().int().positive("User ID must be a positive number"),
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
