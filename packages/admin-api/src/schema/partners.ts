import { z } from "zod";


export const ById = z.object({
    id: z.string(),
})

export const ListPartnersSchema = z.object({
    limit: z.number().default(50),
    skip: z.number().default(0)
})