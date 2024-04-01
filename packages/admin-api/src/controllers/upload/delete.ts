import { GetImageSchema } from "../../schema/upload";
import { protectedProcedure } from "../../trpc";


export const deleteImageController = protectedProcedure.input(GetImageSchema).mutation(async ({ input, ctx }) => {
        const { key } = input
        const { prisma } = ctx


        const deleted = await prisma.file.deleteMany({
            where: {
                key
            }
        })
        return{ isDeleted: deleted.count === 1 }
})