import { z } from "zod";

export const CreatePartnerSchema = z.object({
    name: z.string().min(3),
    bio: z.string().min(50),
    category:   z.enum(["Fitness", "Wellness"]),
    images: z.array(
        z.object({
            key: z.string(),
            repo: z.string(),
        }),
    ).min(3),
    amenities: z.array(z.string()).min(3),
    subCategories: z.array(z.string()).min(1),
    phone: z.string().min(10).max(13),
    socials: z.object(({
        name: z.enum(['Instagram', 'Twitter', 'Facebook', 'Tiktok']),
        url: z.string()
    })).array().optional()
})