import { TRPCError } from "@trpc/server"

import { EditInstructorSchema } from "../../schema/instructor"
import { protectedProcedure } from "../../trpc"

export const eidtInstructorController = protectedProcedure
    .input(EditInstructorSchema)
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
            id,
        } = input
        const { prisma } = ctx;

        const instructor = await prisma.instrutor.findUnique({ where: { id }}) 

        if (!instructor){
            throw new TRPCError({
                message: "instructor not found",
                code: "NOT_FOUND",
            })
        }



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
        console.log({ data })

        const update = await prisma.instrutor.update({
            where: {
                id,
            },
            data,
        })

        return update
    })
