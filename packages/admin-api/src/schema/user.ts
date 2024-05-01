import { z } from "zod"

export const ById = z.object({
    id: z.string(),
})

export const ListUsersSchema = z.object({
    limit: z.number().default(50),
    page: z.number().default(0),
    filters: z.object({
        isSubscribe: z.boolean().optional(),
        search: z.string().optional()
    }),
})
