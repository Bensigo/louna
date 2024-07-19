import * as z from "zod"

export const UpdateGoalSchema = z.object({
    name: z.enum(['flexibility', 'steps', 'breathing']),
    value: z.number()
})