

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { HealthDataSchema } from "./schema";
import { HealthDataLogService } from "./service";

export const syncHealthDataController = protectedProcedure
  .input(HealthDataSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const {prisma} = ctx

    try {
      // Validate input using the schema
      const validatedData = HealthDataSchema.parse(input);
      const service = new HealthDataLogService(prisma);
      console.log({ validatedData })
      service.createHealthDataLog(userId, {
        hrv: validatedData.currentData.hrv,
        rhr: validatedData.currentData.rhr,
        steps: validatedData.currentData.stepCount,
        energy: validatedData.currentData.activeEnergyBurned,
        heartRate: validatedData.currentData.heartRate,
        sleepMins: validatedData.sleepData.totalSleepMins || 0,
        baselineHrv: validatedData.baselineData.hrv,
        baselineRhr: validatedData.baselineData.rhr,
        baselineSteps: validatedData.baselineData.stepCount,
        baselineEnergy: validatedData.baselineData.activeEnergyBurned,
        baselineHeartRate: validatedData.baselineData.heartRate,
        baselineSleepMins: 0, // Assuming baseline sleep data is not provided
        workouts: validatedData.workouts || []
      });

      return {
        status: 201,
        message: "Health data synced successfully",
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Validation error: ${error.message}`,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to sync health data: ${error.message}`,
      });
    }
  });




