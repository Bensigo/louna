
import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';


import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export class TipService {

  async makeSuggestion<t>(prompt: string, schema: any): Promise<any> {
    try {
      const suggestion = await generateObject<t>({
        model: anthropic('claude-3-5-sonnet-20240620'),
        prompt,
        schema,
      })
     
      return suggestion.object;
    } catch (error) {
      console.error('Error making suggestion:', error);
      throw error;
    }
  }
}
