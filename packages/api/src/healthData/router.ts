import { createTRPCRouter } from "../trpc";
import { createHealthDataController, deleteHealthdataController, getStatsController, listHealthDataController } from "./controller";

export const healthDataRouter = createTRPCRouter({
    createMany: createHealthDataController,
    stats: getStatsController,
    list: listHealthDataController,
    delete: deleteHealthdataController
});
