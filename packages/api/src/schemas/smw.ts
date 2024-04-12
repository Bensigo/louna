import { z } from "zod";


export const ListSMWSchema = z.object({
    filter: z.object({
            limit: z.number().default(20),
            skip: z.number().optional(),
            category: z.string(),
            
    }),
    searchTerm: z.string().optional()
})