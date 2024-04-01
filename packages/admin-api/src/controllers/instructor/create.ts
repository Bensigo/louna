import { TRPCError } from "@trpc/server"

import { InstructorSchema } from "../../schema/instructor"
import { protectedProcedure } from "../../trpc"

export const createInstructorController = protectedProcedure
    .input(InstructorSchema)
    .mutation(async ({ input, ctx }) => {
        const {
            image,
            firstname,
            lastname,
            bio,
            category,
            isActive,
            subCategories,
            calenderUrl,
            title,
        } = input
        const { prisma } = ctx;
        const imageCount = await ctx.prisma.file.count({
            where: { key: image.key },
        })
        const isValidImage = imageCount === 1

        if (!isValidImage) {
            throw new TRPCError({
                message: "invalid Image",
                code: "BAD_REQUEST",
            })
        }

        // update image
        prisma.file.updateMany({ where: { key: image.key }, data: { isValid: true } })

        const data = {
            firstname,
            lastname,
            ...(calenderUrl?.length ? {calenderUrl}: {}),
            title,
            category,
            isActive: isActive === 'active',
            subCategories,
            bio,
            imageKey: image.key,
            repo: image.repo,
        }
       

        const instructor = await prisma.instrutor.create({
            data,
        })

        return instructor
    })
