
import { z } from 'zod'

export const BaselineDataSchema = z.object({
  activeEnergyBurned: z.number(),
  stepCount: z.number(),
  heartRate: z.number(),
  hrv: z.number(),
  standTime: z.number(),
  rhr: z.number(),
})

export const CurrentDataSchema = z.object({
  activeEnergyBurned: z.number(),
  standTime: z.number(),
  stepCount: z.number(),
  heartRate: z.number(),
  hrv: z.number(),
  rhr: z.number(),
})

export const SleepDataSchema = z.object({
  totalSleepMins: z.number().optional(),
}).optional()

export const WorkoutSchema = z.object({
  name: z.string(),
  duration: z.number(),
  energyBurned: z.number(),
  distance: z.number().optional(),
})

export const HealthDataSchema = z.object({
  baselineData: BaselineDataSchema,
  currentData: CurrentDataSchema,
  sleepData: SleepDataSchema,
  workouts: z.array(WorkoutSchema).optional(),
})


const createHealthDataSchema = HealthDataSchema.extend({})


