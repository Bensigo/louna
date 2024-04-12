import { getSmwController } from "../controllers/smw/get";
import { listSmwController } from "../controllers/smw/list";
import { createTRPCRouter } from "../trpc";

export const smwRouter = createTRPCRouter({
    list: listSmwController,
    get: getSmwController
})