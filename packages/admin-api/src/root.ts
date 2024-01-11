import { partnerRouters } from "./router/partner";
import { profileRouters } from "./router/profile";
import { uploadRouters } from "./router/upload";
import { createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({
    profile: profileRouters,
    partners: partnerRouters,
    s3: uploadRouters
})

export type AppRouter = typeof appRouter