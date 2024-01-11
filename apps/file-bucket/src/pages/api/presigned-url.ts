
import { prisma } from '@solu/db'
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { randomUUID} from 'crypto'
import { env } from '~/env.mjs';
import { S3 } from '~/utils/s3';
import { type PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post'



const schema = z.object({
    fileNames: z.array(z.string()),
    expiration: z.string(),
    contentType: z.string(),
    baseKey: z.string(),
    repo: z.string()
})


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    console.log("====== here ========")
    if (req.method !== 'POST'){
        return res.status(405).json({
            error: { message: `Method ${req.method} Not Allowed` },
          });
    }
    const response = schema.safeParse(req.body);

    if (!response.success) {
        const { errors } = response.error;
    
        return res.status(400).json({
          error: { message: "Invalid request", errors },
        });
      }

      const { fileNames, contentType, expiration, repo, baseKey  } = response.data
    /// handle pre-signed url
    const preSignedPost =  await generatePresignedUrls(fileNames,contentType, expiration, repo);
    const files = []
    
    if (preSignedPost.length){
      for (const preSigned of preSignedPost){
        const [repo, key] = preSigned.fields.key?.split('/')
        const file = {
          baseId: baseKey,
          key,
          repo,
          contentType: contentType
        }

 
        files.push(file)

      }
    }
    await prisma.file.createMany({
      data: files
    })
    //  Promise.all(files);

    return  res.status(200).json(preSignedPost);
    
}


const UPLOAD_MAX_FILE_SIZE = 10000000

export async function generatePresignedUrls(fileNames: string[], contentType: string, expiration: string, repo: string): Promise<PresignedPost[]> {
  
    return Promise.all(
      fileNames.map(async (fileName) => {
        const Key = randomUUID()
        const params = {
          Bucket:  env.AWS_BUCKET_NAME,
          Key: `${repo}/${Key}-${fileName}`,
          Expires: parseInt(expiration, 10),
        };
        const ct = contentType.startsWith('image') ? 'image/' : 'video/'
         return createPresignedPost(S3, {
          ...params,
     
          Conditions: [
            ["starts-with", "$Content-Type", ct], // this should be dynamic
            ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
          ],
          
        });
      })
    );
  }
  



