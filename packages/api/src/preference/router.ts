import { createTRPCRouter } from "../trpc";
import { createController, getController, updateController } from "./controller";




export const preferenceRouter = createTRPCRouter({
    create: createController,
    get: getController,
    update: updateController
})