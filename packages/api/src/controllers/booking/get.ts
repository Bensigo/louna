import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";


export const getBookingController = protectedProcedure.input(ById).query(async({ ctx, input }) => {
    const { id } = input
    const { prisma, auth } = ctx;
    const { userId } = auth;

    const booking = await prisma.booking.findFirst({
        where: {
            id,
            userId, 
            isCanceled: false
        },
        include: {
            session: {
                include: {
                    partner: {
                        include: {
                            addresses: true
                        }
                    }
                }
            }
        }
    })

    return booking;
})