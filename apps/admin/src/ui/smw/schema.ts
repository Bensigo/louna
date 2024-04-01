import { z } from "zod";


export const CreateSMWFormSchema = z.object({
    title: z.string(),
    description: z.string(),
    video: z.object({
        key: z.string(),
        repo: z.string()
    }),
    thumbnail: z.object({
        key: z.string(),
        repo: z.string()
    }),
    subCategories: z.array(z.string()),
    category: z.enum(['Fitness', 'Wellness']),
    instructorId: z.string(),
    contentType: z.enum(['Freemium', 'Premium'])
})

export type CreateSMWFormSchemaType = z.infer<typeof CreateSMWFormSchema>