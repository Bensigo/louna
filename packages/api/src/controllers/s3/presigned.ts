
import axios from 'axios'
import { protectedProcedure } from '../../trpc'
import { UploadImagesSchema } from '../../schemas/s3'


export const getPreSignedUrlController = protectedProcedure.input(UploadImagesSchema).mutation(async ({ input, ctx }) => {
    const { fileNames, contentType, repo, expiration, baseKey } =input  
    const resp = await axios.post('http://localhost:6060/api/presigned-url', {
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
    return resp.data;
    
})