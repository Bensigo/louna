import { createSessionController } from "../controllers/session/create";
import { deleteSessionController } from "../controllers/session/delete";
import { getSessionController } from "../controllers/session/get";
import { listSessionController } from "../controllers/session/list";
import { PublishSessionController } from "../controllers/session/publish";
import { updateSessionController } from "../controllers/session/update";
import { createTRPCRouter } from "../trpc";


export const sessionRouters = createTRPCRouter({
    create: createSessionController,
    list: listSessionController,
    delete: deleteSessionController,
    update: updateSessionController,
    get: getSessionController,
    publish: PublishSessionController
})