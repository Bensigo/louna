import type { Post } from "@solu/db";
import { createPostSchema } from "../../schemas/post";
import { protectedProcedure } from "../../trpc";


export const createPostController = protectedProcedure.input(createPostSchema).mutation(async ({ input, ctx }) => {
    const { prisma, auth } = ctx;
    const { text,   } = input;
    const userId = auth.userId;

    let post: Post;

    if (text){
         post = await prisma.post.create({
            data: {
                text,
                type: 'TEXT',
                userId,
            }
        })
    }else {
        // upload image to cloud
        post = await prisma.post.create({
            data: {
                mediaUri: '',
                type: 'MEDIA',
                userId,
            }
        })
    }


    return post;
    
})