import { TRPCError } from "@trpc/server";
import { CreateSMWSchema } from "../../schema/smw";
import { protectedProcedure } from "../../trpc";
import { InstructorCategory } from "@solu/db";


export const createSmwController = protectedProcedure.input(CreateSMWSchema).mutation(async ({ ctx, input }) => {

    const { thumbnail, video, instructorId, title, description, category, subCategories, contentType } = input;
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
    const data = {
        title,
        description,
        instructorId,
        videoKey: video.key,
        videoRepo: video.repo,
        thumbnailKey: thumbnail.key,
        thumbnailRepo: thumbnail.repo,
        category: category as InstructorCategory,
        subCategories,
        contentType

    }

    console.log({ data }, 44)

    const smw = await prisma.sMW.create({
        data: {
            subCategories,
            thumbnailKey: thumbnail.key,
            thumbnailRepo: thumbnail.repo,
            videoKey: video.key,
            videoRepo: video.repo,
            category: category === "Fitness"? InstructorCategory.Fitness : InstructorCategory.Wellness,
            title,
            description,
            instructorId
        }
    })
    return smw;
}) 