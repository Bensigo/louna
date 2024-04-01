import { metricRouters } from "./router/metric";
import { instructorRouters } from "./router/instructor";
import { usersRouters } from "./router/user";
import { profileRouters } from "./router/profile";
import { recipeRouter } from "./router/recipe";
import { smwRouters } from "./router/smw";
import { uploadRouters } from "./router/upload";
import { createTRPCRouter } from "./trpc";
import { partnerRouters } from "./router/partner";
import { addressRouters } from "./router/address";
import { sessionRouters } from "./router/session";
import { configRouters } from "./router/config";
import { resourceRouters } from "./router/resource";


export const appRouter = createTRPCRouter({
    profile: profileRouters,
    user: usersRouters,
    s3: uploadRouters,
    recipe: recipeRouter,
    instructor: instructorRouters,
    smw: smwRouters,
    metric: metricRouters,
    partner: partnerRouters,
    address: addressRouters,
    session: sessionRouters,
    config: configRouters,
    resource: resourceRouters
})

export type AppRouter = typeof appRouter