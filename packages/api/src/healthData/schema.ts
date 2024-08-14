import { z } from 'zod';

export const CreateHealthDataSchema = z.object({
    type: z.enum(['STEPS', 'HEART_RATE', 'HRV', 'CALORIES']),
    value: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    unit: z.string().optional(), // Optional field
});