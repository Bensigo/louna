import { z } from "zod";

export const GetRecipeSchema = z.object({
    id: z.string()
})


export const LikeRecipeSchema = GetRecipeSchema
export const BookmarkRecipeSchema = GetRecipeSchema


export const ListRecipeSchema = z.object({
    filter: z.object({
            limit: z.number().default(20),
            skip: z.number().optional(),
            mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
            
    }),
    searchName: z.string().optional()
})


export const ListBookmarkSchema = z.object({
    limit: z.number().default(20),
    page: z.number().default(1),
})