import { getConfigController } from "../controllers/config/get";
import { createTRPCRouter } from "../trpc";




export const configRouters = createTRPCRouter({
    get: getConfigController
})