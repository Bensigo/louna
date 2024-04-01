import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";



export const getPartnerController = protectedProcedure.input(ById).query( async ({ ctx, input })=> {

    const { prisma } = ctx;
    const { id } = input;

    // todo: include bookings
    const partner = prisma.partner.findFirst({
        where: {
            id
        },
        include: {
           addresses: true,
           
        }
    })
    return partner
})