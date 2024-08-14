import { createTRPCRouter } from "../trpc";
import { createHealthDataController } from "./controller";

export const healthDataRouter = createTRPCRouter({
    createMany: createHealthDataController
});
