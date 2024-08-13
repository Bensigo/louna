import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supaBaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


const supabase = createClient(supabaseUrl, supaBaseAnonKey, {})


export async function saveImage(blob: Blob, fileExtension: string, userId: string): Promise<string>{
    // const fileExtension = imageUrl.split?.(".")?.pop?.();
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
      console.log({ err: uploadedFilesRes.error})
    }
  
    const { data: resp } = supabase.storage
      .from("challenges")
      .getPublicUrl(uploadedFilesRes?.data?.path);  
    return resp?.publicUrl 
}