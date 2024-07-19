import { type RouterOutputs } from '@solu/api'
import axios from 'axios'


export type Resource = NonNullable<RouterOutputs['resource']['get']>


const headers = {
    "content-type": "application/json",
    "x-api-key": process.env.EXPO_PUBLIC_AI_API_X_SECRET,
}



export async function getResources(tags: string[]): Promise<Resource[]> {
    try {
        const api_uri_base = process.env.EXPO_PUBLIC_AI_API_URL
        const response = await axios.get(`${api_uri_base}/v1/sre/resources`,{
            params: {
                tags,
            },
            headers,
            paramsSerializer: (params) => {
                return Object.keys(params)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&');
            }
        })
    
        return response.data;
       }catch(err: any){
        throw new Error((err.message as string) ?? 'Network error')
       }
}