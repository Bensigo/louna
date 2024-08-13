import { z } from "zod";

export const CreateProfileSchema = z.object({
    username: z.string(),
    age: z.date(),
    height: z.string(),
    weight: z.string(),
    intrest: z.array(z.string()),
    isHealthKitAuthorize: z.boolean()
});

export const UpdatePrefSchema = z.object({
    age: z.date().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    intrest: z.array(z.string()).optional(),
    isHealthKitAuthorize: z.boolean().optional()
});

export const GetProfileSchema = z.object({
    userId: z.string()
});