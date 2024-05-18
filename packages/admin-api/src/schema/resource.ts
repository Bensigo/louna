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

    url: z.string().optional(),
    contentType: z.enum(["Link", "Video"]),
    title: z.string(),
    image: z.object({
        key: z.string(),
        repo: z.string(),
    }),
    tags: z.array(z.string()),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
})


export const UpdateResource = ResourceSchema.extend({
    id: z.string()
})


export const ResourceById = ById



export const PublishResource = z.object({
    type: z.enum([ 'unPublish', 'Publish']),
    ids: z.array(z.string())
})
