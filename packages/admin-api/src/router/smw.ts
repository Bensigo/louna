import { createSmwController } from "../controllers/smw/create";
import { deleteSMWController } from "../controllers/smw/delete";
import { getSmwController } from "../controllers/smw/get";
import { listSMWController } from "../controllers/smw/list";
import { publishSMWController } from "../controllers/smw/publish";
import { updateSmwController } from "../controllers/smw/update";
import { createTRPCRouter } from "../trpc";


export const smwRouters = createTRPCRouter({
    create: createSmwController,
    list: listSMWController,
    get: getSmwController,
    publish: publishSMWController,
    edit: updateSmwController,
    delete: deleteSMWController
})