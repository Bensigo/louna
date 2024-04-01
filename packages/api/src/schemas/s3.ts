import { z } from "zod";


export const UploadImagesSchema = z.object({
    fileNames: z.array(z.string()),
    expiration: z.string(),
    contentType: z.string(),
    baseKey: z.string(),
    repo: z.string()

})