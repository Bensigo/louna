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
      const validatedData = HealthDataSchema.parse(input);
      const utilService = new UtilService();
      const healthDataLogService = new HealthDataLogService(prisma);

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

        const recoveryScore = utilService.calRecoveryScore(
          healthDataLog.baselineHrv,
          healthDataLog.baselineRhr,
          healthDataLog.hrv,
          healthDataLog.rhr,
          healthDataLog.sleepMins / 60
        );

        const wellnessScore = utilService.calWellnessScore({
          avgHRV: healthDataLog.hrv,
          avgRHR: healthDataLog.rhr,
          avgSteps: healthDataLog.steps,
          avgEnergyBurned: healthDataLog.energy,
          avgHeartRate: healthDataLog.heartRate,
          sleepQuality: healthDataLog.sleepMins / 60,
        });

        const scores = [
          { type: HealthScoreType.Stress, score: utilService.calculatePercentage(stressScore), rawScore: stressScore },
          { type: HealthScoreType.Recovery, score: utilService.calculatePercentage(recoveryScore), rawScore: recoveryScore },
          { type: HealthScoreType.Wellbeing, score: utilService.calculatePercentage(wellnessScore), rawScore: wellnessScore },
        ];

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

export const getScoreController =   protectedProcedure
    .input(z.object({
      type: z.enum(['Recovery', 'Wellbeing', 'Stress']),
    }))
    .query(async ({ ctx, input }) => {
      const { type } = input;
      const { prisma, user } = ctx;
      const userId = user.id;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const aggregatedScore = await prisma.healthScore.aggregate({
        where: {
          userId,
          type,
          timestamp: {
            gte: today,
            lt: tomorrow,
          },
        },
        _avg: {
          rawScore: true,
          score: true,
        },
      });

      if (!aggregatedScore._avg.rawScore || !aggregatedScore._avg.score) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No health scores found for today',
        });
      }

      return {
        type,
        rawScore: aggregatedScore._avg.rawScore,
        score: aggregatedScore._avg.score,
        id: `${userId}-${type}-${today.toISOString().split('T')[0]}`,
      };
    });
    
export const getTrendDataController = protectedProcedure
  .input(z.object({
    type: z.enum(['Recovery', 'Wellbeing', 'Stress']),
    days: z.number().int().positive().default(7),
  }))
  .query(async ({ ctx, input }) => {
    const { type, days } = input;
    const { prisma, user } = ctx;
    const userId = user.id;

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const scores = await prisma.healthScore.findMany({
      where: {
        userId,
        type: type as HealthScoreType,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
      select: {
        timestamp: true,
        score: true,
      },
    });

    if (scores.length < 2) {
      return { trend: "Not enough data", scores };
    }

    const firstScore = scores[0].score;
    const lastScore = scores[scores.length - 1].score;
    const overallChange = lastScore - firstScore;

    let trend: string;
    if (overallChange > 0) {
      trend = "Improving";
    } else if (overallChange < 0) {
      trend = "Declining";
    } else {
      trend = "Stable";
    }

    const average = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
    const min = Math.min(...scores.map(s => s.score));
    const max = Math.max(...scores.map(s => s.score));

    return {
      trend,
      overallChange,
      average,
      min,
      max,
      scores,
    };
  });

export const getChartDataController = protectedProcedure
  .input(z.object({
    type: z.enum(['Recovery', 'Wellbeing', 'Stress']),
    startDate: z.date(),
    endDate: z.date(),
  }))
  .query(async ({ ctx, input }) => {
    const { type, startDate, endDate } = input;
    const { prisma, user } = ctx;
    const userId = user.id;

    const chartData = await prisma.healthScore.findMany({
      where: {
        userId,
        type: type as HealthScoreType,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
      select: {
        timestamp: true,
        score: true,
        rawScore: true,
      },
    });

    return chartData;
  });
