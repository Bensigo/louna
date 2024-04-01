import { BookmarkRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


export const bookmarkRecipeController = protectedProcedure.input(BookmarkRecipeSchema).mutation(async ({ ctx, input}) => {
    const { auth, prisma } = ctx
    const { id } = input

    const recipe = await prisma.recipe.findFirst({
        where: {
            id: id,
            bookmarks: {
                some: {
                    userId: auth.userId,
                    isDeleted: false 
                }
            }
        },
        include: {
            bookmarks: true
        }
      
    })

    if (recipe?.bookmarks){
        // unlike recipe
       const update =   await prisma.bookmark.updateMany({
            where: {
                recipeId: id,
                isDeleted: false,
                userId: auth.userId
            },
            data: {
                isDeleted: true
            }
        })
        return update;
    }

    const newBookmark = await prisma.bookmark.create({
        data: {
            recipeId: id,
            userId: auth.userId,
        }
    })

    return newBookmark;
})
