import { TRPCError } from "@trpc/server";
import { CreditSystem } from "../../resources/creditSystem";
import { CreatePaymentSchema } from "../../schemas/pyament";
import { protectedProcedure } from "../../trpc";

import { v4 as uuidV4 }  from 'uuid'



const reason = {
    topUp : 'Account topup',
    subscription: 'Subscription plan'
}

type ValidTopUpCode = 100 | 250 | 400

type validSubscriptionPlan = 499 | 799 | 1299


const validSubscriptionPackages = {
    499 : {
        amount: 499.00,
        type: 'basic'
    },
    799: {
        amount: 749.00, 
        type: 'premium'
    },
    1299: {
        amount: 1249.00 ,
        type: 'steller'
    }
}

const validTopupPackages = {
    100 : {
        amount: 100.00,
        type: 'basic'
    },
    250: {
        amount: 250.00, 
        type: 'premium'
    },
    400: {
        amount: 400.00 ,
        type: 'steller'
    }
}

export const makePaymentController = protectedProcedure.input(CreatePaymentSchema).mutation( async ({ctx, input}) => {
    const { paymentMethod, amount, subscriptionType } = input

    const { prisma, auth } = ctx;
    const userId = auth.userId;

  
    const isTopup  = subscriptionType === 'TopUp';
    const isSubscription = subscriptionType != 'TopUp'
   

    // check is valid with the availbe packages 
    if (isTopup){
       
          const isValidTop = typeof validTopupPackages[amount as ValidTopUpCode].amount  === 'number'

          if (!isValidTop){
            throw new TRPCError({
                message: 'Invalid top up',
                code: 'BAD_REQUEST'
            })
          }

    }

    if (isSubscription){
        const isValidPlan = typeof validSubscriptionPackages[amount as validSubscriptionPlan].amount === 'number'

        if (!isValidPlan){
          throw new TRPCError({
              message: 'Invalid subscription plan',
              code: 'BAD_REQUEST'
          })
        }
    }

    const points = CreditSystem.convertAmountToPoint(amount, subscriptionType);
    const paymentReason = isTopup ? reason['topUp'] : reason['subscription']
    const paymentId = uuidV4()
    
    let createdPayment;

    try {
        await prisma.$transaction(async (prisma) => {
            // Create payment
            createdPayment = await prisma.payment.create({
                data: {
                    reasonLogs: [paymentReason],
                    paymentId,
                    paymentMethod,
                    amount,
                    points,
                    userId
                }
            });

            // Create payment log
            await prisma.paymentLog.create({
                data: {
                    paymentId,
                    status: 'pending' ,
                    metadata: {}
                }
            });
        });
    } catch (error) {
        throw new TRPCError({
            message: 'Failed to make payment',
            code: 'INTERNAL_SERVER_ERROR',
        
        });
    }

    return createdPayment;
    
})


