import { GetImageSchema } from "../../schema/upload";
import { protectedProcedure } from "../../trpc";
import { AWS_BUCKET_NAME, S3 } from "../../utils/s3";




export const getImageController = protectedProcedure.input(GetImageSchema).query(async ({ input }) => {
    const {key} = input

    const params = {
        BUCKET: AWS_BUCKET_NAME,
        Key: key,
        Expires: 3600
    }

    const image = await S3.getSignedUrlPromise("getObject", params)

    return image;
}) 