import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"



// export const env = createEnv({
//     server: {
//         AWS_BUCKET_NAME: z.string(),
//         AWS_ACCESS_KEY: z.string(),
//         AWS_SECRET_KEY: z.string(),
//         AWS_REGION: z.string()
//     },
//     runtimeEnv: {
//         AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
//         AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
//         AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
//         AWS_REGION: process.env.AWS_REGION

//     }
// })