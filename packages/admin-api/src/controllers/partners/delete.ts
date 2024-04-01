import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";

export const deletePartnerController = protectedProcedure.input(ById).mutation(async ({input, ctx }) => {
    const { prisma } = ctx;
    const {id } = input;

    const deleted = await prisma.partner.update({
        where: {
            id
        },
        data: {
            deleted: true
        }
    })

    return !!deleted
})