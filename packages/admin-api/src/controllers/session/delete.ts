import { ByIds } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";



export const deleteSessionController = protectedProcedure.input(ByIds).mutation(async ({input, ctx }) => {
    const { prisma } = ctx;
    const {ids} = input;

    const deleted = await prisma.session.updateMany({
        where: {
           id: {
            in: ids
           }
        },
        data: {
            deleted: true,
            isPublish: false
        }
    })

    return !!deleted
})