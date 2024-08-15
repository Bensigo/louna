import { z } from 'zod';

export const CreateHealthDataSchema = z.object({
    type: z.enum(['STEPS', 'HEART_RATE', 'HRV', 'CALORIES']),
    value: z.number(),
    startTime: z.date(),
    endTime: z.date(),
    unit: z.string().optional(), // Optional field
});





export const GetHealthDataSchema = z.object({
  type: z.enum(['STEPS', 'HEART_RATE', 'HRV', 'CALORIES']),
  interval: z.enum(['day', 'week', 'month', 'year']),
});

export const HealthStatsSchema = z.object({
  steps: z.number(),
  enegryBurned: z.number(),
  hrv: z.number(),
  heartRate: z.number(),
  stressLevel: z.number().nullable(),
});
