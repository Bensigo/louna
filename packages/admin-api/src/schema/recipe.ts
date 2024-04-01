import { z } from "zod"
import { ListSchemaBase } from "./shared"


enum CuisineType {
    ITALIAN = "Italian",
    MEXICAN = "Mexican",
    CHINESE = "Chinese",
    INDIAN = "Indian",
    FRENCH = "French",
    JAPANESE = "Japanese",
    THAI = "Thai",
    AMERICAN = "American",
    MEDITERRANEAN = "Mediterranean",
    OTHER = "Other",
}

const cusinesType = z.enum(Object.keys(CuisineType))

export const CreateRecipeSchema = z.object({
    name: z.string().trim().min(3),
    duration: z.string().refine((data) => !isNaN(parseInt(data)), {
        message: "Please enter a valid number for duration.",
        path: ["duration"],
    }),
    contentType: z.enum(['Freemium', 'Premium']),
    calories: z.string().refine((data) => !isNaN(parseInt(data)), {
        message: "Please enter a valid number for calories.",
        path: ["calories"],
    }),
    description: z.string().trim().min(50),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
    dietType: z.enum(["Standard", "Vegan", "Paleo", "Vegetarian"]),
    steps: z.array(
        z.object({
            value: z.string(),
        }),
    ),
    nutrients: z.array(
        z.object({
            name: z.string(),
            value: z.string(),
            unit: z.enum(["g", "kcal"]),
        }),
    ),
    ingredients: z.array(
        z.object({
            name: z.string(),
            image: z.object({
                key: z.string(),
                repo: z.string(),
            }),
        }),
    ),
    images: z.array(
        z.object({
            key: z.string(),
            repo: z.string(),
        }),
    ),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    cusineType: z.enum(['ITALIAN', 'MEXICAN', 'CHINESE', 'FRENCH', 'INDIAN', 'JAPANESE', 'THAI', 'AMERICAN', 'MEDITERRANEAN', 'AFRICAN', 'OTHERS']),
    difficultyLevel: z.enum(['EASY', 'MEDIUM', 'HARD']),
})

export const RecipeByIdSchema = z.object({
    id: z.string(),
})

export const ListRecipeSchema = ListSchemaBase.extend({
    filter: z.object({
        searchName: z.string().optional(),
        mealType: z
            .array(
                z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"])
            )
            .optional(),
        isApproved: z.enum(["true", "false"]).optional(),
    }),
})


export const UpdateRecipeSchema = CreateRecipeSchema.extend({
    id: z.string()
})