import { TRPCError } from "@trpc/server";
import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";


export const UpdatePaymentStatusControlller = protectedProcedure.input(ById.extend({
    status: z.enum(['pending', 'success', 'failed', 'decline', 'expired'])
})).mutation(async({ ctx, input}) => {

    const { id, status } = input;
    const { prisma, auth } = ctx;
    const { userId } = auth;

    const allowedStatus = ['pending', 'success', 'failed', 'decline', 'expired'];

    // Ensure that the provided status is one of the allowed values
    if (!allowedStatus.includes(status)) {
        throw new TRPCError({
            message: 'Invalid payment status provided',
            code: 'BAD_REQUEST'
        });
    }



    const payment = await prisma.payment.findFirst({
        where: {
            id,
            userId
        },
        include: {
         logs: {
            orderBy: {
                timestamp: 'asc'
            }
         } 
        },
      
    });



    if (!payment){
        throw new TRPCError({
            message: 'Payment info not found',
            code: 'NOT_FOUND'
        });
    }

    const isValidSataus =  payment.logs[0]?.status  === status

    if (!isValidSataus){
        throw new TRPCError({
            message: 'Invalid Payment payment status',
            code: 'NOT_FOUND'
        });
    }

    // Perform additional checks or validations here based on your application's logic

    // Update the payment status
    const updatedPayment = await prisma.payment.update({
        where: {
            id
        },
        data: {
            status
        }
    });

    return updatedPayment;
})