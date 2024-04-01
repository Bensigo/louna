import { z } from "zod"

export const CreatePaymentSchema = z.object({
    amount: z.number(),
    subscriptionType: z.enum(["TopUp", "Basic", "Premium", "Stellar"]),
    paymentMethod: z.enum(["applePay", "andriodPay", "web"]),
})


export const creditSchema = z.object({
    paymentId: z.string(),
    subscriptionType: z.enum(["TopUp", "Basic", "Premium", "Stellar"]),
    amount: z.number()
})
