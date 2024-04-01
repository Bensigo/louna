import { TRPCError } from "@trpc/server";
import { UpdateRecipeSchema } from "../../schema/recipe";
import { protectedProcedure } from "../../trpc";
import { isValidImages } from "./createRecipe";
import {type  CuisineType } from "@solu/db";


export const updateRecipeController = protectedProcedure.input(UpdateRecipeSchema).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;

    const {
        id,
        ingredients,
        calories,
        categories,
        name,
        contentType,
        duration,
        images,
        steps,
        nutrients,
        mealType,
        dietType,
        description,
        tags,
        cusineType,
        difficultyLevel
       } = input;


       console.log({ input })


       const imageKeys = images.map((img) => img.key)
       const ingredientImgs = ingredients.map((ingredient) => ingredient.image.key)
       const keys = [...imageKeys, ...ingredientImgs]
       const isImagesValid = await isValidImages(keys, prisma)
    
       if(!isImagesValid){
             throw new TRPCError({
                code:'BAD_REQUEST' ,
                message: 'invalid images'
             })
       }

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
    
       const newCalorie = parseInt(calories)
       const newDuration = parseInt(duration)

       const data = {
        name,
        calories: newCalorie,
        duration: newDuration,
        contentType,
        steps: steps.map((step) => step.value),
        ingredients: ingredients,
        nutrients,
        mealType: mealType as MealType,
        description,
        dietType,
        categories,
        images,
        tags,
        cuisine: cusineType as CuisineType,
        difficulty: difficultyLevel
    }

    console.log({ data })

       const update = await prisma.recipe.update({
        where: { id },
        data
       })

       console.log({ update })
       return update;
})