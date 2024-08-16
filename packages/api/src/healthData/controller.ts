import { protectedProcedure } from "../trpc";
import { HealthDataService } from "./service";
import { CreateHealthDataSchema, CreateHealthSamples, DeletedFromDbSchema, GetHealthDataSchema } from "./schema";
import { z } from "zod";
import { prisma } from "@lumi/db";
import { getController } from "../preference/controller";


export const createHealthDataController = protectedProcedure
.input(CreateHealthSamples)
.mutation(async ({ ctx, input }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
 
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


export const deleteHealthdataController = protectedProcedure.input(DeletedFromDbSchema).mutation(async ({ ctx, input}) => {
  if (input?.length){
    const ids = input
    prisma.healthData.deleteMany({
      where: {
        profileId: ctx.user.id,
        dataId: {
          in: ids
        }
      }
    })
  }
})

