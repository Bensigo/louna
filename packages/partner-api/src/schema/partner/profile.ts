import { z } from "zod"

export const createPartnerProfileSchema = z.object({
   bio: z.string().min(100),
   businessType: z.enum(['FITNESS', 'WELLNESS']),
   activities: z.array(z.string()).min(1).transform((arr) => arr.map(itm => itm.toLowerCase())),
   title: z.string()
})