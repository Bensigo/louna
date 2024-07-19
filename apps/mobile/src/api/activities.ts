import { type RouterOutputs } from '@solu/api'
import axios from 'axios'

// Define the type for the response
interface ActivityResponse {
    activity: string
    score: number
}
interface RequestBody {
    fitness_goal: string
    age: number
    sleeping_time: number
    steps_count: number
    hrvs: number[]
    hrv: number
}
// Define the headers
const headers = {
    "content-type": "application/json",
    "x-api-key": process.env.EXPO_PUBLIC_AI_API_X_SECRET,
}

export const sampleData = {
    fitness_goal: "weight loss",
    age: 30,
    sleeping_time: 300,
    steps_count: 3500,
    hrvs: [23, 34.5, 45, 44],
    hrv: 15,
}

export const getSuggestedActivityCategory = async (
    body: RequestBody,
): Promise<ActivityResponse[]> => {

    const api_uri_base = process.env.EXPO_PUBLIC_AI_API_URL

    const response = await axios.post(`${api_uri_base}/v1/sre/activities-category`, body, { headers })
    if (!response.data ) {
        throw new Error("Network response was not ok")
    }
    return response.data
}



export const getSuggestedActivities = async (category: string): Promise<RouterOutputs['session']['get'][]> => {
   try {
    const api_uri_base = process.env.EXPO_PUBLIC_AI_API_URL
    const response = await axios.get(`${api_uri_base}/v1/sre/activities?category=${category}`, { headers } )

    return response.data;
   }catch(err: any){
    throw new Error((err.message as string) ?? 'Network error')
   }
}