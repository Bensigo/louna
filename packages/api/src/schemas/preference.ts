import { z } from "zod"

export const addPreferenceSchema = z.object({
    type: z.enum(["RECIPE", "BOOKING", "FITNESS"]),
    config: z.record(z.any()),
})



const DietarySchema = z.object({
    foodDislike: z.array(z.string()).default([]),
    diet: z.string(),
    dietPref: z.array(z.string()).default([]),
    mealFrequency: z.string(),
  });
  
  const FitnessSchema = z.object({
    age: z.number().int(),
    fitnesGoal: z.array(z.string()),
    fitnessDiffculty: z.array(z.string()),
    fitnessLevel: z.string(),
    healthConditions: z.array(z.string()).default([]),
  });
  
  const WellnessSchema = z.object({
    stressLevel: z.string(),
    stressManagement: z.array( z.string()),
  });
  
 export  const UpsertPrefrence = z.object({
    diet: DietarySchema,
    fitness: FitnessSchema,
    wellness: WellnessSchema,
  });