import { z } from "zod";



export const ListSchemaBase = z.object({
    limit: z.number().default(20),
    page: z.number().default(1),
})


export const ById = z.object({
    id: z.string()
})

export const ByIds = z.object({
    ids: z.array(z.string())
})
