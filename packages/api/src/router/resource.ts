import { listResourcesController } from "../controllers/resources/list";
import { createTRPCRouter } from "../trpc";



export const resourceRouter = createTRPCRouter({
    list: listResourcesController
})