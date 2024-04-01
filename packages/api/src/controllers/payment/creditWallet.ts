import { TRPCError } from "@trpc/server";
import { creditSchema } from "../../schemas/pyament";
import { protectedProcedure } from "../../trpc";
import { CreditSystem } from "../../resources/creditSystem";


export const CreditWalletController = protectedProcedure.input(creditSchema).mutation( async ({ctx, input } ) => {
    const { paymentId, amount, subscriptionType } = input;

    const { prisma, auth } = ctx;
    const { userId,   } =auth;

    const payment = await prisma.payment.findFirst({
        where: {
            status: 'success',
            paymentId,
            userId
        }
    });


    if (!payment){
        throw new TRPCError({
            message: 'Payment info not found',
            code: 'NOT_FOUND'
        })
    }

    const isValidAmount = payment.amount === amount;


    if (!isValidAmount){
        throw new TRPCError({
            message: 'Invalid amount',
            code: 'BAD_REQUEST'
        })
    }

    const pointSystem = new CreditSystem(prisma);

    await pointSystem.buildPackage({
        amount: payment.amount,
        points: payment.points,
        userId,
        type: subscriptionType,
        duration: 30
    })


    const wallet = await prisma.wallet.findFirst({ where: { userId }})

   return wallet;

})