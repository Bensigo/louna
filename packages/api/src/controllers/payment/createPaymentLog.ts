import { z } from "zod";
import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";


export const CreatePaymentLogsControlller = protectedProcedure.input(ById.extend({
    status: z.enum([ 'success', 'failed', 'decline', 'expired']),
    metadata: z.any()
})).mutation(async({ ctx, input}) => {

    const { id, status, metadata } = input;
   const { prisma  } = ctx;
    // Check if the payment exists
    const payment = await prisma.payment.findUnique({
        where: {
            id
        }
    });

    if (!payment) {
        throw new TRPCError({
            message: 'Payment not found',
            code: 'NOT_FOUND'
        });
    }

    let createdPaymentLog;

    try {
       
            // Create payment log
            createdPaymentLog = await prisma.paymentLog.create({
                data: {
                    paymentId: id,
                    status,
                    metadata
                }
            });
    
    } catch (error) {
        throw new TRPCError({
            message: 'Failed to create payment log',
            code: 'INTERNAL_SERVER_ERROR',
  
        });
    }

    return createdPaymentLog;
})


/**
 * payment processs
 * 1. initiallize payment with pending status
 * 2. on after payment from applepay/andriod pay create payment log
 * 3. update payment status with the validated  payment  staus using payment log
 * 4. handle top up or subscription 
 */