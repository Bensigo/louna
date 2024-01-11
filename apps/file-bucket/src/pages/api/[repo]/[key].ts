import type { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { env } from "~/env.mjs";
import { S3 } from "~/utils/s3";


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const  { key, repo } = req.query;

    // todo: add cache layer and cdn 

    const command = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: `${repo}/${key}`
    })
    const downloadUrl = await getSignedUrl(S3, command, { expiresIn: 36000 })
    console.log({downloadUrl})
    return res.status(200).json(downloadUrl)
}