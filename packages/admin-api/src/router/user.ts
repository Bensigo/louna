import { getPartnerController } from "../controllers/users/get"
import { listUsersController } from "../controllers/users/list"
import { createTRPCRouter } from "../trpc"






const usersRouters = createTRPCRouter({
    list: listUsersController,
    get: getPartnerController,
    
})


export { usersRouters }