import { ValidateFileUploadSchema } from "../../schema/upload"
import { protectedProcedure } from "../../trpc"

export const validateFileUploadController = protectedProcedure
    .input(ValidateFileUploadSchema)
    .mutation(async ({ ctx, input }) => {
        const updates = await ctx.prisma.file.updateMany({
            where: {
                baseId: input.id
            },
            data: {
                isValid: true
            }
        })

        return updates;
    })
