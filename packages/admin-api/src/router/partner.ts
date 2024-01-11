import { getPartnerController } from "../controllers/partners/getPartner"
import { listPatnersController } from "../controllers/partners/listPatners"
import { createTRPCRouter } from "../trpc"






const partnerRouters = createTRPCRouter({
    list: listPatnersController,
    get: getPartnerController
})


export { partnerRouters }