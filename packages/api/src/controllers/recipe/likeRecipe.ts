import { TRPCError } from "@trpc/server";
import { LikeRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


export const likeRecipeController = protectedProcedure.input(LikeRecipeSchema).query(async ({ ctx, input}) => {
    const { auth, prisma } = ctx

    const recipe = await prisma.recipe.findFirst({
        where: {
            id: input.id
        },
        include: {
            likes: {
                where: {
                    userId: auth.userId,
                    isDeleted: false
                }
            }
        }
    })

    if (!recipe){
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'recipe not found'
        })
    }

    if (recipe.likes){
        // unlike recipe
        await prisma.recipeLike.update({
            where: {
                id: recipe.likes[0]?.id
               
            },
            data: {
                isDeleted: true
            }
        })
    }

    // create a new like 
    const like = await prisma.recipeLike.create({
        data: {
            recipeId: recipe.id,
            userId: auth.userId,

        }
    })
    return like;
})
