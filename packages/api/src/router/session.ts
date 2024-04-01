import { getSessionController } from "../controllers/sessions/get";
import { listSessionsController } from "../controllers/sessions/list";
import { createTRPCRouter } from "../trpc";



export const sessionController = createTRPCRouter({
    list: listSessionsController,
    get: getSessionController
})