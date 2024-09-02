import { createTRPCRouter } from "../trpc";
import { syncHealthDataController, getChartDataController, getScoreController, getTrendDataController } from "./controller";

export const healthDataRouter = createTRPCRouter({
  syncHealthData: syncHealthDataController,
  trend: getTrendDataController,
  get: getScoreController,
  list: getChartDataController
});

