import { getUserGoalController } from "../controllers/goal/get";
import { UpadteGoalController } from "../controllers/goal/update";
import { createTRPCRouter } from "../trpc";



export const goalRouter = createTRPCRouter({
    get: getUserGoalController,
    update: UpadteGoalController
})