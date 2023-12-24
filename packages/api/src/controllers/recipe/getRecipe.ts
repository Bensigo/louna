import { GetRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";



export const getRecipeController = protectedProcedure.input(GetRecipeSchema).query(async ({ ctx, input}) => {
    const { prisma } = ctx;

    const recipe = await prisma.recipe.findFirst({
        where: {
            id: input.id
        },
        include: {
            likes: true,
            
        }
    })
    if(!recipe)return;
    return {...recipe,likeCount: recipe.likes.length }
})