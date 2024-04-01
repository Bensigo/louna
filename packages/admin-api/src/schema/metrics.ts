import { z } from "zod";


export const ChartFilterSchema = z.object({
    timeRange: z.enum(['day', 'week', 'month', 'year'])
})