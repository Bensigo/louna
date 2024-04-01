import { GetRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


export const isBookmarkController = protectedProcedure.input(GetRecipeSchema).query(async ({ ctx, input}) => {
    const { id } =  input
    const  { auth } = ctx;
    const { userId } = auth;


    const bookmarkCount = await ctx.prisma.bookmark.count({ 
        where: {
            userId,
            recipeId: id,
            isDeleted: false
        }
    })

    return bookmarkCount === 1
})