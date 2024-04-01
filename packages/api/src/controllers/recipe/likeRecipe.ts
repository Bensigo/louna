import { LikeRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


export const likeRecipeController = protectedProcedure.input(LikeRecipeSchema).mutation(async ({ ctx, input}) => {
    const { auth, prisma } = ctx

    const recipe = await prisma.recipe.findFirst({
        where: {
            id: input.id,
            likes: {
                some: {
                    userId: auth.userId,
                    isDeleted: false 
                }
            }
        },
        include: {
            likes: true
        }
    })


    if (recipe?.likes){
        // unlike recipe
       const updated =  await prisma.recipeLike.updateMany({
            where: {
                recipeId: input.id,
                isDeleted: false,
                userId: auth.userId
            },
            data: {
                isDeleted: true
            }
        })
        return updated
    }

    // create a new like 
    const like = await prisma.recipeLike.create({
        data: {
            recipeId: input.id,
            userId: auth.userId,

        }
    })
    return like;
})
