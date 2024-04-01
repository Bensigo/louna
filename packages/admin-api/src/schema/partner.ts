import { z } from "zod";
import { ListSchemaBase } from "./shared";


export const CreatePartnerSchema = z.object({
    name: z.string().min(3),
    bio: z.string().min(50),
    category:   z.enum(["Fitness", "Wellness"]),
    images: z.array(
        z.object({
            key: z.string(),
            repo: z.string(),
        }),
    ),
    amenities: z.array(z.string()).optional(),
    phone: z.string(),
    subCategories: z.array(z.string()).min(1),
    socials: z.object(({
        name: z.enum(['Instagram', 'Twitter', 'Facebook', 'Tiktok']),
        url: z.string()
    })).array().optional()
})


export const UpdatePartnerSchema = CreatePartnerSchema.extend({
    id: z.string()
})


export const ListPartnerSchema = ListSchemaBase.extend({
    filter: z.object({
        isPublished: z.enum(['true', 'false']).optional(),
        searchTerm: z.string().optional(),
        category: z.enum(['Fitness', 'Wellness', 'All']).optional(),
    })
})