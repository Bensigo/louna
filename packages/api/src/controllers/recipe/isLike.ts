import { GetRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


export const isLikeController = protectedProcedure.input(GetRecipeSchema).query(async ({ ctx, input}) => {
    const { id } =  input
    const  { auth } = ctx;
    const { userId } = auth;


    const likeCount = await ctx.prisma.recipeLike.count({ 
        where: {
            userId,
            recipeId: id,
            isDeleted: false
        }
    })

    return likeCount === 1
})