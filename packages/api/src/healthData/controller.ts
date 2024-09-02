

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { HealthDataSchema } from "./schema";
import { HealthDataLogService, UtilService } from "./service";
import { HealthScoreType } from "@prisma/client";

export const syncHealthDataController = protectedProcedure
  .input(HealthDataSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    const { prisma } = ctx;

    try {
      // Validate input using the schema
      const validatedData = HealthDataSchema.parse(input);
      const utilService = new UtilService();
      const healthDataLogService = new HealthDataLogService(prisma);

      console.log({ validatedData });
      await prisma.$transaction(async (tx) => {
        const healthDataLog = await tx.healthDataLog.create({
          data: {
            timestamp: new Date(),
            userId,
            hrv: validatedData.currentData.hrv,
            rhr: validatedData.currentData.rhr,
            steps: validatedData.currentData.stepCount,
            energy: validatedData.currentData.activeEnergyBurned,
            heartRate: validatedData.currentData.heartRate,
            sleepMins: validatedData.sleepData?.totalSleepMins || 0,
            baselineHrv: validatedData.baselineData.hrv,
            baselineRhr: validatedData.baselineData.rhr,
            baselineSteps: validatedData.baselineData.stepCount,
            baselineEnergy: validatedData.baselineData.activeEnergyBurned,
            baselineHeartRate: validatedData.baselineData.heartRate,
            workouts: {
              create: validatedData.workouts?.map(workout => ({
                name: workout.name || '',
                duration: workout.duration || 0,
                distance: workout.distance,
                energyBurned: workout.energyBurned || 0
              })) || []
            }
          }
        });

        console.log("Health data log created");
        const stressScore = utilService.calStressScore({
          baseLineHRV: healthDataLog.baselineHrv,
          todayHRV: healthDataLog.hrv,
          baseLineRHR: healthDataLog.baselineRhr,
          todayRHR: healthDataLog.rhr,
          baselineStep: healthDataLog.baselineSteps,
          todaySteps: healthDataLog.steps,
          baseLineEnergyBurned: healthDataLog.baselineEnergy,
          todayEnergyBurned: healthDataLog.energy,
        });
        console.log({ stressScore });

        const recoveryScore = utilService.calRecoveryScore(
          healthDataLog.baselineHrv,
          healthDataLog.baselineRhr,
          healthDataLog.hrv,
          healthDataLog.rhr,
          healthDataLog.sleepMins / 60 // Assuming sleepQuality is derived from sleep duration
        );
        console.log({ recoveryScore });

        const wellnessScore = utilService.calWellnessScore({
          avgHRV: healthDataLog.hrv,
          avgRHR: healthDataLog.rhr,
          avgSteps: healthDataLog.steps,
          avgEnergyBurned: healthDataLog.energy,
          avgHeartRate: healthDataLog.heartRate,
          sleepQuality: healthDataLog.sleepMins / 60, // Assuming sleepQuality is derived from sleep duration
        });
        console.log({ wellnessScore });

        const scores = [
          { type: HealthScoreType.Stress, score: utilService.calculatePercentage(stressScore), rawScore: stressScore },
          { type: HealthScoreType.Recovery, score: utilService.calculatePercentage(recoveryScore), rawScore: recoveryScore },
          { type: HealthScoreType.Wellbeing, score: utilService.calculatePercentage(wellnessScore), rawScore: wellnessScore },
        ];

        console.log({ scores });
        await tx.healthScore.createMany({
          data: scores.map(score => ({
            userId,
            timestamp: new Date(),
            type: score.type,
            score: score.score,
            rawScore: score.rawScore,
          })),
        });
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




