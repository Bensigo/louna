// import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";


import { HealthDataType, Preference, PrismaClient, Profile } from "@lumi/db";

import { newChangellegeSchema } from "./schema";
import { generateImage } from "../../../uitils/replicate";
import { saveImage } from "../../../uitils/saveImg";
import { createOpenAI } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic";


const activities = [
  "Soccer",
  "Basketball",
  "Run",
  "Steps",
  "Paddle",
  "Yoga",
  "Hiking",
  "Ice Bath",
  "Cycling",
  "Swimming",
  "Breath work",
  "Strength Training",
  "Pilates",
  "Meditation",
  "Boxing",
];


console.log({  apiKey: process.env.OPENAI_API_KEY })

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

type Challenge = z.infer<typeof newChangellegeSchema>;

export default class NewChallengeSuggestionService {
  private prisma: PrismaClient;
  public userId: string;

  constructor(userId: string) {
    this.prisma = new PrismaClient();
    this.userId = userId;
  }

  private async getUserProfile(id: string) {
    return this.prisma.profile.findUnique({
      where: { id },
      include: { preference: true },
    });
  }


  private createPrompt(
    profile: Profile & { preference: Preference },
    healthTrends: Record<
      HealthDataType,
      { average: number; total?: number; min: number, max: number }
    >,
  ) {
    const age = new Date().getFullYear() - profile.preference.age.getFullYear();
    const interests = profile.preference.intrest.join(", ");

    let promptText = `Generate 10 personalized activity suggestions for a user with the following profile:
Age: ${age}
Interests: ${interests}
using the user's health trends:`;

    const nonEmptyTrends = Object.entries(healthTrends).filter(([_, value]) => value.average !== 0);
    
    for (const [key, value] of nonEmptyTrends) {
      const formattedAverage = value.average.toFixed(key === "HEART_RATE" || key === "HRV" ? 1 : 0);
      promptText += `
- ${key}: Average ${formattedAverage}, Min ${value.min}, Max ${value.max}`;
    }

    promptText += `

Based on these health trends and the user's interests, suggest activities from the following list:
${activities.join(", ")}
Prioritize activities that:
1. Match the user's interests
2. Address current health needs
3. Encourage improvement in areas showing decreasing trends
4. Maintain or enhance areas with positive trends
`;

    return promptText;
  }

  private async generateSuggestions(prompt: string): Promise<string[]> {
    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-20240620'),
      schema: z.array(z.string()),
      prompt,
    });
    const suggestions = result.object;
    return suggestions;
  }

  async generatChallengeSuggestions(healthTrends: Record<
    HealthDataType,
    { average: number; total?: number; min: number, max: number }
  >, ) {
    const profile = await this.getUserProfile(this.userId);
    const prompt = this.createPrompt(profile, healthTrends);
    let suggestions = await this.generateSuggestions(prompt);
    return suggestions;
  }

  async getImage(name: string, activity: string) {
    // TODO: optimize prompt for better image
    const prompt = `
        A bright vibrant cover image for health and wellness challenge event.
        NAME: ${name.toUpperCase()}
        activity type: ${activity.toUpperCase()}`;

        const { blob, fileExtension } = await generateImage(prompt);
        const imgUrl = await saveImage(blob, fileExtension, this.userId);
        return imgUrl;
        
  }

  async isValidForSuggestion() {
    const profile = await this.getUserProfile(this.userId);
    return profile?.hasPref && profile?.hasHealthKitAuthorize;
  }
}
