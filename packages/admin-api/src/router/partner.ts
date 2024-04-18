import { createPartnerProfileController } from "../controllers/partners/create"
import { deletePartnerController } from "../controllers/partners/delete"
import { listPartnerController } from "../controllers/partners/list"
import { getPartnerController } from "../controllers/partners/get"
import { createTRPCRouter } from "../trpc"
import { updatePartnerProfileController } from "../controllers/partners/update"
import { publishPartnerController } from "../controllers/partners/publish"



export const partnerRouters = createTRPCRouter({
    create: createPartnerProfileController,
    publish: publishPartnerController,
    list: listPartnerController,
    delete: deletePartnerController,
    get: getPartnerController,
    update: updatePartnerProfileController
})