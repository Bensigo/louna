import { ListBookmarkSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";


const listBookmarkController = protectedProcedure.input(ListBookmarkSchema).query(async ({ ctx, input }) => {
    const { prisma, auth } = ctx;

    const userId = auth.userId;


    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userId,
            isDeleted: false
        },
        include: {
            recipe: true
        },
        take: input.limit,
        skip: input.skip
    })
    return bookmarks;
})

export { listBookmarkController }