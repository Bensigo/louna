import { z } from "zod";



export const ResourceSchema = z.object({
    title: z.string(),
    url: z.string(),
    image: z.object({
        key: z.string(),
        repo: z.string()
    }),
    tags: z.array(z.string())
})


export type  CreateResourceFormSchemaType = z.infer<typeof ResourceSchema>