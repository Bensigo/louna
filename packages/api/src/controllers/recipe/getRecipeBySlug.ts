import { GetRecipeBySlugSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";



export const getRecipeBySlugController = protectedProcedure.input(GetRecipeBySlugSchema).query(async ({ ctx, input}) => {
    const { prisma } = ctx;

    const recipe = await prisma.recipe.findFirst({
        where: {
            slug: input.slug
        },
        include: {
            likes: true,
            
        }
    })
    if(!recipe)return;
    return {...recipe,likeCount: recipe.likes.length }
})