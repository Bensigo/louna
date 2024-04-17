import { UploadImagesSchema } from "../../schema/upload";
import { protectedProcedure } from "../../trpc";
import { AWS_BUCKET_NAME, S3 } from "../../utils/s3";
import { randomUUID } from "crypto";
// import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post'
import axios from 'axios'

const UPLOAD_MAX_FILE_SIZE = 10000000

export async function generatePresignedUrls(fileNames: string[], contentType: string, expiration: string, repo: string): Promise<PresignedPost[]> {
  
    return Promise.all(
      fileNames.map(async (fileName) => {
        const Key = randomUUID()
        const params = {
          Bucket:  AWS_BUCKET_NAME as string,
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
  



export const getUploadPreSignedUrl = protectedProcedure.input(UploadImagesSchema).mutation(async ({ input, ctx }) => {
    const { fileNames, contentType, repo, expiration, baseKey } =input
  
    // const preSignedPost =  await generatePresignedUrls(input.fileNames, input.contentType, input.expiration, input.repo);
    // const files = []
    
    // if (preSignedPost.length){
    //   for (const preSigned of preSignedPost){
    //     const [repo, key] = preSigned.fields.key?.split('/')
    //     const file = {
    //       baseId: input.baseKey,
    //       key,
    //       repo,
    //       contentType: input.contentType
    //     }

 
    //     files.push(file)

    //   }
    // }
    // await prisma.file.createMany({
    //   data: files
    // })
    // //  Promise.all(files);
    const base_url = process.env.IMG_SERVER_URL || 'http://localhost:6060'
    const resp = await axios.post(`${base_url}/api/presigned-url`, {
      fileNames,
      contentType, 
      expiration,
      repo,
      baseKey
    }, {
      headers: {
        'x-secret': process.env.INTERNAL_API_KEY as string
      }
    })
    console.log({ resp })
    return resp.data;
    
})