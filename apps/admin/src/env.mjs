import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"



export const env = createEnv({
    server: {
        IMG_SERVER_URL: z.string(),
   
    },
    client: {
        NEXT_PUBLIC_IMG_SERVER_URL: z.string(),
    },
    runtimeEnv: {
        IMG_SERVER_URL: process.env.IMG_SERVER_URL,
        NEXT_PUBLIC_IMG_SERVER_URL: process.env.IMG_SERVER_URL

    }
})