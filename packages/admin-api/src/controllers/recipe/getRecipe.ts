import { RecipeByIdSchema } from "../../schema/recipe";
import { protectedProcedure } from "../../trpc";


export const getRecipeController = protectedProcedure.input(RecipeByIdSchema).query(async ({ input, ctx  }) => {
    const { prisma } = ctx

    const  recipe = await prisma.recipe.findFirst({
        where: {
            id: input.id
        }
    }) 
    return recipe;
})