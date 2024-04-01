import { createResourceController } from "../controllers/resources/create";
import { deleteResourceController } from "../controllers/resources/delete";
import { getResourceController } from "../controllers/resources/get";
import { listResourceController } from "../controllers/resources/list";
import { pushlishResourceController } from "../controllers/resources/publish";
import { updateResourceController } from "../controllers/resources/update";
import { createTRPCRouter } from "../trpc";


export const resourceRouters = createTRPCRouter({
    create: createResourceController,
    update: updateResourceController,
    get: getResourceController,
    list: listResourceController,
    publish: pushlishResourceController,
    delete: deleteResourceController
})