import { TRPCError } from "@trpc/server"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

import type { Post } from "@solu/db"

import { createPostSchema } from "../../schemas/post"
import { protectedProcedure } from "../../trpc"

export const createPostController = protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
        const { prisma, auth } = ctx
        const { text, images, baseKey } = input
        const userId = auth.userId

        let post: Post | null = null

        if (text && !images.length) {
            // If there's only text and no images, create a text post
            post = await prisma.post.create({
                data: {
                    text,
                    type: "TEXT",
                    userId,
                },
            })
        } else if (images && baseKey && images.length) {
            const uploadedImageCount = await prisma.file.count({
                where: {
                    baseId: baseKey,
                },
            })

            const isValidImage = uploadedImageCount === images.length
            if (!isValidImage) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid message",
                })
            }

            await prisma.file.updateMany({
                where: {
                    baseId: baseKey,
                },
                data: {
                    isValid: true,
                },
            })

            const currImages = images.map((img) => {
                const [_, key] = img.split("/")
                return key
            }) as string[]
            console.log({ currImages })

            // create post
            post = await prisma.post.create({
                data: {
                    text,
                    type: "MEDIA_TEXT",
                    repo: "post",
                    files: currImages,
                    userId,
                },
            })
        }
        console.log({ post })
        return post
    })
