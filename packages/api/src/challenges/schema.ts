import { z } from "zod";

export const createChallengeSchema = z.object({
  name: z.string(),
  description: z.string(),
  capacity: z.string().optional(),
  visibility: z.enum(["Public", "Private"]),
  startDateTime: z.date(),
  endDateTime: z.date().optional(),
  locationName: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  activities: z.array(z.string()),
});

export const listChallengeSchema = z
  .object({
    id: z.string().optional(),
    activities: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    hasJoined: z.boolean().optional(),
    endDate: z.string().optional(),
    isUpcoming: z.boolean().optional(),
    skip: z.number().optional().default(0),
    limit: z.number().optional().default(50),
  })
  .partial();

export const updateChallengeSchema = z.object({
  id: z.string(),
  startDateTime: z.date().optional(),
  endDateTime: z.date().optional(),
  locationName: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

// Schema for joining a challenge
export const joinChallengeSchema = z.object({
  challengeId: z.string(),
});
