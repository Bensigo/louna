import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";


export const getSmwController = protectedProcedure.input(ById).query(async ({ input, ctx }) => {
    const { id } = input
    const  { prisma } = ctx;

    const smw = await prisma.sMW.findUnique(({
        where: {
            id
        },
        include: {
            instructor: true
        }
    }))
    return smw;
})