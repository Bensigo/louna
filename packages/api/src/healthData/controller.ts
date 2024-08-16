import { protectedProcedure } from "../trpc";
import { HealthDataService } from "./service";
import { CreateHealthDataSchema, CreateHealthSamples, GetHealthDataSchema } from "./schema";
import { z } from "zod";
import { prisma } from "@lumi/db";


export const createHealthDataController = protectedProcedure
.input(CreateHealthSamples)
.mutation(async ({ ctx, input }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
  if (input?.deleted.length){
    const ids = input.deleted.map((sample) => sample.id)
    prisma.healthData.deleteMany({
      where: {
        profileId: ctx.user.id,
        dataId: {
          in: ids
        }
      }
    })
  }
  return await healthDataService.createMany(input.new, ctx.user.id);
})


export const getStatsController = protectedProcedure.query(async ({ ctx }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
  return healthDataService.getStats(ctx.user.id) 
})


export const listHealthDataController = protectedProcedure.input(GetHealthDataSchema).query(async ({ ctx, input }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
  return healthDataService.getHealthData(ctx.user.id, input.type, input.interval)
}) 


