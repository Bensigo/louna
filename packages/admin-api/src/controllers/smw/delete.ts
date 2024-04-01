import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const deleteSMWController = protectedProcedure.input(ById).mutation(async ({input, ctx }) => {
    const { prisma } = ctx;
    const {id } = input;

    const deleted = await prisma.sMW.update({
        where: {
            id
        },
        data: {
            deleted: true,
            isPublished: false
        }
    })

    return !!deleted
})