import { authRouter } from "./router/auth"
import { bookingRouter } from "./router/booking"
import { partnerRouter } from "./router/partner"
import { paymentRouter } from "./router/payment"
import { postRouter } from "./router/post"
import { preferenceRouter } from "./router/preference"
import { recipeRouters } from "./router/recipe"
import { resourceRouter } from "./router/resource"
import { s3Router } from "./router/s3"
import { sessionController } from "./router/session"
import { smwRouter } from "./router/smw"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    auth: authRouter,
    post: postRouter,
    preference: preferenceRouter,
    recipe: recipeRouters,
    s3: s3Router,
    session: sessionController,
    resource: resourceRouter,
    payment: paymentRouter,
    partner: partnerRouter,
    smw: smwRouter,
    booking: bookingRouter,

})

// export type definition of API
export type AppRouter = typeof appRouter


