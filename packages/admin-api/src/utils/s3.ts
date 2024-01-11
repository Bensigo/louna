
import { S3Client } from '@aws-sdk/client-s3'


export const AWS_BUCKET_NAME =  process.env.AWS_BUCKET_NAME
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
export const AWS_REGION = process.env.AWS_REGION




export const S3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY as string,
        secretAccessKey: AWS_SECRET_KEY as string ,
    }
});