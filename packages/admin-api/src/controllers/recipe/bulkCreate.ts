import { BulkUploadRecipeSchema } from "../../schema/recipe";
import { publicProcedure } from "../../trpc";



export const bulkCreateRecipeController = publicProcedure.input(BulkUploadRecipeSchema).mutation(async ({ctx, input}) => {
    const { prisma } = ctx;
    

    const recipes = await prisma.recipe.createMany({
        data: input
    })

    return recipes;
})