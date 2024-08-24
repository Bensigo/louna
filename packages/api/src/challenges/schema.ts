import { z } from "zod";


const CHALLENGE_TYPES = [
  "BREATHWORK",
  "MEDITATION",
  "YOGA",
  "SOCCER",
  "BOXING",
  "RUNNING",
  "CYCLING",
  "PILATES",
  "HIKING",
  "FASTING",
];

const GOAL_TYPES = ["STRESS_RELIEF", "DISTANCE","DURATION", "STEPS", "CALORIES_BURN"];

export const createChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  start: z.date(),
  tempId: z.string(),
  end: z.date().optional().refine((data) => {
    const { start,  end} = data;
    if (start && end && end < start) {
      return false;
    }
    return true;
  }, 'End date must be after start date').optional(),
  goalValue: z.number().positive().optional(),
  baselineValue: z.number().optional(),
  isFreeSession: z.boolean().default(false),
  goalType: z.enum(GOAL_TYPES as [string, ...string[]]),
  type: z.enum(CHALLENGE_TYPES as [string, ...string[]]),
  interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
});



export const updateChallengeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  start: z.date().optional(),
  end: z.date().optional().refine((data) => {
    const { start,  end} = data;
    if (start && end && end < start) {
      return false;
    }
    return true;
  }, 'End date must be after start date').optional(),
  goalType: z.enum(GOAL_TYPES as [string, ...string[]]),
  type: z.enum(CHALLENGE_TYPES as [string, ...string[]]),
  goalValue: z.number().positive().optional(),
  isFreeSession: z.boolean().optional(),
  interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
});

export const getChallengeSchema = z.object({
  id: z.string().uuid('Invalid challenge ID format'),
});

// Schema for joining a challenge
export const joinChallengeSchema = z.object({
  challengeId: z.string(),
});

export const listChallengesSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  type: z.enum(CHALLENGE_TYPES as [string, ...string[]]).optional(),
  isFreeSession: z.boolean().optional(),
  isJoined: z.boolean().optional()
});

export const deleteChallengeSchema = z.object({
  id: z.string().uuid('Invalid challenge ID format'),
});

export const generateImageSchema = z.object({
  tempId: z.string(),
  name: z.string()
})