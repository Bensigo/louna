
import { env } from "../env.mjs";


export function buildFileUrl(repo: string, key: string) {
    const BASE_URL =  env.NEXT_PUBLIC_IMG_SERVER_URL  ||  'http://localhost:6060' 
    return `${BASE_URL}/api/${repo}/${key}`
}


export function buildFileUrlV2(key: string) {
    const BASE_URL =  env.NEXT_PUBLIC_IMG_SERVER_URL  ||  'http://localhost:6060' 
    return `${BASE_URL}/api/${key}`
}