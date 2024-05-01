import { TRPCError } from "@trpc/server"

import type { CuisineType, MealType, PrismaClient } from "@solu/db"

import { CreateRecipeSchema } from "../../schema/recipe"
import { protectedProcedure } from "../../trpc"

export const createRecipeController = protectedProcedure
    .input(CreateRecipeSchema)
    .mutation(async ({ input, ctx }) => {
        const { prisma } = ctx
        const {
            ingredients,
            calories,
            categories,
            name,
            duration,
            images,
            steps,
            nutrients,
            mealType,
            dietType,
            description,
            contentType,
            tags,
            cusineType,
            difficultyLevel,
            allergens,
            mealPreference
        } = input


        const isValidAllergens = ingredients.every(item => !allergens.includes(item.name));

        if (!isValidAllergens){
            throw new TRPCError({
                message: 'Invalid Recipe',
                code: "BAD_REQUEST"
            })
        }

        const imageKeys = images.map((img) => img.key)
        const ingredientImgs = ingredients.map(
            (ingredient) => ingredient.image.key,
        )
        const keys = [...imageKeys, ...ingredientImgs]
        const isImagesValid = await isValidImages(keys, prisma)

        // update valid images to isValid
        await prisma.file.updateMany({
            where: {
                key: {
                    in: keys,
                },
            },
            data: {
               isValid: true
            }
        })
        

        if (!isImagesValid) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "invalid images",
            })
        }

        const newCalorie = parseInt(calories)
        const newDuration = parseInt(duration)
        const data = {
            
                name,
                calories: newCalorie,
                contentType,
                duration: newDuration,
                steps: steps.map((step) => step.value),
                ingredients: ingredients,
                nutrients,
                mealType: mealType as MealType,
                description,
                dietType,
                categories,
                images,
                tags,
                cuisine: cusineType  as CuisineType,
                difficulty: difficultyLevel,
                mealPreference
            
        }
        const recipe = await prisma.recipe.create({
            data,
        })
        return recipe
    })

export const isValidImages = async (keys: string[], prisma: PrismaClient) => {
    try {
        const files = await prisma.file.findMany({
            where: {
                key: {
                    in: keys,
                },
            },
        })

        const filesKeys = files.map((file) => file.key)
        return (
            filesKeys.length === keys.length &&
            filesKeys.every((key) => keys.includes(key))
        )
    } catch (error) {
        console.error("Error while checking image validity:", error)
        return false // Or handle the error in an appropriate way for your use case
    }
}
