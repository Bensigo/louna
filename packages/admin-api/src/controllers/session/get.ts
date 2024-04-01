import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const getSessionController = protectedProcedure.input(ById).query( async ({ ctx, input })=> {

    const { prisma } = ctx;
    const { id } = input;

    const session = prisma.session.findFirst({
        where: {
            id
        },
        include: {
            address: true,
            partner: true
        }
    })
    return session
})