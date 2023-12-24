import { profileRouters } from "./router/profile";
import { createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({
    profile: profileRouters
})

export type AppRouter = typeof appRouter