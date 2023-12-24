import { getPostSchema } from "../../schemas/post";
import { protectedProcedure } from "../../trpc";


export const  getPostController = protectedProcedure.input(getPostSchema).query(async ({ ctx, input }) => {
    const { id } = input;
    const { prisma } = ctx;

    const post = await prisma.post.findUnique({
        where: {
            id
        },
        include: {
            Comments: true,
            likes: true,
            user: true
        }
    });
    return post;
})

