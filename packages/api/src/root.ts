import { authRouter } from "./router/auth"
import { postRouter } from "./router/post"
import { preferenceRouter } from "./router/preference"
import { recipeRouters } from "./router/recipe"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
    auth: authRouter,
    post: postRouter,
    preference: preferenceRouter,
    recipe: recipeRouters
})

// export type definition of API
export type AppRouter = typeof appRouter
