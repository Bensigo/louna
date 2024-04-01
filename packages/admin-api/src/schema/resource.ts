import { z } from "zod";
import { ById } from "../../../api/src/schemas/common/base";


export const ListResourceSchema = z.object({
    filter: z.object({
            limit: z.number().default(20),
            page: z.number().default(1),
            type: z.enum([ 'unPublish', 'Publish', 'all']),
            
    }),
    searchTerm: z.string().optional()
})


export const ResourceSchema = z.object({
    title: z.string(),
    url: z.string(),
    image: z.object({
        key: z.string(),
        repo: z.string()
    }),
    tags: z.array(z.string())
})


export const UpdateResource = ResourceSchema.extend({
    id: z.string()
})


export const ResourceById = ById



export const PublishResource = z.object({
    type: z.enum([ 'unPublish', 'Publish']),
    ids: z.array(z.string())
})
