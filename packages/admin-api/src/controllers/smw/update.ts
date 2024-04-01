

import { TRPCError } from "@trpc/server";
import { UpdateSMWSchema } from "../../schema/smw";
import { protectedProcedure } from "../../trpc";
import { InstructorCategory } from "@solu/db";


export const updateSmwController = protectedProcedure.input(UpdateSMWSchema).mutation(async ({ ctx, input }) => {

    const { id, thumbnail, video, instructorId, title, description, category, subCategories, contentType } = input;
    const { prisma} = ctx;

    const instrutor = await prisma.instrutor.findFirst({
        where: {
            id: instructorId
        }
    })

    if (!instrutor){
        throw new TRPCError({
            message: "instrutor not found",
            code: "NOT_FOUND",
        })
    }

    const imageCount = await ctx.prisma.file.count({
        where: { key: {
            in: [thumbnail.key, video.key]
        }},
    })
    const isValidMedia = imageCount === 2

    if (!isValidMedia) {
        throw new TRPCError({
            message: "invalid media",
            code: "BAD_REQUEST",
        })
    }
  

    const smw = await prisma.sMW.update({
        where: {
            id
        },
        data: {
            subCategories,
            thumbnailKey: thumbnail.key,
            thumbnailRepo: thumbnail.repo, 
            videoKey: video.key,
            videoRepo: video.repo,
            category,
            title,
            description,
            instructorId,
            contentType
        }
    })
    return smw;
}) 