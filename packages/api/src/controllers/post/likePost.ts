import { likePostSchema } from "../../schemas/post";
import { protectedProcedure } from "../../trpc";



export const likePostController = protectedProcedure.input(likePostSchema).mutation(async ({ ctx, input}) => {
    const { postId } = input;
    const { auth, prisma } = ctx;

    const like = await prisma.like.findFirst({ where: { postId, userId: auth.userId, isDeleted: false  }})
    if (!like){
        const currentLike = await prisma.like.create({
            data: {
                postId,
                userId: auth.userId,
                isDeleted: false
            }
        })
        return currentLike
    }

    const update = await prisma.like.update({
        where: {
            id: like.id,
        },
        data: {
            isDeleted: true
        }
    })
    return update;

})