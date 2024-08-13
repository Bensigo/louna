// import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";


import { HealthDataType, Preference, PrismaClient, Profile } from "@lumi/db";

import { newChangellegeSchema } from "./schema";
import { generateImage } from "../../../uitils/replicate";
import { saveImage } from "../../../uitils/saveImg";
import { createOpenAI } from '@ai-sdk/openai';


const activities = [
  "Soccer",
  "Basketball",
  "Run",
  "Steps",
  "Tennis",
  "Yoga",
  "Hiking",
  "Ice Bath",
  "Cycling",
  "Swimming",
  "Dancing",
  "Strength Training",
  "Pilates",
  "Kayaking",
  "Meditation",
  "Sound Healing",
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

  private async getUserHealthData(id: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.prisma.healthData.findMany({
      where: {
        profileId: id,
        startDateTime: { gte: startDate },
      },
      orderBy: { startDateTime: "asc" },
    });
  }
  /**
            It groups the health data by type.
            For each health data type, it calculates:
            The average value over the entire period.
      * The trend (increasing, decreasing, or stable) by comparing the average of the first half of the data to the second half.
            The rate of change, calculated as the percentage change between the first and second half averages.
            3. It considers a trend "increasing" if the change rate is greater than 5%, "decreasing" if it's less than -5%, and "stable" otherwise.
             You can adjust these thresholds as needed.
      */
  private analyzeHealthTrends(healthData: any[]) {
    const trends: Record<
      HealthDataType,
      { average: number; trend: string; changeRate: number }
    > = {
      STEPS: { average: 0, trend: "stable", changeRate: 0 },
      HEART_RATE: { average: 0, trend: "stable", changeRate: 0 },
      HRV: { average: 0, trend: "stable", changeRate: 0 },
      CALORIES: { average: 0, trend: "stable", changeRate: 0 },
    };

    // Group data by type
    const groupedData: Record<HealthDataType, number[]> = {
      STEPS: [],
      HEART_RATE: [],
      HRV: [],
      CALORIES: [],
    };

    healthData.forEach((data) => {
      groupedData[data.type].push(parseFloat(data.value));
    });

    Object.keys(trends).forEach((key) => {
      const typeData = groupedData[key as HealthDataType];
      if (typeData.length > 0) {
        const average =
          typeData.reduce((sum, val) => sum + val, 0) / typeData.length;
        trends[key as HealthDataType].average = average;

        if (typeData.length > 1) {
          const firstHalf = typeData.slice(0, Math.floor(typeData.length / 2));
          const secondHalf = typeData.slice(Math.floor(typeData.length / 2));
          const firstHalfAvg =
            firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
          const secondHalfAvg =
            secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

          const changeRate = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
          trends[key as HealthDataType].changeRate = changeRate;

          if (changeRate > 0.05) {
            trends[key as HealthDataType].trend = "increasing";
          } else if (changeRate < -0.05) {
            trends[key as HealthDataType].trend = "decreasing";
          }
        }
      }
    });

    return trends;
  }

  private createPrompt(
    profile: Profile & { preference: Preference },
    healthTrends: Record<
      HealthDataType,
      { average: number; trend: string; changeRate: number }
    >,
  ) {
    const age = new Date().getFullYear() - profile.preference.age.getFullYear();
    const interests = profile.preference.intrest.join(", ");

    let promptText = `Generate 3 personalized activity suggestions for a user with the following profile:
Age: ${age}
Height: ${profile.preference.height} cm
Weight: ${profile.preference.weight} kg
Interests: ${interests}

Consider the user's health trends:`;

    const nonEmptyTrends = Object.entries(healthTrends).filter(([_, value]) => value.average !== 0);
    
    for (const [key, value] of nonEmptyTrends) {
      const formattedAverage = value.average.toFixed(key === "HEART_RATE" || key === "HRV" ? 1 : 0);
      const formattedChangeRate = (value.changeRate * 100).toFixed(1);
      promptText += `
- ${key}: Average ${formattedAverage}, ${value.trend} (${formattedChangeRate}% change)`;
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
      model: openai("gpt-3.5-turbo", {
         
      }), // change to 4o
      schema: z.array(z.string()),
      prompt,
    });
    const suggestions = result.object;
    return suggestions;
  }

  async generatChallengeSuggestions() {
    const profile = await this.getUserProfile(this.userId);
    console.log("======= called  profile ============", profile)
    const healthData = await this.getUserHealthData(this.userId);
    const healthTrends = this.analyzeHealthTrends(healthData);
    const prompt = this.createPrompt(profile, healthTrends);
    let suggestions = await this.generateSuggestions(prompt);
   
    console.log({ suggestions })
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
