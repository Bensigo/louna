import { createTRPCRouter } from "../trpc";
import { createHealthDataController, getStatsController, listHealthDataController } from "./controller";

export const healthDataRouter = createTRPCRouter({
    createMany: createHealthDataController,
    stats: getStatsController,
    list: listHealthDataController
});
