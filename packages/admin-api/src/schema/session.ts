import { z } from "zod";
import { ListSchemaBase } from "./shared";


export const CreateSessionSchema = z.object({
    title: z.string().min(5),
    addressId: z.string(),
    point: z.number().min(1),
    capacity: z.number().min(1),
    startTime: z.string(),
    endTime: z.string(),
    category:   z.enum(["Fitness", "Wellness"]),
    tags: z.array(z.string()).min(1),
    isPublish : z.enum(['publish', 'unpublish']),
    partnerId: z.string()

})


export const ListSessionSchema = ListSchemaBase.extend({
    filter: z.object({
        search: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        status: z.enum(['Published', 'Unpublished', 'All']).default('All'),
        category:   z.enum(["Fitness", "Wellness", "All"]).default('All'),
    }).optional()
})


export const UpdateSessionSchema = CreateSessionSchema.extend({
    id: z.string()

})