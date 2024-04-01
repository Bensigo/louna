import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const getSmwController = protectedProcedure.input(ById).query( async ({ ctx, input })=> {

    const { prisma } = ctx;
    const { id } = input;

    const smw = prisma.sMW.findFirst({
        where: {
            id
        },
        include: {
            instructor: true
        }
    })
    return smw
})