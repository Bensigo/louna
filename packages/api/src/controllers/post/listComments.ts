import { listCommentSchema } from "../../schemas/post"
import { protectedProcedure } from "../../trpc"

export const listCommentController = protectedProcedure
    .input(listCommentSchema)
    .query(async ({ ctx, input }) => {

        const { skip, limit, postId } = input;
        const comments = await ctx.prisma.comment.findMany({
            where: {
                postId
            },
            take: limit,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        })
        return comments;
    })
