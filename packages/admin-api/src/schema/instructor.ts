import { z } from "zod";
import { ListSchemaBase } from "./shared";


export const InstructorSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    bio: z.string(),
    title: z.string(),
    isActive: z.enum(['isactive', 'active']),
    calenderUrl: z.string().optional(),
    subCategories: z.array(z.string()),
    category: z.enum(['Fitness', 'Wellness']),
    image: z.object({
        key: z.string(),
        repo: z.string()
    })
})

export const ListInstructorSchema = ListSchemaBase.extend({
    filter: z.object({
        searchName: z.string().optional(),
        category:   z.enum(["Fitness", "Wellness"]).optional(),
        isActive: z.enum(["true", "false"]).optional(),
    }),
})


export const InstructorById = z.object({
    id: z.string()
})


export const EditInstructorSchema = InstructorSchema.extend({
    id: z.string()
})