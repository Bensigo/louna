import { z } from "zod"

export const ById = z.object({
    id: z.string(),
})

export const ListPartnersSchema = z.object({
    limit: z.number().default(50),
    page: z.number().default(0),
    filters: z.object({
        userType: z.enum(["USER", "INSTRUCTOR"]).optional(),
        isActivated: z.enum(["true", "false"]).optional(),
        search: z.string().optional()
    }),
})
