import type { NextApiRequest, NextApiResponse } from 'next'
import Replicate from 'replicate'
import { nanoid } from 'nanoid'
import Cors from 'cors'
import { createClient } from '@supabase/supabase-js'

// Initialize the cors middleware
export const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export const maxDuration = 300
export const config = { maxDuration: 300 }
export const runtime = 'nodejs'

const REPLICATE_KEY = process.env.REPLICATE_KEY

const replicate = new Replicate({
  auth: REPLICATE_KEY,
})


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supaBaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export const supabase = createClient(supabaseUrl, supaBaseAnonKey, {})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // Rest of the API logic
  if (req.method === 'POST') {
    try {
      const { name, userId  } = req.body as {
        name: string;
        userId: string
      }
      const prompt = `
        A bright vibrant cover image for health and wellness challenge event.
        Name: ${name}
        `

      const input = {
        prompt,
        output_quality: 70, // change to 90 on prod
        aspect_ratio: "1:1",
        output_format: "jpg",
      }

      const output = await replicate.run("black-forest-labs/flux-schnell", { input });


      if (!output) {
        throw new Error('Unable to generate image')
      }
      const imageUrl = output[0] as string
      const fetchResponse = await fetch(imageUrl);
      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch file data: ${fetchResponse.statusText}`);
      }
      const blob = await fetchResponse.blob();
    
      if (!blob || blob.size === 0) {
        throw new Error("The blob is empty or invalid");
      }
      const fileExtension = imageUrl.split?.(".")?.pop?.();
      const uid = nanoid();
      const fileName = `${userId}/file-${uid}.${fileExtension}`;
    
      const uploadedFilesRes = await supabase.storage
        .from("challenges")
        .upload(fileName, blob, {
          cacheControl: "3600",
          upsert: true,
          contentType: "image/jpeg",  
        });
    
      if (uploadedFilesRes?.error != null) {
        return uploadedFilesRes;
      }
    
      const { data: resp } = supabase.storage
        .from("challenges")
        .getPublicUrl(uploadedFilesRes?.data?.path);
      console.log({ resp })
      res.json(resp.publicUrl)
    } catch (error) {
      console.error("Error generating image:", error)
      res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}