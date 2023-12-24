import { createCommentSchema } from "../../schemas/post"
import { protectedProcedure } from "../../trpc"



export const createCommentController = protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
        const { prisma, auth } = ctx
        const { postId, comment } = input

        const  newComment = await prisma.comment.create({
            data: {
                postId,
                text: comment,
                userId: auth.userId
            }
        })

        return newComment;

})
