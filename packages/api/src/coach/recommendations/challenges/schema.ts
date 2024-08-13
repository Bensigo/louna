import { z } from "zod";


export const newChangellegeSchema = z.object({
    name: z.string(),
    description: z.string(),
    activity: z.string(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
})


