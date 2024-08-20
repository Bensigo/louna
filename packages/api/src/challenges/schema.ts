import { z } from "zod";



export const createChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional().refine((endDate, context) => {
    const { startDate } = context.parent;
    if (startDate && endDate && endDate <= startDate) {
      return false;
    }
    return true;
  }, 'End date must be after start date'),
  type: z.enum(['MEDITATION', 'BREATHWORK', 'YOGA', 'ICE_BATH']),
  goalType: z.enum(['HRV', 'HEART_RATE', 'RESTING_HEART_RATE', 'DURATION']).optional(),
  goalValue: z.number().positive().optional(),
  baselineValue: z.number().optional(),
  isFreeSession: z.boolean().default(false),
  interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
});



export const updateChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional().refine((endDate, context) => {
    const { startDate } = context.parent;
    if (startDate && endDate && endDate < startDate) {
      return false;
    }
    return true;
  }, 'End date must be after start date'),
  type: z.enum(['MEDITATION', 'BREATHWORK', 'YOGA', 'ICE_BATH']).optional(),
  goalType: z.enum(['HRV', 'HEART_RATE', 'RESTING_HEART_RATE', 'DURATION']).optional(),
  goalValue: z.number().positive().optional(),
  baselineValue: z.number().optional(),
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
  type: z.enum(['MEDITATION', 'BREATHWORK', 'YOGA', 'ICE_BATH']).optional(),
  isFreeSession: z.boolean().optional(),
});

export const deleteChallengeSchema = z.object({
  id: z.string().uuid('Invalid challenge ID format'),
});
