import { z } from 'zod';

export const CreateHealthDataSchema = z.object({
    type: z.enum(['STEPS', 'HEART_RATE', 'HRV', 'CALORIES']),
    value: z.number(),
    id: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    unit: z.string().optional(), // Optional field
});


export const CreateHealthSamples = z.object({
    new: z.array(CreateHealthDataSchema).optional(),
})


export const DeletedFromDbSchema = z.array(z.string())





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
