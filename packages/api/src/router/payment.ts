import { makePaymentController } from "../controllers/payment/createPayment";
import { CreatePaymentLogsControlller } from "../controllers/payment/createPaymentLog";
import { CreditWalletController } from "../controllers/payment/creditWallet";
import { UpdatePaymentStatusControlller } from "../controllers/payment/updateStatus";
import { createTRPCRouter } from "../trpc";


export const paymentRouter = createTRPCRouter({
    creditWallet: CreditWalletController,
    create: makePaymentController,
    updateStatus: UpdatePaymentStatusControlller,
    createLog: CreatePaymentLogsControlller
})