import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app isn't
     * built with invalid env vars.
     */
    server: {
        DATABASE_URL: z.string().url(),
        WEBHOOK_SECRET: z.string(),
        GOOGLE_APPLICATION_CREDENTIALS: z.string(),
        GOOGLE_CLOUD_BUCKET_NAME: z.string(),
        X_SECRET: z.string().optional(),
    },
    /**
     * Specify your client-side environment variables schema here.
     * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
    },
    /**
     * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
        GOOGLE_APPLICATION_CREDENTIALS:
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
        GOOGLE_CLOUD_BUCKET_NAME: process.env.GOOGLE_CLOUD_BUCKET_NAME,
        X_SECRET: process.env.X_SERECT,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
})
