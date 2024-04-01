import { z } from "zod";




export const ListSchemaBase = z.object({
    searchName: z.string().optional(),
    limit: z.number().default(20),
    page: z.number().default(1),
})


export const ById = z.object({
    id: z.string()
})