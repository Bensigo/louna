import { protectedProcedure } from "../trpc";
import { HealthDataService } from "./service";
import { CreateHealthDataSchema, GetHealthDataSchema } from "./schema";
import { z } from "zod";


export const createHealthDataController = protectedProcedure
.input(z.array(CreateHealthDataSchema))
.mutation(async ({ ctx, input }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
  return await healthDataService.createMany(input, ctx.user.id);
})


export const getStatsController = protectedProcedure.query(async ({ ctx }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
  return healthDataService.getStats(ctx.user.id) 
})


export const listHealthDataController = protectedProcedure.input(GetHealthDataSchema).query(async ({ ctx, input }) => {
  const healthDataService = new HealthDataService(ctx.prisma);
  return healthDataService.getHealthData(ctx.user.id, input.type, input.interval)
}) 


