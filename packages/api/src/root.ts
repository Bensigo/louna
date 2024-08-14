import { authRouter } from "./auth/router";
import { challengeRouter } from "./challenges/router";
import { coachRouter } from "./coach/router";
import { healthDataRouter } from "./healthData/router";
import { preferenceRouter } from "./preference/router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  challenges: challengeRouter,
  preference: preferenceRouter,
  coach: coachRouter,
  healthDataLog: healthDataRouter
})

// export type definition of API
export type AppRouter = typeof appRouter


