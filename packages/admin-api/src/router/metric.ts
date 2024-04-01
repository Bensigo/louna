import { getStatsController } from "../controllers/metric/stats";
import { getUsersMetricController } from "../controllers/metric/users";
import { createTRPCRouter } from "../trpc";



export const metricRouters = createTRPCRouter({
    stats: getStatsController,
    userMetrics: getUsersMetricController
})