import { createTRPCRouter } from "../trpc";
import { createHealthDataController, getStatsController } from "./controller";

export const healthDataRouter = createTRPCRouter({
    createMany: createHealthDataController,
    stats: getStatsController
});
