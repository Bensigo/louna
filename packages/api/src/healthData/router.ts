import { createTRPCRouter } from "../trpc";
import { syncHealthDataController } from "./controller";

export const healthDataRouter = createTRPCRouter({
  syncHealthData: syncHealthDataController,
});

