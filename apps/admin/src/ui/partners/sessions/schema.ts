import { z } from "zod";

/**
 * title
 * address
 * point
 * startTime, endTime
 * capacity
 * date
 * description,
 * category
 * sub category
 */

export const CreateSessionSchema = z.object({
    title: z.string().min(5),
    addressId: z.string(),
    point: z.number().min(1),
    capacity: z.number().min(1),
    startTime: z.string(),
    endTime: z.string(),
    category:   z.enum(["Fitness", "Wellness"]),
    subCategories: z.array(z.string()).min(1),
    description: z.string().min(20)
})