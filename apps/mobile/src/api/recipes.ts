import { type RouterOutputs } from '@solu/api'
import axios from 'axios'


type Recipe = RouterOutputs['recipe']['getRecipe']

export interface RequestBody {
    age: number
    gender: 'female' | 'male'
    height: number
    weight: number
    step_count: number
    diet_preference: string
    fitness_goal: string
    meal_preference: string[]
    meal_frequency: number
    allergies: string[]
}

const headers = {
    "content-type": "application/json",
    "x-api-key": process.env.EXPO_PUBLIC_AI_API_X_SECRET,
}


export const getSuggestedRecipes = async (
    body: RequestBody,
): Promise<Recipe[]> => {

    const api_uri_base = process.env.EXPO_PUBLIC_AI_API_URL

    const response = await axios.post(`${api_uri_base}/v1/sre/recipes`, body, { headers })
    if (!response.data ) {
        throw new Error("Network response was not ok")
    }
    return response.data
}