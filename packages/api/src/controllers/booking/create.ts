import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { isBefore , addHours} from 'date-fns'

export const createBookingController = protectedProcedure.input(ById).mutation(async ({ input, ctx}) => {
   const { id } = input;
   console.log({ id }, 'yyyyyyy')
   const { prisma, auth } = ctx;

   const { userId } = auth;

   const session  = await prisma.session.findFirst({
       where: {
          id
       }
   })

   if (!session){
    throw new TRPCError({
        message: 'Session does not exists',
        code: 'NOT_FOUND'
    })
   }


   // check if user alredy have a booking if exiting booking thow an error
   const exitingBooking = await prisma.booking.findFirst({
     where: {
        sessionId: id,
        userId
     }
   })


  

   if (exitingBooking ){
    throw new TRPCError({
        message: 'Booking already exists for this session',
        code: 'BAD_REQUEST'
    })
   }




   // check if user have valid points
   const walletEligibleCount = await prisma.wallet.count({
      where: {
         userId,
         point: {
            gt: session?.point
         }
      }
   });

   if (walletEligibleCount === 0){
    throw new TRPCError({
        message: 'invalid wallet credit',
        code: 'BAD_REQUEST'
    })
   }
      

   let currentTime = new Date()
   currentTime = addHours(currentTime, 1)

   const isValidTime = isBefore(currentTime, session.startTime)

   if (!isValidTime){
    throw new TRPCError({
        message: 'Invalid time',
        code: 'BAD_REQUEST'
    })
   }

   

   const newBooking = await prisma.booking.create({
    data: {
        userId,
        sessionId: session.id,
        points: session.point,
        isCanceled: false,
       
    }
   })

   await prisma.session.update({
    where: {
        id: session.id
    },
    data: {
        capacity: {
            decrement: 1
        }
    }
   })

     // Update user's wallet by deducting points
     await prisma.wallet.update({
        where: {
           userId
        },
        data: {
           point: {
              decrement: session.point
           },
           logs: {
            create: {
                point: session.point,
                type: "Debit",
                reasons: [`Paid for ${session.id} session`]
            }
        }
        }
     });

    return newBooking;
})
