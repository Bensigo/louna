import { env } from '../env.mjs'

const IMAGE_URL = env.NEXT_PUBLIC_IMG_SERVER_URL  || 'https://solu-file-bucket.vercel.app/' 
export function buildFileUrl(repo: string, key: string) {
    // const BASE_URL =  IMAGE_URL  ||  'http://localhost:6060' 
    const BASE_URL =   'http://localhost:6060' 
    console.log({ BASE_URL })
    return `${BASE_URL}/api/${repo}/${key}`
}


export function buildFileUrlV2(key: string) {
    const BASE_URL =  IMAGE_URL  ||  'http://localhost:6060' 
    console.log({ BASE_URL })
    return `${BASE_URL}/api/${key}`
}