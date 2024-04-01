import { getPreSignedUrlController } from "../controllers/s3/presigned";
import { createTRPCRouter } from "../trpc";

export const s3Router = createTRPCRouter({
    presigned: getPreSignedUrlController
})