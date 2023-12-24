import { TRPCError } from "@trpc/server";
import { BookmarkRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


export const bookmarkRecipeController = protectedProcedure.input(BookmarkRecipeSchema).query(async ({ ctx, input}) => {
    const { auth, prisma } = ctx

    const recipe = await prisma.recipe.findFirst({
        where: {
            id: input.id
        },
        include: {
            bookmarks: {
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

    if (recipe.bookmarks){
        // unlike recipe
        await prisma.bookmark.update({
            where: {
                id: recipe.bookmarks[0]?.id
               
            },
            data: {
                isDeleted: true
            }
        })
    }

    // create a new like 
    const newBookmark = await prisma.bookmark.create({
        data: {
            recipeId: recipe.id,
            userId: auth.userId,
        }
    })
    return newBookmark;
})
