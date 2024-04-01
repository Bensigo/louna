import { z } from "zod";
import { ListSchemaBase } from "./shared";
import { ContentType } from "@solu/db";

export const CreateSMWSchema = z.object({
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
    instructorId: z.string(),
    subCategories: z.array(z.string()),
    category: z.enum(['Fitness', 'Wellness']),
    contentType: z.enum(['Freemium', 'Premium'])
})


export const ListSMWSchema = ListSchemaBase.extend({
    filter: z.object({
        isPublished: z.enum(['true', 'false']).optional(),
        searchTerm: z.string().optional(),
        category: z.enum(['Fitness', 'Wellness', 'All']).optional(),
        contentType: z.enum([ContentType.Freemium, ContentType.Premium, 'All']).optional()
    })
})


export const UpdateSMWSchema = CreateSMWSchema.extend({
    id: z.string()
})


