import { z } from "zod";

export const InstructorSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    bio: z.string(),
    title: z.string(),
    isActive: z.enum(['isactive', 'active']),
    calenderUrl: z.string().optional(),
    subCategories: z.array(z.string()),
    category: z.enum(['Fitness', 'Wellness']),
    image: z.object({
        key: z.string(),
        repo: z.string()
    })
})


export type InstructorType = z.infer<typeof InstructorSchema>