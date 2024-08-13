import { z } from "zod";

export const updateProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email().optional(),
});

export const deleteProfileSchema = z.object({
  id: z.string().uuid(),
});
