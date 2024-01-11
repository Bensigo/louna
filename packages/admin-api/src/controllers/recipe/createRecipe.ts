import type { MealType, PrismaClient } from "@solu/db";
import { CreateRecipeSchema } from "../../schema/recipe";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";




export const createRecipeController  = protectedProcedure.input(CreateRecipeSchema).mutation(async ({ input, ctx }) => {
   const {  prisma }  = ctx;
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
    description
   } = input;

   const imageKeys = images.map((img) => img.key)
   const ingredientImgs = ingredients.map((ingredient) => ingredient.image.key)

   const isImagesValid = await isValidImages([...imageKeys, ...ingredientImgs], prisma)

   if(!isImagesValid){
         throw new TRPCError({
            code:'BAD_REQUEST' ,
            message: 'invalid images'
         })
   }

   const newCalorie = parseInt(calories)
   const newDuration = parseInt(duration)

   const  recipe = await prisma.recipe.create({
     data: {
        name,
        calories: newCalorie,
        duration: newDuration,
        steps: steps.map((step) => step.value),
        ingredents: ingredients,
        nutrients,
        mealType: mealType as MealType,
        description,
        dietType,
        categories,
        images
     }
   })
   return recipe;
})



const isValidImages = async (keys: string[], prisma: PrismaClient ) => {
    try {
        const files = await prisma.file.findMany({
          where: {
            key: {
              in: keys,
            },
          },
        });
    
        const filesKeys = files.map((file) => file.key);
        return filesKeys.length === keys.length && filesKeys.every((key) => keys.includes(key));
      } catch (error) {
        console.error("Error while checking image validity:", error);
        return false; // Or handle the error in an appropriate way for your use case
      }
}