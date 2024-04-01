import { ListBookingSchema } from "../../schemas/bookings";
import { protectedProcedure } from "../../trpc";
import { subHours } from 'date-fns';


export const listUpcomingController = protectedProcedure.input(ListBookingSchema).query(async ({ input , ctx}) => {
    const { page, limit } = input;
    const { prisma, auth } = ctx;

    const { userId } = auth;

    // list upcoming booking that is today and  greater 
    const currentTime = new Date()
    const time = subHours(currentTime, 1) 


    const bookings = await prisma.booking.findMany({
        where: {
            userId,
            isCanceled: false,
            session: {
                startTime: {
                    gte: time
                }
            }
        },
        include: {
            session: true
        },
        orderBy: {
            session: {
                startTime: 'asc'
            }
        },
        take: limit,
        skip: (page  -1) * limit
    })

    console.log({ bookings })

    return bookings;
})