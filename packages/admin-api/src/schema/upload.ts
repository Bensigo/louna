import { z } from "zod";


export const UploadImagesSchema = z.object({
    fileNames: z.array(z.string()),
    expiration: z.string(),
    contentType: z.string(),
    baseKey: z.string(),
    repo: z.string()

})


export const GetImageSchema = z.object({
    key: z.string()
})

export const GetFilesByBaseIdSchema = z.object({
    id: z.string()
})

export const ValidateFileUploadSchema  = GetFilesByBaseIdSchema