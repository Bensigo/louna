import { z } from "zod";



export const CreateSubscriptionSchema = z.object({
    paymentId: z.string(),
    amount: z.number()
})