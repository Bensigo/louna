



import { z } from "zod";

export const GetTipSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  avg: z.number().min(0),
  dataType: z.enum(['HRV', 'HEART_RATE', 'ENERGY_BURNED', 'STEPS']),
  total: z.number().min(0).optional(),
}).refine(data => data.min <= data.max, {
  message: "Min must be less than or equal to max",
  path: ["min"],
}).refine(data => data.total >= data.min && data.total <= data.max, {
  message: "Total must be between min and max",
  path: ["total"],
});


export const TipAiResponseSchema =z.object({
    insight: z.string(),
    link: z.string().optional()
})
