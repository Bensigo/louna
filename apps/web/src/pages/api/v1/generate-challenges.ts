// import type { NextApiRequest, NextApiResponse } from "next";
import { generateObject } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';
import { prisma } from '@lumi/db';




const groq = createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
})


const ChallengeSchema = z.array(z.object(
    {
      name: z.string(),
      description: z.string(),
      start: z.date(),
      end: z.date(),
      type: z.enum(['Running', 'Steps', 'Cycling', 'Yoga', 'Mindfullness', 'Swiming']),
      goal: z.number(),
      goalType: z.enum(['Distance', 'Duration', 'Calories'])
    }
))



function generateChallenges (prompt: string){
    return  generateObject({
        model: groq('llama-3.1-70b-versatile'),
        schema: ChallengeSchema,
        prompt
    })
}

