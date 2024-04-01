import { z } from "zod";


export const CreateSessionSchema = z.object({
    title: z.string().min(5),
    addressId: z.string(),
    point: z.number().min(1),
    capacity: z.number().min(1),
    partnerId: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    category:   z.enum(["Fitness", "Wellness"]),
    isPublish:   z.enum(["publish", "unpublish"]),
    tags: z.array(z.string()).min(1),
})