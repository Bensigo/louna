import Replicate from 'replicate'
import { nanoid } from 'nanoid'




const REPLICATE_KEY = process.env.REPLICATE_KEY

const replicate = new Replicate({
  auth: REPLICATE_KEY,
})




export async function generateImage(prompt: string) {
    const input = {
        prompt,
        output_quality: 60, // change to 90 on prod
        aspect_ratio: "1:1",
        output_format: "jpg",
        }
        
        const output = await replicate.run("black-forest-labs/flux-schnell", { input });
        
        if (!output) {
        throw new Error('Unable to generate image')
        }
        const imageUrl = output[0] as string
        const fetchResponse = await fetch(imageUrl);
        const fileExtension = imageUrl.split?.(".")?.pop?.()
        const blob = await fetchResponse.blob()
        return {blob, fileExtension};
        

}